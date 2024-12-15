import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    VStack,
    HStack,
    Button,
    useColorModeValue,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Image,
    Badge,
    useToast,
    Spinner,
    Center
} from '@chakra-ui/react';
import { FaLock, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';
import { getClasses, verifyClassCode, Class } from '@/services/api';

interface ClassCardProps {
    classItem: Class;
    onJoinSuccess: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, onJoinSuccess }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [classCode, setClassCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleJoinClass = async () => {
        setIsLoading(true);
        try {
            await verifyClassCode(classItem.slug, classCode);
            toast({
                title: "Berhasil bergabung dengan kelas!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onClose();
            onJoinSuccess();
        } catch (error: any) {
            toast({
                title: "Gagal bergabung",
                description: error.message || "Kode kelas tidak valid!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={bgColor}
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{
                transform: 'translateY(-4px)',
                shadow: 'md',
            }}
            display="flex"
            flexDirection="column"
            height="100%"
        >
            <Image
                src={classItem.banner}
                alt={classItem.title}
                height="200px"
                width="100%"
                objectFit="cover"
                fallbackSrc="/api/placeholder/800/200"
            />

            <VStack p={6} flex="1" spacing={4} align="stretch">
                <VStack flex="1" align="stretch" spacing={4}>
                    <Box>
                        <HStack justify="space-between" align="start">
                            <Heading size="md" mb={2}>{classItem.title}</Heading>
                            <Badge
                                colorScheme={classItem.is_enrolled ? 'green' : 'blue'}
                                variant="subtle"
                                px={2}
                                py={1}
                                borderRadius="full"
                            >
                                {classItem.is_enrolled ? 'Terdaftar' : 'Buka'}
                            </Badge>
                        </HStack>
                        <Text color={useColorModeValue('gray.600', 'gray.300')}>
                            {classItem.detail}
                        </Text>
                    </Box>

                    <HStack spacing={4} color={useColorModeValue('gray.600', 'gray.400')}>
                        <HStack>
                            <FaUsers />
                            <Text fontSize="sm">{classItem.total_students} Siswa</Text>
                        </HStack>
                        <HStack>
                            <FaChalkboardTeacher />
                            <Text fontSize="sm">{classItem.total_chapters} Materi</Text>
                        </HStack>
                    </HStack>
                </VStack>

                <Button
                    colorScheme={classItem.is_enrolled ? 'brand' : 'blue'}
                    variant={classItem.is_enrolled ? 'solid' : 'outline'}
                    width="full"
                    onClick={classItem.is_enrolled ? () => { } : onOpen}
                    leftIcon={classItem.is_enrolled ? <FaChalkboardTeacher /> : <FaLock />}
                >
                    {classItem.is_enrolled ? 'Akses Kelas' : 'Masukkan Kode'}
                </Button>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Masukkan Kode Kelas</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Masukkan kode kelas"
                                value={classCode}
                                onChange={(e) => setClassCode(e.target.value)}
                            />
                            <Button
                                colorScheme="blue"
                                width="full"
                                onClick={handleJoinClass}
                                isLoading={isLoading}
                            >
                                Gabung Kelas
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

const ClassPage: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchClasses = async () => {
        try {
            setIsLoading(true);
            const response = await getClasses();
            setClasses(response.data.classes);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch classes');
            toast({
                title: "Error",
                description: error.message || 'Failed to fetch classes',
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 60px)">
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    <Box textAlign="center" pt={4} pb={8}>
                        <Heading
                            size="2xl"
                            bgGradient="linear(to-r, brand.500, brand.300)"
                            bgClip="text"
                            lineHeight={1.4}
                        >
                            Kelas Pembelajaran
                        </Heading>
                        <Text
                            color={useColorModeValue('gray.600', 'gray.400')}
                            fontSize="lg"
                            mt={4}
                        >
                            Pilih kelas untuk memulai pembelajaran pemrograman visual
                        </Text>
                    </Box>

                    {isLoading ? (
                        <Center py={10}>
                            <Spinner size="xl" />
                        </Center>
                    ) : error ? (
                        <Center py={10}>
                            <Text color="red.500">{error}</Text>
                        </Center>
                    ) : (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                            {classes.map((classItem) => (
                                <ClassCard
                                    key={classItem.id}
                                    classItem={classItem}
                                    onJoinSuccess={fetchClasses}
                                />
                            ))}
                        </SimpleGrid>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default ClassPage;