import { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as Blockly from 'blockly';
import { useRouter } from 'next/router';
import { Center, Collapse, Container, ListItem, UnorderedList, useToast } from '@chakra-ui/react';
import {
    Box,
    Text,
    VStack,
    HStack,
    Badge,
    Button,
    Select,
    useColorModeValue,
    Alert,
    AlertIcon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Spinner,
} from '@chakra-ui/react';

import ChallengeLayout from '@/components/ChallengeLayout';
import { getJavaScript, getPHP, getPython, runJavaScript } from '@/utils/blockly/utils';
import { Challenge, TestCase, TestResult, getChallengeBySlug, submitChallenge } from '@/services/api';
import TimedChallenge from '@/components/TimedChallenge';
import {
    LANGUAGE_OPTIONS,
    getToolboxXml,
    setBlocklyLanguage,
    type LanguageOption
} from '@/utils/blockly';
import { FaCheck, FaChevronDown, FaChevronRight, FaPlay } from 'react-icons/fa';
import SEO from '@/components/SEO';

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
                <Spinner size="xl" color="brand.500" thickness="4px" />
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Memuat area kerja...
                </Text>
            </VStack>
        </Box>
    ),
});
const ChallengeProblemPage: NextPage = () => {
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null);
    const [generatedJavaScript, setGeneratedJavaScript] = useState('');
    const [generatedPHP, setGeneratedPHP] = useState('');
    const [generatedPython, setGeneratedPython] = useState('');
    const [sampleTestResults, setSampleTestResults] = useState<TestResult[]>([]);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [timeSpent, setTimeSpent] = useState<number>(0);
    const [blocklyLanguage, setBlocklyLanguage] = useState<'en' | 'id'>('id');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTimeUpdate = useCallback((time: number) => {
        setTimeSpent(time);
    }, []);

    const router = useRouter();
    const { slug } = router.query;

    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const codeBgColor = useColorModeValue('gray.50', 'gray.700');

    const handleWorkspaceChange = useCallback((newWorkspace: Blockly.WorkspaceSvg) => {
        setWorkspace(newWorkspace);
        try {
            const jsCode = getJavaScript(newWorkspace);
            const phpCode = getPHP(newWorkspace);
            const pythonCode = getPython(newWorkspace);
            setGeneratedJavaScript(jsCode);
            setGeneratedPHP(phpCode);
            setGeneratedPython(pythonCode);
        } catch (error) {
            console.error('Error generating code:', error);
            setGeneratedJavaScript('// Error generating JavaScript code');
            setGeneratedPHP('// Error generating PHP code');
            setGeneratedPython('# Error generating Python code');
        }
    }, []);

    const runTests = useCallback((testCases: TestCase[]): TestResult[] => {
        if (generatedJavaScript && challenge) {
            return testCases.map(testCase => {
                const { result, output } = runJavaScript(generatedJavaScript, challenge.function_name, testCase.input);
                const passed = result === testCase.expected_output;
                return {
                    input: testCase.input,
                    output: result,
                    expected: testCase.expected_output,
                    passed,
                    consoleOutput: output
                };
            });
        }
        return [];
    }, [generatedJavaScript, challenge]);

    const handleRunSampleTests = useCallback(() => {
        if (challenge) {
            setIsRunning(true);
            try {
                const sampleTestCases = challenge.test_cases.filter(tc => tc.is_sample);
                const results = runTests(sampleTestCases);
                setSampleTestResults(results);
                setShowSubmitButton(true);
            } finally {
                setIsRunning(false);
            }
        }
    }, [challenge, runTests]);

    const handleSubmit = useCallback(async () => {
        if (challenge && workspace) {
            setIsSubmitting(true);
            try {
                const results = runTests(challenge.test_cases);
                const score = (results.filter(r => r.passed).length / results.length) * 100;
                const xmlDom = Blockly.Xml.workspaceToDom(workspace);
                const blocklyXml = Blockly.Xml.domToText(xmlDom);

                const submission = {
                    challenge_id: challenge.id,
                    xml: blocklyXml,
                    status: score === 100 ? 'accepted' : 'wrong answer',
                    score,
                    time_spent: timeSpent,
                    test_results: results.map((result, index) => ({
                        test_case_id: challenge.test_cases[index].id,
                        passed: result.passed,
                        output: JSON.stringify(result.output),
                        console_output: result.consoleOutput
                    }))
                };

                const response = await submitChallenge(submission);

                // Clear session storage and reset workspace
                const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
                const timerKey = `challenge_${challenge.slug}_${userId}_start`;
                const activeKey = `challenge_${challenge.slug}_${userId}_active`;
                const sessionKey = `blockly_workspace_${challenge.slug}_${userId}`;

                // Clear all related storage
                localStorage.removeItem(timerKey);
                localStorage.removeItem(activeKey);
                sessionStorage.removeItem(sessionKey);

                // Reset workspace to initial state
                if (workspace && challenge.initial_xml) {
                    const parser = new DOMParser();
                    const xmlDom = parser.parseFromString(challenge.initial_xml, "text/xml");
                    Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom.documentElement, workspace);
                }

                // Clear other states
                setGeneratedJavaScript('');
                setGeneratedPHP('');
                setGeneratedPython('');
                setSampleTestResults([]);
                setShowSubmitButton(false);

                // Navigate to results page
                router.push(`/tantangan/${challenge.slug}/hasil/${response.data.id}`);
            } catch (error) {
                console.error('Error submitting challenge:', error);
                toast({
                    title: 'Submission failed',
                    description: 'There was an error submitting your solution. Please try again.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    }, [challenge, workspace, runTests, router, toast, timeSpent]);

    useEffect(() => {
        return () => {
            // Clear session storage when unmounting if not in results page
            if (challenge && !router.asPath.includes('/hasil/')) {
                const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
                const sessionKey = `blockly_workspace_${challenge.slug}_${userId}`;
                sessionStorage.removeItem(sessionKey);
            }
        };
    }, [challenge, router.asPath]);

    useEffect(() => {
        if (slug) {
            const fetchChallenge = async () => {
                try {
                    const data = await getChallengeBySlug(slug as string);
                    setChallenge(data);
                } catch (err) {
                    setError('Gagal memuat tantangan. Silakan coba lagi nanti.');
                    console.error('Error fetching challenge:', err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchChallenge();
        }
    }, [slug]);

    useEffect(() => {
        if (workspace && challenge) {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
            const sessionKey = `blockly_workspace_${challenge.slug}_${userId}`;
            const savedState = sessionStorage.getItem(sessionKey);

            // Hanya load initial XML jika workspace baru dibuat dan tidak ada saved state
            if (!savedState && challenge.initial_xml && workspace.getAllBlocks(false).length === 0) {
                try {
                    const parser = new DOMParser();
                    const xmlDom = parser.parseFromString(challenge.initial_xml, "text/xml");
                    Blockly.Xml.clearWorkspaceAndLoadFromXml(xmlDom.documentElement, workspace);
                } catch (error) {
                    console.error('Error loading initial XML:', error);
                }
            }
        }
    }, [workspace, challenge]);

    useEffect(() => {
        return () => {
            // Clear session storage when component unmounts if submitted
            if (challenge) {
                const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
                const sessionKey = `blockly_workspace_${challenge.slug}_${userId}`;
                if (showSubmitButton) {
                    sessionStorage.removeItem(sessionKey);
                }
            }
        };
    }, [challenge, showSubmitButton]);

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={20}>
                <Center flexDirection="column" gap={4}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Memuat tantangan...
                    </Text>
                </Center>
            </Container>
        );
    }

    if (error || !challenge) {
        return (
            <Box textAlign="center" py={10}>
                <Text color="red.500">{error || 'Challenge not found'}</Text>
            </Box>
        );
    }

    const difficultyColor = {
        easy: 'green',
        medium: 'yellow',
        hard: 'red',
    }[challenge.difficulty];

    return (
        <>
            <SEO
                title={
                    isLoading
                        ? "Memuat..."
                        : challenge?.title || "Tantangan Tidak Ditemukan"
                }
            />
            <ChallengeLayout
                slug={challenge?.slug || ''}
                challengeTitle={challenge?.title || ''}
                difficulty={challenge?.difficulty as 'easy' | 'medium' | 'hard'}
                category={challenge?.category}
            >
                <TimedChallenge
                    challenge={challenge}
                    onSubmit={handleSubmit}
                    onTimeUpdate={handleTimeUpdate}
                >
                    <VStack spacing={8} align="stretch">
                        {/* Problem Description Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <VStack align="stretch" spacing={4}>
                                <Text fontSize="lg" fontWeight="bold">Instruksi:</Text>
                                <Text
                                    fontSize="lg"
                                    whiteSpace="pre-line"
                                    color={useColorModeValue('gray.700', 'gray.300')}
                                >
                                    {challenge.description}
                                </Text>
                            </VStack>
                        </Box>

                        {/* Sample Test Cases Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <VStack align="stretch" spacing={4}>
                                <Text fontSize="lg" fontWeight="bold">Contoh Kasus Uji:</Text>
                                {challenge.test_cases.filter(tc => tc.is_sample).map((testCase, index) => (
                                    <Box
                                        key={index}
                                        p={4}
                                        bg={useColorModeValue('gray.50', 'gray.700')}
                                        borderRadius="md"
                                    >
                                        <VStack align="stretch" spacing={2}>
                                            <HStack>
                                                <Text fontWeight="medium">Input:</Text>
                                                <Text fontFamily="mono">{JSON.stringify(testCase.input)}</Text>
                                            </HStack>
                                            <HStack>
                                                <Text fontWeight="medium">Output yang Diharapkan:</Text>
                                                <Text fontFamily="mono">{JSON.stringify(testCase.expected_output)}</Text>
                                            </HStack>
                                        </VStack>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>

                        {/* Constraints Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <VStack align="stretch" spacing={4}>
                                <Text fontSize="lg" fontWeight="bold">Batasan:</Text>
                                <UnorderedList spacing={2} pl={4}>
                                    {challenge.constraints.map((constraint, index) => (
                                        <ListItem key={index}>{constraint}</ListItem>
                                    ))}
                                </UnorderedList>
                            </VStack>
                        </Box>

                        {/* Hints Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <VStack align="stretch" spacing={4}>
                                <Button
                                    onClick={() => setShowHints(!showHints)}
                                    variant="outline"
                                    leftIcon={showHints ? <FaChevronDown /> : <FaChevronRight />}
                                    size="sm"
                                >
                                    {showHints ? 'Sembunyikan Petunjuk' : 'Tampilkan Petunjuk'}
                                </Button>
                                <Collapse in={showHints}>
                                    <VStack align="stretch" spacing={3}>
                                        {challenge.hints.map((hint, index) => (
                                            <Alert key={index} status="info" variant="left-accent">
                                                <AlertIcon />
                                                {hint}
                                            </Alert>
                                        ))}
                                    </VStack>
                                </Collapse>
                            </VStack>
                        </Box>

                        {/* Blockly Editor Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="lg"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                        >
                            <VStack align="stretch" spacing={4}>
                                <HStack justify="space-between" align="center">
                                    <Text fontSize="lg" fontWeight="bold">Editor Visual</Text>
                                    <Select
                                        value={blocklyLanguage}
                                        onChange={(e) => setBlocklyLanguage(e.target.value as 'en' | 'id')}
                                        width="200px"
                                        size="sm"
                                    >
                                        {LANGUAGE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </HStack>
                                <Box height="600px" borderWidth={1} borderRadius="lg" overflow="hidden">
                                    <BlocklyComponent
                                        language={blocklyLanguage}
                                        toolboxXml={getToolboxXml(blocklyLanguage)}
                                        onWorkspaceChange={handleWorkspaceChange}
                                        challengeSlug={challenge.slug}
                                        initialXml={challenge.initial_xml}
                                    />
                                </Box>
                            </VStack>
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
                            <VStack align="stretch" spacing={4}>
                                <Text fontSize="lg" fontWeight="bold">Kode yang Dihasilkan:</Text>
                                <Tabs variant="soft-rounded" colorScheme="brand">
                                    <TabList>
                                        <Tab>PHP</Tab>
                                        <Tab>JavaScript</Tab>
                                        {/* Python Hide terlebih dahulu */}
                                        {/* <Tab>Python</Tab> */}
                                    </TabList>

                                    <TabPanels>
                                        <TabPanel px={0}>
                                            <Box
                                                as="pre"
                                                p={4}
                                                bg={codeBgColor}
                                                borderRadius="md"
                                                overflowX="auto"
                                                fontSize="sm"
                                                fontFamily="mono"
                                            >
                                                <code>{generatedPHP || '// Kode PHP akan muncul di sini'}</code>
                                            </Box>
                                        </TabPanel>

                                        <TabPanel px={0}>
                                            <Box
                                                as="pre"
                                                p={4}
                                                bg={codeBgColor}
                                                borderRadius="md"
                                                overflowX="auto"
                                                fontSize="sm"
                                                fontFamily="mono"
                                            >
                                                <code>{generatedJavaScript || '// Kode JavaScript akan muncul di sini'}</code>
                                            </Box>
                                        </TabPanel>
                                        {/* Python Hide terlebih dahulu */}
                                        {/* <TabPanel px={0}>
                                            <Box
                                                as="pre"
                                                p={4}
                                                bg={codeBgColor}
                                                borderRadius="md"
                                                overflowX="auto"
                                                fontSize="sm"
                                                fontFamily="mono"
                                            >
                                                <code>{generatedPython || '# Kode Python akan muncul di sini'}</code>
                                            </Box>
                                        </TabPanel> */}
                                    </TabPanels>
                                </Tabs>
                            </VStack>
                        </Box>

                        {/* Test Results Section */}
                        <VStack spacing={4} align="stretch">
                            <Button
                                colorScheme="brand"
                                onClick={handleRunSampleTests}
                                size="lg"
                                isLoading={isRunning}
                                loadingText="Memproses..."
                                leftIcon={!isRunning ? <FaPlay /> : undefined}
                            >
                                Jalankan Kode
                            </Button>

                            {sampleTestResults.length > 0 && (
                                <Box
                                    bg={useColorModeValue('white', 'gray.800')}
                                    p={6}
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    borderWidth={1}
                                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                                >
                                    <VStack align="stretch" spacing={4}>
                                        <Text fontSize="lg" fontWeight="bold">Hasil Uji Sampel:</Text>
                                        <Table variant="simple">
                                            <Thead>
                                                <Tr>
                                                    <Th>Input</Th>
                                                    <Th>Output yang Diharapkan</Th>
                                                    <Th>Output Anda</Th>
                                                    <Th>Status</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {sampleTestResults.map((result, index) => (
                                                    <Tr key={index}>
                                                        <Td fontFamily="mono">{JSON.stringify(result.input)}</Td>
                                                        <Td fontFamily="mono">{JSON.stringify(result.expected)}</Td>
                                                        <Td fontFamily="mono">{JSON.stringify(result.output)}</Td>
                                                        <Td>
                                                            <Badge
                                                                colorScheme={result.passed ? 'green' : 'red'}
                                                                px={3}
                                                                py={1}
                                                                borderRadius="full"
                                                            >
                                                                {result.passed ? 'Berhasil' : 'Gagal'}
                                                            </Badge>
                                                        </Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>

                                        {showSubmitButton && (
                                            <Button
                                                colorScheme="green"
                                                onClick={handleSubmit}
                                                size="lg"
                                                leftIcon={!isSubmitting ? <FaCheck /> : undefined}
                                                isLoading={isSubmitting}
                                                loadingText="Memproses..."
                                            >
                                                Kirim Jawaban
                                            </Button>
                                        )}
                                    </VStack>
                                </Box>
                            )}
                        </VStack>
                    </VStack>
                </TimedChallenge>
            </ChallengeLayout>
        </>
    );
};

export default ChallengeProblemPage;