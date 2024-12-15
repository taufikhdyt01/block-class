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
    Spinner,
    Text,
    useToast,
    Button,
    HStack,
    Box,
    Icon,
    Badge,
    Center,
    useColorModeValue,
    Tooltip,
} from '@chakra-ui/react';
import {
    FaTrophy,
    FaClock,
    FaChevronLeft,
    FaChevronRight,
    FaMedal,
    FaUser,
} from 'react-icons/fa';
import ChallengeLayout from '@/components/ChallengeLayout';
import { getChallengeLeaderboard, getChallengeBySlug, LeaderboardEntry, Challenge, Pagination } from '@/services/api';
import SEO from '@/components/SEO';

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
    let color;

    switch (rank) {
        case 1:
            color = 'yellow.400';
            break;
        case 2:
            color = 'gray.400';
            break;
        case 3:
            color = 'orange.400';
            break;
        default:
            return <Text fontWeight="medium">{rank}</Text>;
    }

    return (
        <Text
            fontWeight="bold"
            fontSize="lg"
            color={color}
        >
            {rank}
        </Text>
    );
};

const HalamanPapanPeringkatTantangan: NextPage = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const headerBg = useColorModeValue('gray.50', 'gray.700');

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

    const fetchData = async (page: number) => {
        if (slug && typeof slug === 'string') {
            try {
                setIsLoading(true);
                const [leaderboardResponse, challengeData] = await Promise.all([
                    getChallengeLeaderboard(slug, page),
                    getChallengeBySlug(slug)
                ]);

                if (leaderboardResponse.success && Array.isArray(leaderboardResponse.data.leaderboard)) {
                    setLeaderboard(leaderboardResponse.data.leaderboard);
                    setPagination(leaderboardResponse.data.pagination);
                } else {
                    throw new Error(leaderboardResponse.message || 'Invalid leaderboard data');
                }

                setChallenge(challengeData);
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

    const formatSubmissionTime = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [slug, currentPage, toast]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) {
        return (
            <ChallengeLayout
                slug={slug as string}
                challengeTitle="Memuat..."
                difficulty={challenge?.difficulty}
                category={challenge?.category}
            >
                <Center height="300px">
                    <VStack spacing={4}>
                        <Spinner size="xl" thickness="4px" color="brand.500" />
                        <Text>Memuat papan peringkat...</Text>
                    </VStack>
                </Center>
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
                challengeTitle={challenge?.title || 'Papan Peringkat'}
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
                        <VStack spacing={6} align="stretch">
                            <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                    <Icon as={FaMedal} w={6} h={6} color="brand.500" />
                                    <Text fontSize="2xl" fontWeight="bold">
                                        Papan Peringkat
                                    </Text>
                                </HStack>
                                {leaderboard.length > 0 && (
                                    <Badge
                                        colorScheme="brand"
                                        p={2}
                                        borderRadius="full"
                                    >
                                        {pagination?.total || leaderboard.length} Peserta
                                    </Badge>
                                )}
                            </HStack>

                            {leaderboard.length === 0 ? (
                                <Box
                                    p={8}
                                    textAlign="center"
                                    bg={headerBg}
                                    borderRadius="md"
                                >
                                    <VStack spacing={4}>
                                        <Icon as={FaTrophy} w={10} h={10} color="gray.400" />
                                        <Text fontSize="lg">
                                            Belum ada data papan peringkat untuk tantangan ini.
                                        </Text>
                                        <Text color="gray.500">
                                            Jadilah yang pertama menyelesaikan tantangan ini!
                                        </Text>
                                    </VStack>
                                </Box>
                            ) : (
                                <Box overflowX="auto">
                                    <Table variant="simple">
                                        <Thead bg={headerBg}>
                                            <Tr>
                                                <Th textAlign="center">Peringkat</Th>
                                                <Th>Nama Pengguna</Th>
                                                <Th isNumeric>Skor</Th>
                                                <Th>Waktu Pengerjaan</Th>
                                                <Th>Waktu Pengajuan</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {leaderboard.map((entry, index) => {
                                                const rank = (pagination?.per_page || 0) * (currentPage - 1) + index + 1;
                                                return (
                                                    <Tr
                                                        key={entry.id}
                                                        _hover={{
                                                            bg: useColorModeValue('gray.50', 'gray.700')
                                                        }}
                                                    >
                                                        <Td textAlign="center">
                                                            <RankBadge rank={rank} />
                                                        </Td>
                                                        <Td>
                                                            <HStack>
                                                                <Icon as={FaUser} color="gray.400" />
                                                                <Text fontWeight={rank <= 3 ? "bold" : "normal"}>
                                                                    {entry.user}
                                                                </Text>
                                                            </HStack>
                                                        </Td>
                                                        <Td isNumeric>
                                                            <Badge
                                                                colorScheme={rank <= 3 ? "yellow" : "gray"}
                                                                fontSize="md"
                                                                p={2}
                                                                borderRadius="md"
                                                            >
                                                                {entry.score}
                                                            </Badge>
                                                        </Td>
                                                        <Td>
                                                            <HStack>
                                                                <Icon as={FaClock} color="gray.400" />
                                                                <Text>{formatTimeSpent(entry.time_spent)}</Text>
                                                            </HStack>
                                                        </Td>
                                                        <Td>{formatSubmissionTime(entry.submission_time)}</Td>
                                                    </Tr>
                                                );
                                            })}
                                        </Tbody>
                                    </Table>
                                </Box>
                            )}

                            {pagination && pagination.last_page > 1 && (
                                <HStack justify="space-between" pt={4}>
                                    <Text color="gray.500" fontSize="sm">
                                        Menampilkan {((currentPage - 1) * (pagination.per_page || 0)) + 1} - {Math.min(currentPage * (pagination.per_page || 0), pagination.total)} dari {pagination.total} peserta
                                    </Text>
                                    <HStack spacing={2}>
                                        <Button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            isDisabled={currentPage === 1}
                                            leftIcon={<FaChevronLeft />}
                                            size="sm"
                                            variant="outline"
                                        >
                                            Sebelumnya
                                        </Button>
                                        <Text>{`${currentPage} / ${pagination.last_page}`}</Text>
                                        <Button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            isDisabled={currentPage === pagination.last_page}
                                            rightIcon={<FaChevronRight />}
                                            size="sm"
                                            variant="outline"
                                        >
                                            Selanjutnya
                                        </Button>
                                    </HStack>
                                </HStack>
                            )}
                        </VStack>
                    </Box>
                </VStack>
            </ChallengeLayout>
        </>
    );
};

export default HalamanPapanPeringkatTantangan;