import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    HStack,
    Avatar,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatGroup,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Spinner,
    useToast,
    Badge,
    SimpleGrid,
    Icon,
    useColorModeValue,
    Card,
    CardBody,
    Center,
    IconButton,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { UserProfile, fetchUserProfile } from '@/services/api';
import {
    FaTrophy,
    FaCode,
    FaStar,
    FaClock,
    FaExclamationCircle,
    FaEdit
} from 'react-icons/fa';
import SEO from '@/components/SEO';
import EditProfileModal from '@/components/EditProfileModal';

const ProfilePage: NextPage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const difficultyTranslation = {
        easy: 'Mudah',
        medium: 'Sedang',
        hard: 'Sulit'
    };

    const getDifficultyInIndonesian = (difficulty: string): string => {
        return difficultyTranslation[difficulty as keyof typeof difficultyTranslation] || difficulty;
    };

    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty) {
            case 'easy':
                return 'green';
            case 'medium':
                return 'yellow';
            case 'hard':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getStatusInIndonesian = (status: string): string => {
        return status === 'accepted' ? 'Jawaban Benar' : 'Jawaban Salah';
    };

    const getStatusColor = (status: string): string => {
        return status === 'accepted' ? 'green' : 'red';
    };

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            const response = await fetchUserProfile();
            if (response.success) {
                setProfile(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError('Gagal memuat profil. Silakan coba lagi nanti.');
            toast({
                title: 'Error',
                description: 'Failed to load profile. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [toast]);

    if (isLoading) {
        return (
            <Container maxW="container.xl" py={20}>
                <Center flexDirection="column" gap={4}>
                    <Spinner size="xl" thickness="4px" color="brand.500" />
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        Memuat profil...
                    </Text>
                </Center>
            </Container>
        );
    }

    if (error || !profile) {
        return (
            <Container maxW="container.xl" py={20}>
                <Center flexDirection="column" gap={4}>
                    <Icon as={FaExclamationCircle} w={10} h={10} color="red.500" />
                    <Text color="red.500" fontSize="lg">
                        {error || 'Profile tidak ditemukan'}
                    </Text>
                </Center>
            </Container>
        );
    }

    return (
        <>
            <SEO
                title={`Profil ${profile?.name || 'Pengguna'}`}
                description="Halaman profil pengguna e-Block"
            />
            <Container maxW="container.xl" py={10}>
                <VStack spacing={8} align="stretch">
                    {/* Profile Header */}
                    <Card>
                        <CardBody>
                            <HStack spacing={8} align="start">
                                <Box position="relative">
                                    <Avatar
                                        size="2xl"
                                        name={profile?.name}
                                        src={profile?.avatar}
                                        boxShadow="lg"
                                    />
                                    <IconButton
                                        aria-label="Edit profile"
                                        icon={<FaEdit />}
                                        size="sm"
                                        position="absolute"
                                        bottom={0}
                                        right={0}
                                        colorScheme="blue"
                                        rounded="full"
                                        onClick={() => setIsEditModalOpen(true)}
                                    />
                                </Box>
                                <VStack align="start" spacing={3} flex={1}>
                                    <VStack align="start" spacing={1}>
                                        <Heading size="xl">{profile?.name}</Heading>
                                        <Text fontSize="lg" color="gray.500">{profile?.username}</Text>
                                        <Text color="gray.500">{profile?.email}</Text>
                                    </VStack>

                                    {/* Stats Cards */}
                                    <SimpleGrid
                                        columns={{ base: 1, md: 3 }}
                                        spacing={4}
                                        width="full"
                                        pt={4}
                                    >
                                        <Box
                                            p={4}
                                            bg={useColorModeValue('brand.50', 'rgba(66, 153, 225, 0.1)')}
                                            borderRadius="lg"
                                        >
                                            <Stat>
                                                <StatLabel>
                                                    <HStack>
                                                        <Icon as={FaCode} />
                                                        <Text>Total Tantangan</Text>
                                                    </HStack>
                                                </StatLabel>
                                                <StatNumber>{profile.total_challenges}</StatNumber>
                                                <StatHelpText>Total tantangan yang dikerjakan</StatHelpText>
                                            </Stat>
                                        </Box>
                                        <Box
                                            p={4}
                                            bg={useColorModeValue('green.50', 'rgba(72, 187, 120, 0.1)')}
                                            borderRadius="lg"
                                        >
                                            <Stat>
                                                <StatLabel>
                                                    <HStack>
                                                        <Icon as={FaTrophy} />
                                                        <Text>Tantangan Selesai</Text>
                                                    </HStack>
                                                </StatLabel>
                                                <StatNumber>{profile.completed_challenges}</StatNumber>
                                                <StatHelpText>
                                                    {((profile.completed_challenges / profile.total_challenges) * 100).toFixed(1)}% selesai
                                                </StatHelpText>
                                            </Stat>
                                        </Box>
                                        <Box
                                            p={4}
                                            bg={useColorModeValue('purple.50', 'rgba(159, 122, 234, 0.1)')}
                                            borderRadius="lg"
                                        >
                                            <Stat>
                                                <StatLabel>
                                                    <HStack>
                                                        <Icon as={FaStar} />
                                                        <Text>Total Skor</Text>
                                                    </HStack>
                                                </StatLabel>
                                                <StatNumber>{profile.total_score}</StatNumber>
                                                <StatHelpText>Akumulasi skor</StatHelpText>
                                            </Stat>
                                        </Box>
                                    </SimpleGrid>
                                </VStack>
                            </HStack>
                        </CardBody>
                    </Card>

                    {/* Challenge History */}
                    <Card>
                        <CardBody>
                            <VStack align="stretch" spacing={4}>
                                <HStack justify="space-between">
                                    <Heading size="md">Riwayat Tantangan</Heading>
                                    <Badge colorScheme="brand" p={2} borderRadius="full">
                                        {profile.challenge_history.length} Tantangan
                                    </Badge>
                                </HStack>

                                <Box overflowX="auto">
                                    <Table variant="simple">
                                        <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                                            <Tr>
                                                <Th>Judul</Th>
                                                <Th>Kesulitan</Th>
                                                <Th isNumeric>Skor Terbaik</Th>
                                                <Th>Status</Th>
                                                <Th>
                                                    <HStack spacing={2}>
                                                        <Icon as={FaClock} />
                                                        <Text>Selesai</Text>
                                                    </HStack>
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {profile.challenge_history.map((challenge) => (
                                                <Tr
                                                    key={challenge.challenge_id}
                                                    _hover={{
                                                        bg: useColorModeValue('gray.50', 'gray.700')
                                                    }}
                                                >
                                                    <Td fontWeight="medium">{challenge.title}</Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={getDifficultyColor(challenge.difficulty)}
                                                            px={2}
                                                            py={1}
                                                            borderRadius="full"
                                                        >
                                                            {getDifficultyInIndonesian(challenge.difficulty)}
                                                        </Badge>
                                                    </Td>
                                                    <Td isNumeric fontWeight="bold">
                                                        {challenge.best_score} / 100
                                                    </Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={getStatusColor(challenge.status)}
                                                            px={2}
                                                            py={1}
                                                            borderRadius="full"
                                                        >
                                                            {getStatusInIndonesian(challenge.status)}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        {new Date(challenge.completed_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
            {profile && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    currentName={profile.name}
                    currentAvatar={profile.avatar}
                    onProfileUpdate={loadProfile}
                />
            )}
        </>
    );
};

export default ProfilePage;