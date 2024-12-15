import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Badge,
    Spinner,
    useToast,
    Heading,
    useColorModeValue,
    Button,
    HStack,
    IconButton,
    useDisclosure,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    VStack,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FiEye, FiTrash2, FiPlus, FiEdit2 } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import { withAdminAuth } from '@/components/withAdminAuth';
import { AdminChallenge, getAdminChallenges, deleteChallenge } from '@/services/api';
import SEO from '@/components/SEO';

const AdminChallengesPage: NextPage = () => {
    const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<AdminChallenge | null>(null);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const router = useRouter();

    // Colors for dark/light mode
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    // Difficulty colors
    const difficultyColors = {
        easy: 'green',
        medium: 'yellow',
        hard: 'red'
    };

    // Access type badges
    const accessColors = {
        public: 'green',
        private: 'purple',
        sequential: 'blue'
    };

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setIsLoading(true);
                const response = await getAdminChallenges();
                setChallenges(response.data);
            } catch (err) {
                setError('Gagal memuat daftar tantangan. Silakan coba lagi nanti.');
                toast({
                    title: 'Error',
                    description: 'Gagal memuat daftar tantangan',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchChallenges();
    }, [toast]);

    const handleDelete = async (challenge: AdminChallenge) => {
        try {
            console.log('Deleting challenge:', challenge.slug);
            const response = await deleteChallenge(challenge.slug);

            if (response.success) {
                // Update state dengan menghapus tantangan yang dihapus
                setChallenges(prev => prev.filter(ch => ch.slug !== challenge.slug));

                toast({
                    title: 'Berhasil',
                    description: 'Tantangan berhasil dihapus',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            console.error('Error deleting challenge:', error);
            toast({
                title: 'Error',
                description: error.message || 'Gagal menghapus tantangan',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            onClose();
        }
    };

    // Update fungsi confirmDelete
    const confirmDelete = (challenge: AdminChallenge) => {
        setSelectedChallenge(challenge);
        onOpen();
    };

    const handleEdit = (challenge: AdminChallenge) => {
        router.push(`/admin/tantangan/${challenge.slug}/edit`);
    };

    const handleView = (challenge: AdminChallenge) => {
        window.open(`/tantangan/${challenge.slug}`, '_blank');
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Spinner size="xl" />
                </Box>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <Text color="red.500">{error}</Text>
            </AdminLayout>
        );
    }

    return (
        <>
            <SEO title="Daftar Tantangan" />
            <AdminLayout>
                <Box>
                    <HStack justify="space-between" mb={6}>
                        <Heading size="lg">Daftar Tantangan</Heading>
                        <Button
                            colorScheme="green"
                            onClick={() => router.push('/admin/tantangan/tambah')}
                            leftIcon={<FiPlus />}
                        >
                            Tambah Tantangan
                        </Button>
                    </HStack>

                    <Box
                        bg={bgColor}
                        rounded="lg"
                        shadow="base"
                        overflow="hidden"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Judul</Th>
                                        <Th>Kategori</Th>
                                        <Th>Kesulitan</Th>
                                        <Th>Tipe Akses</Th>
                                        <Th>Kode Akses</Th>
                                        <Th>Aksi</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {challenges.map((challenge) => (
                                        <Tr key={challenge.id}>
                                            <Td>{challenge.id}</Td>
                                            <Td>{challenge.title}</Td>
                                            <Td>{challenge.category}</Td>
                                            <Td>
                                                <Badge colorScheme={difficultyColors[challenge.difficulty]}>
                                                    {challenge.difficulty}
                                                </Badge>
                                            </Td>
                                            <Td>
                                                <Badge colorScheme={accessColors[challenge.access_type]}>
                                                    {challenge.access_type}
                                                </Badge>
                                            </Td>
                                            <Td>{challenge.access_code || '-'}</Td>
                                            <Td>
                                                <HStack spacing={2}>
                                                    <IconButton
                                                        aria-label="Lihat tantangan"
                                                        icon={<FiEye />}
                                                        size="sm"
                                                        colorScheme="blue"
                                                        onClick={() => handleView(challenge)}
                                                    />
                                                    <IconButton
                                                        aria-label="Edit tantangan"
                                                        icon={<FiEdit2 />}
                                                        size="sm"
                                                        colorScheme="green"
                                                        onClick={() => handleEdit(challenge)}
                                                    />
                                                    <IconButton
                                                        aria-label="Hapus tantangan"
                                                        icon={<FiTrash2 />}
                                                        size="sm"
                                                        colorScheme="red"
                                                        onClick={() => confirmDelete(challenge)}
                                                    />
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>
                </Box>

                {/* Dialog Konfirmasi Hapus */}
                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                Hapus Tantangan
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                <VStack align="stretch" spacing={3}>
                                    <Text>
                                        Apakah Anda yakin ingin menghapus tantangan ini?
                                    </Text>
                                    {selectedChallenge && (
                                        <Box
                                            p={3}
                                            bg={useColorModeValue('gray.50', 'gray.700')}
                                            borderRadius="md"
                                        >
                                            <Text fontWeight="bold">
                                                {selectedChallenge.title}
                                            </Text>
                                            <HStack mt={2} spacing={2}>
                                                <Badge colorScheme={difficultyColors[selectedChallenge.difficulty]}>
                                                    {selectedChallenge.difficulty}
                                                </Badge>
                                                <Badge colorScheme={accessColors[selectedChallenge.access_type]}>
                                                    {selectedChallenge.access_type}
                                                </Badge>
                                            </HStack>
                                        </Box>
                                    )}
                                    <Text color="red.500" fontWeight="medium">
                                        Tindakan ini tidak dapat dibatalkan.
                                    </Text>
                                </VStack>
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Batal
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={() => selectedChallenge && handleDelete(selectedChallenge)}
                                    ml={3}
                                    isLoading={isSubmitting}
                                    loadingText="Menghapus..."
                                >
                                    Hapus
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </AdminLayout>
        </>
    );
};

export default withAdminAuth(AdminChallengesPage);