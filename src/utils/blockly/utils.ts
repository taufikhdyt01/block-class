import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript';
import { phpGenerator } from 'blockly/php';
import { pythonGenerator } from 'blockly/python';

export function getJavaScript(workspace: Blockly.Workspace): string {
    return javascriptGenerator.workspaceToCode(workspace);
}

export function getPHP(workspace: Blockly.Workspace): string {
    return phpGenerator.workspaceToCode(workspace);
}

export function getPython(workspace: Blockly.Workspace): string {
    return pythonGenerator.workspaceToCode(workspace);
}

export function runJavaScript(code: string, functionName: string, args: any[]): { result: any, output: string } {
    let consoleOutput = '';
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalAlert = window.alert;

    console.log = (...args) => {
        consoleOutput += args.map(arg => JSON.stringify(arg)).join(' ') + '\n';
    };

    console.error = (...args) => {
        consoleOutput += 'Error: ' + args.map(arg => JSON.stringify(arg)).join(' ') + '\n';
    };

    window.alert = (message) => {
        consoleOutput += 'Alert: ' + message + '\n';
    };

    try {
        const wrappedCode = `
            ${code}
            return ${functionName};
        `;
        const func = new Function(wrappedCode)();
        if (typeof func !== 'function') {
            throw new Error(`${functionName} is not a function`);
        }
        const result = func(...args);
        return { 
            result: result === undefined ? null : result,
            output: consoleOutput 
        };
    } catch (error) {
        return { 
            result: null, 
            output: `Error: ${error}\n${consoleOutput}` 
        };
    } finally {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        window.alert = originalAlert;
    }
}