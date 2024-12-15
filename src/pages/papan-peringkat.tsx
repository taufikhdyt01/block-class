import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Heading,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Spinner,
    useToast,
    HStack,
    Button,
    useColorModeValue,
    Center,
    Icon,
    Badge,
    Flex,
    Tooltip,
    SimpleGrid,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { LeaderboardUser, getOverallLeaderboard } from '@/services/api';
import {
    FaTrophy,
    FaMedal,
    FaAward,
    FaChevronLeft,
    FaChevronRight,
    FaCode,
    FaStar,
    FaExclamationCircle,
    FaSync
} from 'react-icons/fa';
import { IconType } from 'react-icons';
import SEO from '@/components/SEO';

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
    let color;
    let bgColor;

    switch (rank) {
        case 1:
            color = 'yellow.500';
            bgColor = 'yellow.100';
            break;
        case 2:
            color = 'gray.500';
            bgColor = 'gray.100';
            break;
        case 3:
            color = 'orange.500';
            bgColor = 'orange.100';
            break;
        default:
            return <Text textAlign="center">{rank}</Text>;
    }

    return (
        <Center
            w="full"
            py={2}
        >
            <Text
                fontWeight="bold"
                fontSize="xl"
                color={color}
            >
                {rank}
            </Text>
        </Center>
    );
};

interface StatProps {
    icon: IconType;
    label: string;
    value: number;
    color: string;
}

const Stat: React.FC<StatProps> = ({ icon, label, value, color }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            boxShadow="md"
            textAlign="center"
        >
            <VStack spacing={3}>
                <Icon as={icon} w={6} h={6} color={color} />
                <Text fontWeight="medium" color={textColor}>
                    {label}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color={color}>
                    {value}
                </Text>
            </VStack>
        </Box>
    );
};

const LeaderboardPage: NextPage = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const toast = useToast();

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const headerBgColor = useColorModeValue('gray.50', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                const response = await getOverallLeaderboard(currentPage);
                if (response.success) {
                    setLeaderboard(response.data.leaderboard);
                    setLastPage(response.data.pagination.last_page);
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                setError('Gagal memuat papan peringkat. Silakan coba lagi nanti.');
                toast({
                    title: 'Error',
                    description: 'Gagal memuat papan peringkat. Silakan coba lagi.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [currentPage, toast]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={20}>
                <Center flexDirection="column" gap={4}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                    <Text color={textColor}>Memuat papan peringkat...</Text>
                </Center>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxW="container.xl" py={20}>
                <Center flexDirection="column" gap={4}>
                    <Icon as={FaExclamationCircle} w={10} h={10} color="red.500" />
                    <Text color="red.500" fontSize="lg">{error}</Text>
                    <Button
                        onClick={() => window.location.reload()}
                        colorScheme="brand"
                        leftIcon={<FaSync />}
                    >
                        Coba Lagi
                    </Button>
                </Center>
            </Container>
        );
    }

    return (
        <>
            <SEO title="Papan Peringkat" />
            <Container maxW="container.xl" py={10}>
                <VStack spacing={8} align="stretch">
                    <Box textAlign="center" py={4}>
                        <VStack spacing={6}>
                            <Heading
                                size="2xl"
                                bgGradient="linear(to-r, brand.500, brand.300)"
                                bgClip="text"
                                lineHeight={1.4}
                            >
                                Papan Peringkat Global
                            </Heading>
                            <Text
                                color={textColor}
                                fontSize="lg"
                            >
                                Perjuangan para programmer terbaik dalam menyelesaikan tantangan
                            </Text>
                        </VStack>
                    </Box>

                    {/* Quick Stats */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Stat
                            icon={FaStar}
                            label="Top Score"
                            value={leaderboard[0]?.total_score || 0}
                            color="yellow.400"
                        />
                        <Stat
                            icon={FaCode}
                            label="Total Peserta"
                            value={leaderboard.length}
                            color="brand.500"
                        />
                        <Stat
                            icon={FaTrophy}
                            label="Tantangan Selesai"
                            value={leaderboard[0]?.completed_challenges || 0}
                            color="orange.400"
                        />
                    </SimpleGrid>

                    <Box
                        bg={bgColor}
                        shadow="xl"
                        borderRadius="xl"
                        overflow="hidden"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <Box bg={headerBgColor} p={4}>
                            <Text fontWeight="bold" fontSize="lg">
                                Peringkat Keseluruhan
                            </Text>
                        </Box>

                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead bg={headerBgColor}>
                                    <Tr>
                                        <Th textAlign="center" width="100px">Peringkat</Th>
                                        <Th>Nama Pengguna</Th>
                                        <Th isNumeric>
                                            <HStack justify="flex-end" spacing={2}>
                                                <Icon as={FaStar} color="yellow.400" />
                                                <Text>Total Skor</Text>
                                            </HStack>
                                        </Th>
                                        <Th isNumeric>
                                            <HStack justify="flex-end" spacing={2}>
                                                <Icon as={FaCode} color="brand.500" />
                                                <Text>Total Tantangan</Text>
                                            </HStack>
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {leaderboard.map((user, index) => {
                                        const rank = (currentPage - 1) * 15 + index + 1;
                                        return (
                                            <Tr
                                                key={user.id}
                                                transition="background-color 0.2s"
                                                _hover={{
                                                    bg: useColorModeValue('gray.50', 'gray.700'),
                                                }}
                                            >
                                                <Td textAlign="center">
                                                    <RankBadge rank={rank} />
                                                </Td>
                                                <Td>
                                                    <HStack>
                                                        <Text
                                                            fontWeight={rank <= 3 ? "bold" : "normal"}
                                                            fontSize={rank <= 3 ? "lg" : "md"}
                                                        >
                                                            {user.user}
                                                        </Text>
                                                        {rank <= 3 && (
                                                            <Badge
                                                                colorScheme={rank === 1 ? "yellow" : rank === 2 ? "gray" : "orange"}
                                                            >
                                                                Top {rank}
                                                            </Badge>
                                                        )}
                                                    </HStack>
                                                </Td>
                                                <Td isNumeric fontWeight="bold" color="brand.500">
                                                    {user.total_score}
                                                </Td>
                                                <Td isNumeric>
                                                    <Badge
                                                        colorScheme="brand"
                                                        variant="subtle"
                                                        fontSize="md"
                                                    >
                                                        {user.completed_challenges}
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                                </Tbody>
                            </Table>
                        </Box>

                        {lastPage > 1 && (
                            <Flex justify="space-between" align="center" p={4} bg={headerBgColor}>
                                <Text color={textColor}>
                                    Halaman {currentPage} dari {lastPage}
                                </Text>
                                <HStack spacing={2}>
                                    <Button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        isDisabled={currentPage === 1}
                                        leftIcon={<FaChevronLeft />}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Sebelumnya
                                    </Button>
                                    <Button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        isDisabled={currentPage === lastPage}
                                        rightIcon={<FaChevronRight />}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Selanjutnya
                                    </Button>
                                </HStack>
                            </Flex>
                        )}
                    </Box>
                </VStack>
            </Container>
        </>
    );
};

export default LeaderboardPage;