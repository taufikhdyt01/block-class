import React from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Heading,
    Text,
    Icon,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useColorModeValue,
    Badge,
    Textarea,
    FormControl,
    FormLabel,
    Input,
    Alert,
    AlertIcon,
    Flex,
} from '@chakra-ui/react';
import {
    FaChevronRight,
    FaClock,
    FaFileUpload,
    FaCalendarAlt,
} from 'react-icons/fa';

interface AssignmentProps {
    title?: string;
    chapterTitle?: string;
    dueDate?: string;
    duration?: string;
    maxScore?: number;
    description?: string;
}

const defaultAssignment = {
    title: "Tugas Struktur Kontrol",
    chapterTitle: "Chapter 2: Struktur Kontrol",
    dueDate: "2024-12-20T23:59",
    maxScore: 100,
    description: `Pada tugas ini, Anda diminta untuk membuat program sederhana menggunakan Blockly yang menerapkan konsep struktur kontrol. Tugas mencakup:

1. Membuat program dengan minimal satu penggunaan if-else
2. Menggunakan minimal satu perulangan (loop)
3. Menerapkan nested if (if bersarang)

Kriteria Penilaian:
- Ketepatan penggunaan struktur kontrol (40%)
- Efisiensi kode (30%)
- Kreativitas solusi (30%)

Silahkan unggah screenshot hasil program Blockly Anda dalam format PNG atau JPG.`
};

const AssignmentPage: React.FC<AssignmentProps> = ({
    title = defaultAssignment.title,
    chapterTitle = defaultAssignment.chapterTitle,
    dueDate = defaultAssignment.dueDate,
    maxScore = defaultAssignment.maxScore,
    description = defaultAssignment.description,
}) => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const isOverdue = new Date(dueDate) < new Date();

    return (
        <Box bg={bgColor} minH="100vh" py={8}>
            <Container maxW="container.lg">
                <VStack spacing={8} align="stretch">
                    {/* Breadcrumb Navigation */}
                    <Breadcrumb
                        spacing="8px"
                        separator={<Icon as={FaChevronRight} color="gray.500" />}
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/courses">Kelas</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/courses/programming">Pemrograman Dasar</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>{title}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    {/* Assignment Header */}
                    <VStack align="start" spacing={4}>
                        <Badge colorScheme="blue" fontSize="sm">
                            {chapterTitle}
                        </Badge>
                        <Heading size="lg">{title}</Heading>
                        <HStack spacing={6}>
                            <HStack>
                                <Icon as={FaCalendarAlt} color="gray.500" />
                                <Text color="gray.500">
                                    Due: {new Date(dueDate).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>
                            </HStack>
                        </HStack>
                    </VStack>

                    {/* Status Alert */}
                    {isOverdue ? (
                        <Alert status="error">
                            <AlertIcon />
                            Batas waktu pengumpulan telah berakhir
                        </Alert>
                    ) : (
                        <Alert status="info">
                            <AlertIcon />
                            Masih ada waktu untuk mengumpulkan tugas
                        </Alert>
                    )}

                    {/* Main Content */}
                    <Box
                        bg={cardBg}
                        p={8}
                        borderRadius="lg"
                        shadow="sm"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        {/* Assignment Description */}
                        <VStack align="stretch" spacing={6}>
                            <Box>
                                <Heading size="md" mb={4}>Deskripsi Tugas</Heading>
                                <Text whiteSpace="pre-wrap">{description}</Text>
                            </Box>

                            {/* Submission Form */}
                            <Box>
                                <Heading size="md" mb={4}>Pengumpulan Tugas</Heading>
                                <VStack spacing={4} align="stretch">
                                    <FormControl>
                                        <FormLabel>Catatan Tambahan</FormLabel>
                                        <Textarea
                                            placeholder="Tambahkan penjelasan atau catatan tentang tugas Anda"
                                            rows={4}
                                        />
                                    </FormControl>

                                    <Box
                                        borderWidth="2px"
                                        borderRadius="lg"
                                        borderStyle="dashed"
                                        p={8}
                                        borderColor={borderColor}
                                    >
                                        <VStack spacing={2}>
                                            <Icon as={FaFileUpload} boxSize={8} color="blue.500" />
                                            <Text>
                                                Drag & drop file screenshot atau klik untuk memilih
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Format: PNG, JPG (Max. 5MB)
                                            </Text>
                                        </VStack>
                                    </Box>

                                    <Flex justify="space-between" align="center">
                                        <Text>
                                            Nilai Maksimal: <Badge colorScheme="green">{maxScore} poin</Badge>
                                        </Text>
                                        <Button
                                            colorScheme="blue"
                                            size="lg"
                                            isDisabled={isOverdue}
                                        >
                                            Submit Tugas
                                        </Button>
                                    </Flex>
                                </VStack>
                            </Box>
                        </VStack>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default AssignmentPage;