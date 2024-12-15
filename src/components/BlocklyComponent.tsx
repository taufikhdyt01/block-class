// BlocklyComponent.tsx
import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { initBlocklyLanguage, setBlocklyLanguage } from '@/utils/blockly/language';

interface BlocklyComponentProps {
    language: 'en' | 'id';
    toolboxXml: string;
    initialXml?: string;
    readOnly?: boolean;
    onWorkspaceChange: (workspace: Blockly.WorkspaceSvg) => void;
    challengeSlug?: string;
    isPlayground?: boolean;
    isSubmissionResult?: boolean;
}

const BlocklyComponent: React.FC<BlocklyComponentProps> = React.memo(({
    language,
    toolboxXml,
    initialXml,
    readOnly,
    onWorkspaceChange,
    challengeSlug,
    isPlayground = false,
    isSubmissionResult = false
}) => {
    const blocklyDiv = useRef<HTMLDivElement>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const previousLanguageRef = useRef(language);
    const isFirstRender = useRef(true);
    const flyoutRef = useRef<boolean>(false);
    const changeListenerRef = useRef<any>(null);
    const workspaceStateRef = useRef<string | null>(null);

    // Function to get session storage key (only for challenges)
    const getSessionKey = () => {
        if (isPlayground || isSubmissionResult) return null;
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        return challengeSlug ? `blockly_workspace_${challengeSlug}_${userId}` : null;
    };

    // Function to save workspace state
    const saveWorkspaceState = () => {
        if (!workspaceRef.current) return null;
        const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
        return Blockly.Xml.domToText(xml);
    };

    // Function to restore workspace state
    const restoreWorkspaceState = (xmlString: string) => {
        if (!workspaceRef.current) return;
        try {
            const dom = Blockly.utils.xml.textToDom(xmlString);
            Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspaceRef.current);
        } catch (error) {
            console.error('Error restoring workspace state:', error);
        }
    };

    // Function to save to session storage (only for challenges)
    const saveToSessionStorage = (workspace: Blockly.WorkspaceSvg) => {
        if (!workspace || isPlayground || isSubmissionResult) return;
        try {
            const sessionKey = getSessionKey();
            if (!sessionKey) return;

            const currentXml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(currentXml);
            sessionStorage.setItem(sessionKey, xmlText);
        } catch (error) {
            console.error('Error saving workspace to session storage:', error);
        }
    };

    // Function to load from session storage (only for challenges)
    const loadFromSessionStorage = (): string | null => {
        if (isPlayground || isSubmissionResult) return null;
        try {
            const sessionKey = getSessionKey();
            if (!sessionKey) return null;

            const saved = sessionStorage.getItem(sessionKey);
            if (!saved || saved.trim() === '') {
                return null;
            }
            return saved;
        } catch (error) {
            console.error('Error loading workspace from session storage:', error);
            return null;
        }
    };

    useEffect(() => {
        const initWorkspace = () => {
            if (!blocklyDiv.current || workspaceRef.current) return;

            try {
                // Initialize language
                initBlocklyLanguage(language);

                // Create workspace
                const workspace = Blockly.inject(blocklyDiv.current, {
                    toolbox: toolboxXml,
                    readOnly: readOnly,
                    trashcan: !readOnly,
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: '#ccc',
                        snap: true,
                    },
                });
                workspaceRef.current = workspace;

                // For submission results, always use initialXml
                if (isSubmissionResult && initialXml) {
                    restoreWorkspaceState(initialXml);
                }
                // For challenges, check session storage first
                else if (!isPlayground) {
                    const savedState = loadFromSessionStorage();
                    if (savedState) {
                        restoreWorkspaceState(savedState);
                    } else if (initialXml) {
                        restoreWorkspaceState(initialXml);
                    }
                }
                // For playground, use initialXml if provided
                else if (initialXml) {
                    restoreWorkspaceState(initialXml);
                }

                // Add change listener with debounce
                let timeoutId: NodeJS.Timeout;
                const changeListener = (event: Blockly.Events.Abstract) => {
                    if (event.type === Blockly.Events.BLOCK_MOVE ||
                        event.type === Blockly.Events.BLOCK_CHANGE ||
                        event.type === Blockly.Events.BLOCK_CREATE ||
                        event.type === Blockly.Events.BLOCK_DELETE) {

                        clearTimeout(timeoutId);
                        timeoutId = setTimeout(() => {
                            if (workspace) {
                                if (!isPlayground) {
                                    saveToSessionStorage(workspace);
                                }
                                // For playground, save state in memory
                                workspaceStateRef.current = saveWorkspaceState();
                                onWorkspaceChange(workspace);
                            }
                        }, 500);
                    }
                };

                workspace.addChangeListener(changeListener);
                changeListenerRef.current = changeListener;

                // Track flyout state
                workspace.addChangeListener((e) => {
                    if (e.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
                        flyoutRef.current = workspace.getFlyout()?.isVisible() || false;
                    }
                });

                // Trigger initial change
                onWorkspaceChange(workspace);
            } catch (error) {
                console.error('Error initializing Blockly workspace:', error);
            }
        };

        initWorkspace();

        return () => {
            if (workspaceRef.current) {
                if (changeListenerRef.current) {
                    workspaceRef.current.removeChangeListener(changeListenerRef.current);
                }
                if (!isPlayground) {
                    saveToSessionStorage(workspaceRef.current);
                }
                workspaceRef.current.dispose();
                workspaceRef.current = null;
            }
        };
    }, []);

    // Handle language changes
    useEffect(() => {
        if (!isFirstRender.current && workspaceRef.current && previousLanguageRef.current !== language) {
            try {
                // Store current workspace state
                if (isPlayground) {
                    // For playground, use in-memory state
                    workspaceStateRef.current = saveWorkspaceState();
                } else {
                    // For challenges, use session storage
                    saveToSessionStorage(workspaceRef.current);
                }

                // Get flyout state before language change
                const wasFlyoutVisible = flyoutRef.current;

                // Update language and toolbox
                setBlocklyLanguage(language);
                workspaceRef.current.updateToolbox(toolboxXml);

                // Restore workspace state
                if (isPlayground && workspaceStateRef.current) {
                    // For playground, restore from in-memory state
                    restoreWorkspaceState(workspaceStateRef.current);
                } else if (!isPlayground) {
                    // For challenges, restore from session storage
                    const savedState = loadFromSessionStorage();
                    if (savedState) {
                        restoreWorkspaceState(savedState);
                    }
                }

                // Restore flyout state
                if (!wasFlyoutVisible && workspaceRef.current.getFlyout()) {
                    workspaceRef.current.getFlyout()?.hide();
                }

                previousLanguageRef.current = language;
            } catch (error) {
                console.error('Error updating language:', error);
            }
        }
        isFirstRender.current = false;
    }, [language, toolboxXml]);

    return <div ref={blocklyDiv} style={{ height: '100%', width: '100%' }} />;
});

BlocklyComponent.displayName = 'BlocklyComponent';

export default BlocklyComponent;