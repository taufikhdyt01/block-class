import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { FaLock, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

interface ClassItem {
    id: number;
    name: string;
    description: string;
    enrolled: boolean;
    students: number;
    banner: string;
    code: string;
}

interface ClassCardProps {
    classItem: ClassItem;
}

// Sample class data
const classesData: ClassItem[] = [
    {
        id: 1,
        name: "Pemrograman Dasar",
        description: "Pembelajaran dasar logika pemrograman menggunakan blockly",
        enrolled: false,
        students: 156,
        banner: "/api/placeholder/800/200",
        code: "PROG101"
    },
    {
        id: 2,
        name: "Algoritma dan Struktur Data",
        description: "Pembelajaran konsep algoritma dan struktur data dengan visual yang sangat panjang sekali untuk testing apakah button akan sejajar",
        enrolled: true,
        students: 89,
        banner: "/api/placeholder/800/200",
        code: "ALGO202"
    },
    {
        id: 3,
        name: "Pengantar Pemrograman Web",
        description: "Belajar dasar-dasar pemrograman web secara interaktif",
        enrolled: false,
        students: 234,
        banner: "/api/placeholder/800/200",
        code: "WEB303"
    }
];

const ClassCard: React.FC<ClassCardProps> = ({ classItem }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [classCode, setClassCode] = useState("");
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleJoinClass = () => {
        if (classCode === classItem.code) {
            alert("Berhasil bergabung dengan kelas!");
            onClose();
        } else {
            alert("Kode kelas tidak valid!");
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
                alt={classItem.name}
                height="200px"
                width="100%"
                objectFit="cover"
            />

            <VStack p={6} flex="1" spacing={4} align="stretch">
                <VStack flex="1" align="stretch" spacing={4}>
                    <Box>
                        <HStack justify="space-between" align="start">
                            <Heading size="md" mb={2}>{classItem.name}</Heading>
                            <Badge
                                colorScheme={classItem.enrolled ? 'green' : 'blue'}
                                variant="subtle"
                                px={2}
                                py={1}
                                borderRadius="full"
                            >
                                {classItem.enrolled ? 'Terdaftar' : 'Buka'}
                            </Badge>
                        </HStack>
                        <Text color={useColorModeValue('gray.600', 'gray.300')}>
                            {classItem.description}
                        </Text>
                    </Box>

                    <HStack spacing={4} color={useColorModeValue('gray.600', 'gray.400')}>
                        <HStack>
                            <FaUsers />
                            <Text fontSize="sm">{classItem.students} Siswa</Text>
                        </HStack>
                        <HStack>
                            <FaChalkboardTeacher />
                            <Text fontSize="sm">4 Materi</Text>
                        </HStack>
                    </HStack>
                </VStack>

                <Button
                    colorScheme={classItem.enrolled ? 'brand' : 'blue'}
                    variant={classItem.enrolled ? 'solid' : 'outline'}
                    width="full"
                    onClick={classItem.enrolled ? () => { } : onOpen}
                    leftIcon={classItem.enrolled ? <FaChalkboardTeacher /> : <FaLock />}
                >
                    {classItem.enrolled ? 'Akses Kelas' : 'Masukkan Kode'}
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
                            <Button colorScheme="blue" width="full" onClick={handleJoinClass}>
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
    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 60px)">
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Header Section */}
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

                    {/* Classes Grid */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                        {classesData.map((classItem) => (
                            <ClassCard key={classItem.id} classItem={classItem} />
                        ))}
                    </SimpleGrid>
                </VStack>
            </Container>
        </Box>
    );
};

export default ClassPage;