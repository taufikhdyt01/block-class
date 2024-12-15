import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    useColorModeValue,
    Button,
    Spinner,
    Icon,
    Select,
    InputGroup,
    Input,
    InputLeftElement,
    Badge,
    Center,
    Stack,
    Flex,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { getChallenges, Challenge, Pagination } from '@/services/api';
import ChallengeCard from '@/components/ChallengeCard';
import { getToken } from '@/utils/auth';
import {
    FaSearch,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
    FaTrophy,
    FaExclamationCircle,
    FaSync,
    FaCode,
    FaChartLine
} from 'react-icons/fa';
import SEO from '@/components/SEO';

type Difficulty = 'easy' | 'medium' | 'hard';

const difficultyOptions = [
    { value: 'all', label: 'Semua Tingkat' },
    { value: 'easy', label: 'Mudah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'hard', label: 'Sulit' },
];

const ChallengePage: NextPage = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState<'all' | Difficulty>('all');

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const fetchChallenges = useCallback(async (page: number) => {
        try {
            setIsLoading(true);
            const response = await getChallenges(page);
            if (response.success) {
                setChallenges(response.data.challenges);
                setFilteredChallenges(response.data.challenges);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('Error fetching challenges:', err);
            setError('Gagal memuat tantangan. Silakan coba lagi nanti.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        setIsAuthenticated(!!token);
        fetchChallenges(currentPage);
    }, [currentPage, fetchChallenges]);

    useEffect(() => {
        const filtered = challenges.filter(challenge => {
            const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                challenge.description.toLowerCase().includes(searchQuery.toLowerCase());

            // Perbaikan logika filter difficulty
            const matchesDifficulty = difficultyFilter === 'all' ||
                challenge.difficulty.toLowerCase() === difficultyFilter;

            return matchesSearch && matchesDifficulty;
        });
        setFilteredChallenges(filtered);
    }, [searchQuery, difficultyFilter, challenges]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const refreshChallenges = () => {
        fetchChallenges(currentPage);
    };

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={20}>
                <Center flexDirection="column" gap={4}>
                    <Spinner size="xl" color="brand.500" thickness="4px" />
                    <Text color={textColor}>Memuat tantangan...</Text>
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
                        onClick={refreshChallenges}
                        leftIcon={<FaSync />}
                        colorScheme="brand"
                    >
                        Coba Lagi
                    </Button>
                </Center>
            </Container>
        );
    }

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'green';
            case 'medium':
                return 'orange';
            case 'hard':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getDifficultyLabel = (difficulty: string): string => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'Mudah';
            case 'medium':
                return 'Sedang';
            case 'hard':
                return 'Sulit';
            default:
                return difficulty;
        }
    };


    return (
        <>
            <SEO title="Tantangan" />
            <Box bg={useColorModeValue('gray.50', 'gray.900')}>
                {/* Hero Section */}
                <Box
                    bg={useColorModeValue('white', 'gray.800')}
                    borderBottomWidth="1px"
                    borderColor={borderColor}
                    mb={8}
                    py={12}
                >
                    <Container maxW="container.xl">
                        <VStack spacing={6}>
                            <Heading
                                size="2xl"
                                bgGradient="linear(to-r, brand.500, brand.300)"
                                bgClip="text"
                                lineHeight={1.4}
                            >
                                Tantangan Pemrograman
                            </Heading>
                            <Text
                                color={textColor}
                                fontSize="xl"
                                maxW="2xl"
                                textAlign="center"
                            >
                                Pilih tantangan dan tingkatkan keterampilan pemrograman Anda melalui
                                berbagai tantangan yang telah dirancang khusus untuk setiap tingkat kemampuan.
                            </Text>
                        </VStack>
                    </Container>
                </Box>

                {/* Main Content */}
                <Container maxW="container.xl" pb={16}>
                    <VStack spacing={8} align="stretch">
                        {/* Filter Section */}
                        <Box
                            bg={useColorModeValue('white', 'gray.800')}
                            p={6}
                            borderRadius="xl"
                            boxShadow="sm"
                            borderWidth={1}
                            borderColor={borderColor}
                        >
                            <Stack
                                direction={{ base: 'column', md: 'row' }}
                                justify="space-between"
                                align="center"
                                spacing={4}
                            >
                                <VStack align="start" spacing={1}>
                                    <Text fontWeight="medium" fontSize="lg">
                                        Filter Tantangan
                                    </Text>
                                    <Text fontSize="sm" color={textColor}>
                                        {filteredChallenges.length} tantangan ditemukan
                                    </Text>
                                </VStack>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    spacing={4}
                                    w={{ base: 'full', md: 'auto' }}
                                >
                                    <InputGroup maxW={{ base: "full", sm: "300px" }}>
                                        <InputLeftElement>
                                            <Icon as={FaSearch} color="gray.400" />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Cari tantangan..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </InputGroup>
                                    <Select
                                        value={difficultyFilter}
                                        onChange={(e) => setDifficultyFilter(e.target.value as 'all' | Difficulty)}
                                        maxW={{ base: "full", sm: "200px" }}
                                        icon={<FaFilter />}
                                    >
                                        {difficultyOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </Stack>
                            </Stack>

                            {/* Active Filters */}
                            {(searchQuery || difficultyFilter !== 'all') && (
                                <HStack spacing={2} mt={4} flexWrap="wrap">
                                    {difficultyFilter !== 'all' && (
                                        <Badge
                                            colorScheme={getDifficultyColor(difficultyFilter)}
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            {getDifficultyLabel(difficultyFilter)}
                                        </Badge>
                                    )}
                                    {searchQuery && (
                                        <Badge
                                            colorScheme="brand"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            Pencarian: "{searchQuery}"
                                        </Badge>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="gray"
                                        leftIcon={<FaSync />}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setDifficultyFilter('all');
                                        }}
                                    >
                                        Reset Filter
                                    </Button>
                                </HStack>
                            )}
                        </Box>

                        {/* Challenges Grid */}
                        {filteredChallenges.length === 0 ? (
                            <Box
                                bg={useColorModeValue('white', 'gray.800')}
                                p={12}
                                borderRadius="xl"
                                textAlign="center"
                            >
                                <VStack spacing={4}>
                                    <Icon as={FaTrophy} w={12} h={12} color="gray.400" />
                                    <Text fontSize="xl" fontWeight="medium">
                                        Tidak ada tantangan yang sesuai
                                    </Text>
                                    <Text color={textColor}>
                                        Coba ubah filter atau kata kunci pencarian Anda
                                    </Text>
                                    <Button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setDifficultyFilter('all');
                                        }}
                                        size="sm"
                                        colorScheme="brand"
                                        variant="outline"
                                        leftIcon={<FaSync />}
                                    >
                                        Reset Filter
                                    </Button>
                                </VStack>
                            </Box>
                        ) : (
                            <SimpleGrid
                                columns={{ base: 1, md: 2, lg: 3 }}
                                spacing={8}
                                py={4}
                            >
                                {filteredChallenges.map((challenge) => (
                                    <ChallengeCard
                                        key={challenge.id}
                                        challenge={challenge}
                                        onAccessGranted={refreshChallenges}
                                        isAuthenticated={isAuthenticated}
                                    />
                                ))}
                            </SimpleGrid>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                            <Box
                                bg={useColorModeValue('white', 'gray.800')}
                                p={6}
                                borderRadius="xl"
                                boxShadow="sm"
                                borderWidth={1}
                                borderColor={borderColor}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    direction={{ base: 'column', sm: 'row' }}
                                    gap={4}
                                >
                                    <Text color={textColor} fontSize="sm">
                                        Menampilkan {filteredChallenges.length} dari {challenges.length} tantangan
                                    </Text>
                                    <HStack spacing={4}>
                                        <Button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            isDisabled={currentPage === 1}
                                            leftIcon={<FaChevronLeft />}
                                            size="sm"
                                            variant="outline"
                                        >
                                            Sebelumnya
                                        </Button>
                                        <Text fontWeight="medium">
                                            {currentPage} / {pagination.last_page}
                                        </Text>
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
                                </Flex>
                            </Box>
                        )}
                    </VStack>
                </Container>
            </Box>
        </>
    );
};

export default ChallengePage;