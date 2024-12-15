import React, { useEffect, useState, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import * as Blockly from 'blockly';
import { WorkspaceSvg } from 'blockly';
import {
    Box,
    VStack,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Spinner,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Button,
    Flex,
    Icon,
    useColorModeValue,
    Select,
    Center,
    HStack,
    SimpleGrid,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { Challenge, getChallengeBySlug, getSubmissionById, Submission } from '@/services/api';
import ChallengeLayout from '@/components/ChallengeLayout';
import { getJavaScript, getPHP, getPython } from '@/utils/blockly/utils';
import { getToolboxXml } from '@/utils/blockly/toolbox';
import { FaArrowLeft, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import SEO from '@/components/SEO';

const ReuseSolutionButton = dynamic(() => import('@/components/ReuseSolutionButton'), {
    ssr: false
});

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Indonesia' }
];
declare global {
    interface Window {
        Blockly: typeof Blockly;
    }
}

const BlocklyComponent = dynamic(() => import('@/components/BlocklyComponent'), {
    ssr: false,
    loading: () => <Text>Memuat Blockly...</Text>
});

const HalamanHasil: NextPage = () => {
    const router = useRouter();
    const { slug, id } = router.query;
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jsCode, setJsCode] = useState('');
    const [phpCode, setPhpCode] = useState('');
    const [pythonCode, setPythonCode] = useState('');
    const toast = useToast();
    const [blocklyLanguage, setBlocklyLanguage] = useState<'en' | 'id'>('id');
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [challengeData, setChallengeData] = useState<Challenge | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (slug) {
                try {
                    setIsLoading(true);
                    const [submissionData, challengeData] = await Promise.all([
                        getSubmissionById(Number(id)),
                        getChallengeBySlug(slug as string)
                    ]);

                    setSubmission(submissionData.data);
                    setChallengeData(challengeData);

                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError('Gagal memuat data. Silakan coba lagi nanti.');
                    toast({
                        title: 'Error',
                        description: 'Gagal memuat data. Silakan coba lagi.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [id, slug, toast]);

    const handleWorkspaceChange = (workspace: WorkspaceSvg) => {
        workspaceRef.current = workspace;
        setJsCode(getJavaScript(workspace));
        setPhpCode(getPHP(workspace));
        setPythonCode(getPython(workspace));
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value as 'en' | 'id';
        setBlocklyLanguage(newLanguage);
    };

    const handleKembaliKeTantangan = () => {
        router.push(`/tantangan/${slug}`);
    };

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const codeBgColor = useColorModeValue('gray.50', 'gray.700');

    if (isLoading) {
        return (
            <ChallengeLayout slug={slug as string} challengeTitle="Memuat...">
                <Center height="300px">
                    <VStack spacing={4}>
                        <Spinner size="xl" thickness="4px" color="brand.500" />
                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                            Memuat hasil pengajuan...
                        </Text>
                    </VStack>
                </Center>
            </ChallengeLayout>
        );
    }

    if (!submission || !challengeData) {
        return (
            <ChallengeLayout
                slug={slug as string}
                challengeTitle="Memuat..."
            >
                <Center height="300px">
                    <VStack spacing={4}>
                        <Spinner size="xl" thickness="4px" color="brand.500" />
                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                            Memuat hasil pengajuan...
                        </Text>
                    </VStack>
                </Center>
            </ChallengeLayout>
        );
    }

    return (
        <>
            <SEO
                title={`Hasil Pengajuan #${submission?.id || ''}`}
                description={`Hasil pengajuan untuk tantangan ${challengeData?.title || ''}`}
            />
            <ChallengeLayout
                slug={slug as string}
                challengeTitle={challengeData?.title || 'Memuat...'}
                difficulty={challengeData?.difficulty}
                category={challengeData?.category}
            >
                <VStack spacing={8} align="stretch">
                    {/* Results Header */}
                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <VStack spacing={6} align="stretch">
                            <HStack justify="space-between" align="center">
                                <Heading size="lg">
                                    Hasil Pengajuan
                                </Heading>
                                <Badge
                                    size="lg"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    colorScheme={submission?.status === 'accepted' ? 'green' : 'red'}
                                    fontSize="sm"
                                >
                                    #{submission?.id}
                                </Badge>
                            </HStack>

                            <Box
                                p={6}
                                bg={submission?.status === 'accepted'
                                    ? useColorModeValue('green.50', 'green.900')
                                    : useColorModeValue('red.50', 'red.900')
                                }
                                borderRadius="lg"
                            >
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                    {/* Status & Score */}
                                    <HStack spacing={4}>
                                        <Icon
                                            as={submission?.status === 'accepted' ? FaCheckCircle : FaTimesCircle}
                                            w={8}
                                            h={8}
                                            color={submission?.status === 'accepted' ? 'green.500' : 'red.500'}
                                        />
                                        <VStack align="start" spacing={1}>
                                            <Text
                                                fontSize="2xl"
                                                fontWeight="bold"
                                                color={submission?.status === 'accepted' ? 'green.700' : 'red.700'}
                                                _dark={{
                                                    color: submission?.status === 'accepted' ? 'green.200' : 'red.200'
                                                }}
                                            >
                                                {submission?.status === 'accepted' ? 'Jawaban Benar' : 'Jawaban Salah'}
                                            </Text>
                                            <Text fontSize="lg" fontWeight="medium">
                                                Skor: {submission?.score} / 100
                                            </Text>
                                        </VStack>
                                    </HStack>

                                    {/* Time Info */}
                                    <VStack align={{ base: "start", md: "end" }} spacing={1}>
                                        <HStack>
                                            <Icon as={FaClock} />
                                            <Text fontSize="md" fontWeight="medium">
                                                Waktu Pengerjaan: {submission?.time_spent}
                                            </Text>
                                        </HStack>
                                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                                            Diajukan pada: {submission && new Date(submission.submitted_at).toLocaleString('id-ID')}
                                        </Text>
                                    </VStack>
                                </SimpleGrid>
                            </Box>
                        </VStack>
                    </Box>

                    {/* Blockly Section */}
                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" align="center">
                                <Heading size="md">Solusi Visual</Heading>
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

                            <Box
                                height="600px"
                                borderWidth={1}
                                borderColor={borderColor}
                                borderRadius="md"
                            >
                                {submission?.xml && (
                                    <BlocklyComponent
                                        key={blocklyLanguage}
                                        language={blocklyLanguage}
                                        toolboxXml={getToolboxXml(blocklyLanguage)}
                                        initialXml={submission.xml}
                                        readOnly={true}
                                        onWorkspaceChange={handleWorkspaceChange}
                                        isSubmissionResult={true}
                                    />
                                )}
                            </Box>

                            {/* Tambahkan ReuseSolutionButton di sini */}
                            {submission?.xml && (
                                <ReuseSolutionButton
                                    xml={submission.xml}
                                    challengeSlug={slug as string}
                                    timeSpent={submission.time_spent}
                                />
                            )}
                        </VStack>
                    </Box>

                    {/* Generated Code Section */}
                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <VStack spacing={4} align="stretch">
                            <Heading size="md">Kode yang Dihasilkan</Heading>
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
                                            <code>{phpCode}</code>
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
                                            <code>{jsCode}</code>
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
                                            <code>{pythonCode}</code>
                                        </Box>
                                    </TabPanel> */}
                                </TabPanels>
                            </Tabs>
                        </VStack>
                    </Box>

                    {/* Test Results Section */}
                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <VStack spacing={4} align="stretch">
                            <HStack justify="space-between">
                                <Heading size="md">Hasil Pengujian</Heading>
                                <HStack>
                                    <Badge colorScheme="green">
                                        {submission.test_results.filter(r => r.passed).length} Berhasil
                                    </Badge>
                                    <Badge colorScheme="red">
                                        {submission.test_results.filter(r => !r.passed).length} Gagal
                                    </Badge>
                                </HStack>
                            </HStack>

                            <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                                        <Tr>
                                            <Th textAlign="center">Kasus Uji</Th>
                                            <Th textAlign="center">Status</Th>
                                            <Th>Output Konsol</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {submission.test_results.map((result, index) => (
                                            <Tr
                                                key={index}
                                                bg={result.passed
                                                    ? useColorModeValue('green.50', 'green.900')
                                                    : useColorModeValue('red.50', 'red.900')
                                                }
                                            >
                                                <Td textAlign="center" fontWeight="medium">
                                                    #{index + 1}
                                                </Td>
                                                <Td textAlign="center">
                                                    <Badge
                                                        colorScheme={result.passed ? 'green' : 'red'}
                                                        px={3}
                                                        py={1}
                                                        borderRadius="full"
                                                    >
                                                        {result.passed ? 'Berhasil' : 'Gagal'}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Text
                                                        as="pre"
                                                        fontFamily="mono"
                                                        fontSize="sm"
                                                        whiteSpace="pre-wrap"
                                                    >
                                                        {result.consoleOutput || '-'}
                                                    </Text>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </VStack>
                    </Box>
                </VStack>
            </ChallengeLayout>
        </>
    );
};

export default HalamanHasil;