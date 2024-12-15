import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Spinner,
    Text,
    Box,
    Badge,
    HStack,
    Icon,
    useToast,
    useColorModeValue,
    Flex,
    Tooltip,
} from '@chakra-ui/react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaEye, FaPaperPlane } from 'react-icons/fa';
import ChallengeLayout from '@/components/ChallengeLayout';
import { getSubmissionsByChallenge, getChallengeBySlug, Challenge, SubmissionList } from '@/services/api';
import SEO from '@/components/SEO';

const HalamanPengajuanTantangan: NextPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [submissions, setSubmissions] = useState<SubmissionList[]>([]);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            if (slug && typeof slug === 'string') {
                try {
                    setIsLoading(true);
                    const [submissionsResponse, challengeData] = await Promise.all([
                        getSubmissionsByChallenge(slug),
                        getChallengeBySlug(slug)
                    ]);

                    if (submissionsResponse.success) {
                        setSubmissions(submissionsResponse.data);
                    } else {
                        throw new Error(submissionsResponse.message);
                    }

                    setChallenge(challengeData);
                } catch (err) {
                    console.error('Error fetching data:', err);
                    setError(err instanceof Error ? err.message : 'Gagal memuat data. Silakan coba lagi nanti.');
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
    }, [slug, toast]);

    const handleLihatHasil = (submissionId: number) => {
        router.push(`/tantangan/${slug}/hasil/${submissionId}`);
    };

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const formatTimeSpent = (timeString: string): string => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);

        if (hours > 0) {
            return `${hours} jam ${minutes} menit`;
        }
        if (minutes > 0) {
            return `${minutes} menit ${seconds} detik`;
        }
        return `${seconds} detik`;
    };

    if (isLoading) {
        return (
            <ChallengeLayout
                slug={slug as string}
                challengeTitle="Memuat..."
                difficulty={challenge?.difficulty}
                category={challenge?.category}
            >
                <Box
                    height="300px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <VStack spacing={4}>
                        <Spinner
                            size="xl"
                            thickness="4px"
                            color="brand.500"
                        />
                        <Text color={useColorModeValue('gray.600', 'gray.400')}>
                            Memuat data pengajuan...
                        </Text>
                    </VStack>
                </Box>
            </ChallengeLayout>
        );
    }

    if (error) {
        return (
            <ChallengeLayout slug={slug as string} challengeTitle="Error">
                <VStack spacing={8} align="center" justify="center" height="300px">
                    <Text color="red.500">{error}</Text>
                </VStack>
            </ChallengeLayout>
        );
    }

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
                slug={slug as string}
                challengeTitle={challenge?.title || 'Tantangan'}
                difficulty={challenge?.difficulty}
                category={challenge?.category}
            >
                <VStack spacing={8} align="stretch">
                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <VStack align="stretch" spacing={6}>
                            <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                    <Icon as={FaPaperPlane} color="brand.500" w={6} h={6} />
                                    <Text fontSize="2xl" fontWeight="bold">
                                        Riwayat Pengajuan
                                    </Text>
                                </HStack>
                                <Badge
                                    colorScheme="brand"
                                    p={2}
                                    borderRadius="full"
                                >
                                    Total: {submissions.length} pengajuan
                                </Badge>
                            </HStack>

                            {submissions.length === 0 ? (
                                <Box
                                    p={8}
                                    textAlign="center"
                                    bg={useColorModeValue('gray.50', 'gray.700')}
                                    borderRadius="md"
                                >
                                    <VStack spacing={4}>
                                        <Icon
                                            as={FaCheckCircle}
                                            w={10}
                                            h={10}
                                            color="gray.400"
                                        />
                                        <Text fontSize="lg">
                                            Belum ada pengajuan untuk tantangan ini.
                                        </Text>
                                        <Button
                                            colorScheme="brand"
                                            onClick={() => router.push(`/tantangan/${slug}`)}
                                        >
                                            Coba Sekarang
                                        </Button>
                                    </VStack>
                                </Box>
                            ) : (
                                <Box overflowX="auto">
                                    <Table variant="simple">
                                        <Thead>
                                            <Tr>
                                                <Th>Waktu Pengajuan</Th>
                                                <Th>Status</Th>
                                                <Th>Skor</Th>
                                                <Th>Waktu Pengerjaan</Th>
                                                <Th textAlign="center">Aksi</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {submissions.map((submission) => (
                                                <Tr
                                                    key={submission.id}
                                                    _hover={{
                                                        bg: useColorModeValue('gray.50', 'gray.700'),
                                                    }}
                                                >
                                                    <Td>
                                                        <VStack align="start" spacing={1}>
                                                            <Text>
                                                                {new Date(submission.submitted_at).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </Text>
                                                            <Text fontSize="sm" color="gray.500">
                                                                {new Date(submission.submitted_at).toLocaleTimeString('id-ID')}
                                                            </Text>
                                                        </VStack>
                                                    </Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={submission.status === 'accepted' ? 'green' : 'red'}
                                                            p={2}
                                                            borderRadius="full"
                                                            display="flex"
                                                            alignItems="center"
                                                            width="fit-content"
                                                        >
                                                            <Icon
                                                                as={submission.status === 'accepted' ? FaCheckCircle : FaTimesCircle}
                                                                mr={2}
                                                            />
                                                            {submission.status === 'accepted' ? 'Jawaban Benar' : 'Jawaban Salah'}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        <HStack>
                                                            <Text fontWeight="bold" fontSize="lg">
                                                                {submission.score}
                                                            </Text>
                                                            <Text color="gray.500">/ 100</Text>
                                                        </HStack>
                                                    </Td>
                                                    <Td>
                                                        <Tooltip
                                                            label="Waktu pengerjaan"
                                                            placement="top"
                                                        >
                                                            <HStack
                                                                color={useColorModeValue('gray.600', 'gray.400')}
                                                            >
                                                                <Icon as={FaClock} />
                                                                <Text>
                                                                    {formatTimeSpent(submission.time_spent)}
                                                                </Text>
                                                            </HStack>
                                                        </Tooltip>
                                                    </Td>
                                                    <Td textAlign="center">
                                                        <Button
                                                            onClick={() => handleLihatHasil(submission.id)}
                                                            colorScheme="brand"
                                                            variant="ghost"
                                                            size="sm"
                                                            leftIcon={<Icon as={FaEye} />}
                                                        >
                                                            Lihat Hasil
                                                        </Button>
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            )}
                        </VStack>
                    </Box>
                </VStack>
            </ChallengeLayout>
        </>
    );
};

export default HalamanPengajuanTantangan;