import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
    Box,
    Container,
    VStack,
    HStack,
    Text,
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
    Badge,
    Icon,
    Heading,
    Collapse,
    Flex,
    useToast,
} from '@chakra-ui/react';
import {
    FaPlay,
    FaCheck,
    FaChevronRight,
    FaChevronDown,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
} from 'react-icons/fa';
import { LANGUAGE_OPTIONS, getToolboxXml } from '@/utils/blockly';

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

interface PracticeSubmission {
    id: number;
    submitted_at: string;
    status: 'accepted' | 'wrong answer';
    score: number;
    time_spent: string;
}

interface TestCase {
    input: any;
    expected_output: any;
    is_sample: boolean;
}

interface Practice {
    id: number;
    title: string;
    description: string;
    constraints: string[];
    hints: string[];
    test_cases: TestCase[];
    max_attempts: number;
    initial_xml: string;
}

const PracticePage = () => {
    const [practice, setPractice] = useState<Practice>({
        id: 1,
        title: "Latihan Dasar Blockly",
        description: `Pada latihan ini, Anda akan membuat program sederhana menggunakan Blockly untuk memahami konsep dasar pemrograman.

Buatlah program yang dapat menghitung keliling persegi panjang dengan:
1. Menerima input panjang dan lebar
2. Menggunakan rumus: 2 * (panjang + lebar)
3. Mengembalikan hasil perhitungan`,
        constraints: [
            "Panjang dan lebar adalah bilangan positif",
            "Maksimal 3 kali pengajuan",
            "Waktu pengerjaan maksimal 30 menit"
        ],
        hints: [
            "Gunakan blok matematika untuk operasi perkalian dan penjumlahan",
            "Pastikan urutan operasi matematika sudah benar",
            "Perhatikan tipe data input dan output"
        ],
        test_cases: [
            { input: [5, 3], expected_output: 16, is_sample: true },
            { input: [4, 4], expected_output: 16, is_sample: true },
        ],
        max_attempts: 3,
        initial_xml: '<xml><block type="procedures_defreturn"></block></xml>'
    });

    const [submissions, setSubmissions] = useState<PracticeSubmission[]>([
        {
            id: 1,
            submitted_at: '2024-12-15T10:30:00',
            status: 'wrong answer',
            score: 50,
            time_spent: '00:05:30'
        },
        {
            id: 2,
            submitted_at: '2024-12-15T10:40:00',
            status: 'accepted',
            score: 100,
            time_spent: '00:08:45'
        }
    ]);

    const [workspace, setWorkspace] = useState(null);
    const [blocklyLanguage, setBlocklyLanguage] = useState<'en' | 'id'>('id');
    const [showHints, setShowHints] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [showSubmitButton, setShowSubmitButton] = useState(false);

    const router = useRouter();
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const codeBgColor = useColorModeValue('gray.50', 'gray.700');

    const handleWorkspaceChange = useCallback((newWorkspace: any) => {
        setWorkspace(newWorkspace);
        // Add code generation logic here
    }, []);

    const handleRunTests = useCallback(() => {
        setIsRunning(true);
        setTimeout(() => {
            setTestResults([
                { input: [5, 3], output: 16, expected: 16, passed: true },
                { input: [4, 4], output: 16, expected: 16, passed: true }
            ]);
            setShowSubmitButton(true);
            setIsRunning(false);
        }, 1000);
    }, []);

    const handleSubmit = useCallback(() => {
        setIsSubmitting(true);
        setTimeout(() => {
            const newSubmission: PracticeSubmission = {
                id: submissions.length + 1,
                submitted_at: new Date().toISOString(),
                status: 'accepted',
                score: 100,
                time_spent: '00:02:15'
            };
            setSubmissions([newSubmission, ...submissions]);
            setIsSubmitting(false);
            router.push(`/kelas/pemrograman-dasar/praktik/${practice.id}/hasil/${newSubmission.id}`);
        }, 1500);
    }, [submissions, practice.id, router]);

    const remainingAttempts = practice.max_attempts - submissions.length;

    return (
        <VStack spacing={8} align="stretch" py={8}>
            {/* Practice Header */}
            <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                        <Badge colorScheme="blue" fontSize="md" px={4} py={1}>
                            Praktik
                        </Badge>
                        <HStack>
                            <Badge colorScheme={remainingAttempts > 0 ? "green" : "red"}>
                                Sisa Kesempatan: {remainingAttempts}
                            </Badge>
                        </HStack>
                    </HStack>
                    <Heading size="lg">{practice.title}</Heading>
                </VStack>
            </Box>

            {/* Instructions */}
            <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <VStack align="stretch" spacing={4}>
                    <Text fontSize="lg" fontWeight="bold">Instruksi:</Text>
                    <Text whiteSpace="pre-line">{practice.description}</Text>
                </VStack>
            </Box>

            {/* Test Cases */}
            <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <VStack align="stretch" spacing={4}>
                    <Text fontSize="lg" fontWeight="bold">Contoh Kasus Uji:</Text>
                    {practice.test_cases.map((testCase, index) => (
                        <Box key={index} p={4} bg={codeBgColor} borderRadius="md">
                            <VStack align="stretch" spacing={2}>
                                <HStack>
                                    <Text fontWeight="medium">Input:</Text>
                                    <Text fontFamily="mono">{JSON.stringify(testCase.input)}</Text>
                                </HStack>
                                <HStack>
                                    <Text fontWeight="medium">Output yang Diharapkan:</Text>
                                    <Text fontFamily="mono">{testCase.expected_output}</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                </VStack>
            </Box>

            {/* Blockly Workspace */}
            <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">Area Kerja</Text>
                        <Select
                            value={blocklyLanguage}
                            onChange={(e) => setBlocklyLanguage(e.target.value as 'en' | 'id')}
                            width="200px"
                            size="sm"
                        >
                            <option value="id">Indonesia</option>
                            <option value="en">English</option>
                        </Select>
                    </HStack>
                    <Box height="600px" borderWidth={1} borderRadius="lg">
                        <BlocklyComponent
                            language={blocklyLanguage}
                            initialXml={practice.initial_xml}
                            toolboxXml={getToolboxXml(blocklyLanguage)}
                            onWorkspaceChange={handleWorkspaceChange}
                        />
                    </Box>
                </VStack>
            </Box>

            {/* Test Results */}
            <VStack spacing={4} align="stretch">
                <Button
                    colorScheme="brand"
                    onClick={handleRunTests}
                    size="lg"
                    isLoading={isRunning}
                    loadingText="Memproses..."
                    leftIcon={!isRunning ? <FaPlay /> : undefined}
                    isDisabled={remainingAttempts === 0}
                >
                    Jalankan Kode
                </Button>

                {testResults.length > 0 && (
                    <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                        <VStack align="stretch" spacing={4}>
                            <Text fontSize="lg" fontWeight="bold">Hasil Pengujian:</Text>
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
                                    {testResults.map((result, index) => (
                                        <Tr key={index}>
                                            <Td fontFamily="mono">{JSON.stringify(result.input)}</Td>
                                            <Td fontFamily="mono">{result.expected}</Td>
                                            <Td fontFamily="mono">{result.output}</Td>
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
                                    leftIcon={<FaCheck />}
                                    isLoading={isSubmitting}
                                    loadingText="Memproses..."
                                    isDisabled={remainingAttempts === 0}
                                >
                                    Kirim Jawaban
                                </Button>
                            )}
                        </VStack>
                    </Box>
                )}
            </VStack>

            {/* Submission History */}
            <Box bg={bgColor} p={6} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <VStack align="stretch" spacing={4}>
                    <Text fontSize="lg" fontWeight="bold">Riwayat Pengajuan:</Text>
                    {submissions.length > 0 ? (
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Waktu</Th>
                                    <Th>Status</Th>
                                    <Th>Skor</Th>
                                    <Th>Durasi</Th>
                                    <Th>Aksi</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {submissions.map((submission) => (
                                    <Tr key={submission.id}>
                                        <Td>
                                            {new Date(submission.submitted_at).toLocaleString('id-ID')}
                                        </Td>
                                        <Td>
                                            <Badge
                                                colorScheme={submission.status === 'accepted' ? 'green' : 'red'}
                                                px={3}
                                                py={1}
                                                borderRadius="full"
                                            >
                                                <HStack spacing={2}>
                                                    <Icon
                                                        as={submission.status === 'accepted' ? FaCheckCircle : FaTimesCircle}
                                                    />
                                                    <Text>
                                                        {submission.status === 'accepted' ? 'Berhasil' : 'Gagal'}
                                                    </Text>
                                                </HStack>
                                            </Badge>
                                        </Td>
                                        <Td>{submission.score}/100</Td>
                                        <Td>{submission.time_spent}</Td>
                                        <Td>
                                            <Button
                                                size="sm"
                                                colorScheme="brand"
                                                variant="ghost"
                                                leftIcon={<FaEye />}
                                                onClick={() => router.push(
                                                    `/kelas/pemrograman-dasar/praktik/${practice.id}/hasil/${submission.id}`
                                                )}
                                            >
                                                Lihat Hasil
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    ) : (
                        <Text>Belum ada pengajuan.</Text>
                    )}
                </VStack>
            </Box>
        </VStack>
    );
};

export default PracticePage;