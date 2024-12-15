import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as Blockly from 'blockly';
import {
    Box,
    VStack,
    Heading,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text,
    useToast,
    Select,
    Flex,
    Textarea,
    HStack,
    Container,
    Icon,
    Badge,
    Tooltip,
    useColorModeValue,
} from '@chakra-ui/react';
import { getJavaScript, getPHP, getPython } from '@/utils/blockly/utils';
import { getToolboxXml } from '@/utils/blockly/toolbox';
import { FaPlay, FaTrash, FaGlobe, FaCode } from 'react-icons/fa';
import SEO from '@/components/SEO';
import { Copy, MousePointer, RotateCcw, Trash } from 'lucide-react';

const BlocklyComponent = dynamic(() => import('@/components/BlocklyComponent'), {
    ssr: false,
    loading: () => (
        <Box
            height="500px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderRadius="lg"
            borderStyle="dashed"
        >
            <VStack spacing={4}>
                <Text fontSize="lg">Memuat Blockly...</Text>
                <Text color="gray.500">Mohon tunggu sebentar</Text>
            </VStack>
        </Box>
    ),
});

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Indonesia' }
] as const;

const PlaygroundPage: NextPage = () => {
    const [blocklyLanguage, setBlocklyLanguage] = useState<'en' | 'id'>('id');
    const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
    const [jsCode, setJsCode] = useState('');
    const [phpCode, setPhpCode] = useState('');
    const [pythonCode, setPythonCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const toast = useToast();

    const handleWorkspaceChange = useCallback((newWorkspace: Blockly.WorkspaceSvg) => {
        setWorkspace(newWorkspace);
        try {
            const js = getJavaScript(newWorkspace);
            const php = getPHP(newWorkspace);
            const python = getPython(newWorkspace);
            setJsCode(js);
            setPhpCode(php);
            setPythonCode(python);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan';
            console.error('Error generating code:', errorMessage);
            setJsCode('// Terjadi kesalahan saat menghasilkan kode JavaScript');
            setPhpCode('// Terjadi kesalahan saat menghasilkan kode PHP');
            setPythonCode('# Terjadi kesalahan saat menghasilkan kode Python');
        }
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBlocklyLanguage(e.target.value as 'en' | 'id');
    };

    const handleRunCode = () => {
        setIsRunning(true);
        setOutput('');

        try {
            // Simpan console methods asli
            const originalConsoleLog = console.log;
            const originalConsoleError = console.error;
            const originalAlert = window.alert;
            const logs: string[] = [];

            // Override console methods dan alert
            console.log = (...args) => {
                logs.push(args.map(arg => String(arg)).join(' '));
            };
            console.error = (...args) => {
                logs.push('Error: ' + args.map(arg => String(arg)).join(' '));
            };
            window.alert = (message) => {
                logs.push(message);
            };

            // Jalankan kode
            eval(jsCode);

            // Kembalikan console methods dan alert
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
            window.alert = originalAlert;

            // Tampilkan output
            setOutput(logs.join('\n'));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui';
            setOutput(`Error: ${errorMessage}`);
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsRunning(false);
        }
    };

    const handleClearWorkspace = () => {
        if (workspace) {
            workspace.clear();
            setOutput('');
            toast({
                title: 'Workspace Dibersihkan',
                description: 'Semua blok telah dihapus',
                status: 'info',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const codeBgColor = useColorModeValue('gray.50', 'gray.800');
    const codeBorderColor = useColorModeValue('gray.200', 'gray.600');
    const codeTextColor = useColorModeValue('gray.800', 'gray.100');

    return (
        <>
            <SEO title="Simulasi" />
            <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 60px)">
                <Container maxW="container.xl" py={8}>
                    <VStack spacing={8} align="stretch">
                        {/* Header Section */}
                        <Box textAlign="center" pt={4} pb={8}>
                            <Heading
                                size="2xl"
                                bgGradient="linear(to-r, brand.500, brand.300)"
                                bgClip="text"
                                lineHeight={1.4}
                            >
                                Area Simulasi
                            </Heading>
                            <Text
                                color={useColorModeValue('gray.600', 'gray.400')}
                                fontSize="lg"
                                mt={4}
                            >
                                Praktikkan pemrograman dengan menyusun blok-blok kode secara visual
                            </Text>
                        </Box>

                        {/* Control Panel - Compact version */}
                        <Flex
                            justify="space-between"
                            align="center"
                            bg={useColorModeValue('white', 'gray.800')}
                            p={4}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <HStack spacing={4}>
                                <HStack>
                                    <Icon as={FaGlobe} color="gray.500" />
                                    <Select
                                        value={blocklyLanguage}
                                        onChange={handleLanguageChange}
                                        width="200px"
                                        size="sm"
                                    >
                                        {LANGUAGE_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </HStack>
                                <Tooltip label="Bersihkan semua blok">
                                    <Button
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={handleClearWorkspace}
                                        leftIcon={<FaTrash />}
                                        size="sm"
                                    >
                                        Bersihkan
                                    </Button>
                                </Tooltip>
                            </HStack>

                            <TipsGuide />
                        </Flex>

                        {/* Blockly Workspace */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            borderRadius="lg"
                            overflow="hidden"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <Box height="500px">
                                <BlocklyComponent
                                    language={blocklyLanguage}
                                    toolboxXml={getToolboxXml(blocklyLanguage)}
                                    onWorkspaceChange={handleWorkspaceChange}
                                    isPlayground={true}
                                />
                            </Box>
                        </Box>

                        {/* Generated Code Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <HStack justify="space-between" align="center" mb={6}>
                                <HStack>
                                    <Icon as={FaCode} />
                                    <Heading size="md">Kode yang Dihasilkan</Heading>
                                </HStack>
                                <Tooltip label="Jalankan kode program">
                                    <Button
                                        colorScheme="brand"
                                        onClick={handleRunCode}
                                        isLoading={isRunning}
                                        isDisabled={!jsCode}
                                        leftIcon={<Icon as={FaPlay} />}
                                        size="sm"
                                    >
                                        Jalankan
                                    </Button>
                                </Tooltip>
                            </HStack>

                            <Tabs
                                variant="soft-rounded"
                                colorScheme="brand"
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                p={4}
                                borderRadius="md"
                            >
                                <TabList mb={4}>
                                    <Tab><HStack><Text>PHP</Text></HStack></Tab>
                                    <Tab><HStack><Text>JavaScript</Text></HStack></Tab>
                                    {/* Python Hide terlebih dahulu */}
                                    {/* <Tab><HStack><Text>Python</Text></HStack></Tab> */}
                                </TabList>

                                <TabPanels>
                                    <TabPanel p={0}>
                                        <Box
                                            as="pre"
                                            p={4}
                                            bg={codeBgColor}
                                            color={codeTextColor}
                                            borderRadius="md"
                                            borderWidth="1px"
                                            borderColor={codeBorderColor}
                                            overflow="auto"
                                            whiteSpace="pre-wrap"
                                            minH="150px"
                                            fontSize="sm"
                                            fontFamily="mono"
                                        >
                                            <code>{phpCode || '// Belum ada kode yang dihasilkan'}</code>
                                        </Box>
                                    </TabPanel>

                                    <TabPanel p={0}>
                                        <Box
                                            as="pre"
                                            p={4}
                                            bg={codeBgColor}
                                            color={codeTextColor}
                                            borderRadius="md"
                                            borderWidth="1px"
                                            borderColor={codeBorderColor}
                                            overflow="auto"
                                            whiteSpace="pre-wrap"
                                            minH="150px"
                                            fontSize="sm"
                                            fontFamily="mono"
                                        >
                                            <code>{jsCode || '// Belum ada kode yang dihasilkan'}</code>
                                        </Box>
                                    </TabPanel>
                                    {/* Python Hide terlebih dahulu */}
                                    {/* <TabPanel p={0}>
                                        <Box
                                            as="pre"
                                            p={4}
                                            bg={codeBgColor}
                                            color={codeTextColor}
                                            borderRadius="md"
                                            borderWidth="1px"
                                            borderColor={codeBorderColor}
                                            overflow="auto"
                                            whiteSpace="pre-wrap"
                                            minH="150px"
                                            fontSize="sm"
                                            fontFamily="mono"
                                        >
                                            <code>{pythonCode || '# Belum ada kode yang dihasilkan'}</code>
                                        </Box>
                                    </TabPanel> */}
                                </TabPanels>
                            </Tabs>
                        </Box>

                        {/* Output Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <HStack mb={4}>
                                <Heading size="md">Output Program</Heading>
                                {output && (
                                    <Badge colorScheme="green">Program Berjalan</Badge>
                                )}
                            </HStack>
                            <Textarea
                                value={output}
                                isReadOnly
                                minH="150px"
                                bg={codeBgColor}
                                color={codeTextColor}
                                borderColor={codeBorderColor}
                                placeholder="Output program akan muncul di sini..."
                                fontSize="sm"
                                fontFamily="mono"
                                p={4}
                                _placeholder={{
                                    color: useColorModeValue('gray.500', 'gray.400')
                                }}
                            />
                        </Box>
                    </VStack>
                </Container>
            </Box>
        </>
    );
};

const TipsGuide = () => {
    const tips = [
        {
            icon: <MousePointer size={16} />,
            title: "Drag & Drop",
            description: "Drag blok dari toolbox ke workspace"
        },
        {
            icon: <Copy size={16} />,
            title: "Duplikat Blok",
            description: "Klik kanan pada blok, pilih 'Duplikasi'"
        },
        {
            icon: <Trash size={16} />,
            title: "Hapus Blok",
            description: "Delete atau drag ke tempat sampah"
        },
        {
            icon: <RotateCcw size={16} />,
            title: "Undo/Redo",
            description: "Ctrl + Z untuk undo, Ctrl + Y untuk redo"
        }
    ];

    return (
        <HStack spacing={6}>
            {tips.map((tip, index) => (
                <Tooltip
                    key={index}
                    label={`${tip.title}: ${tip.description}`}
                    hasArrow
                >
                    <HStack spacing={1} cursor="help">
                        <Box color="blue.500">
                            {tip.icon}
                        </Box>
                        <Text fontSize="sm" fontWeight="medium">
                            {tip.title}
                        </Text>
                    </HStack>
                </Tooltip>
            ))}
        </HStack>
    );
};


export default PlaygroundPage;