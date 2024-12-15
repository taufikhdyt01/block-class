import React, { useState } from 'react';
import {
    Box,
    Container,
    VStack,
    HStack,
    Image,
    Heading,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Badge,
    Icon,
    useColorModeValue,
    List,
    ListItem,
} from '@chakra-ui/react';
import { FaUsers, FaChalkboardTeacher, FaCheck, FaBook, FaTasks, FaCode, FaQuestionCircle, FaComments } from 'react-icons/fa';

interface ContentItemProps {
    title: string;
    type: 'Materi' | 'Tugas' | 'Praktik' | 'Kuis' | 'Forum Diskusi';
    isCompleted: boolean;
    duration: string;
}

interface Student {
    id: number;
    name: string;
    status: 'active' | 'inactive';
}

interface ChapterContent extends ContentItemProps { }

interface Chapter {
    title: string;
    contents: ChapterContent[];
}

const ContentItem: React.FC<ContentItemProps> = ({ title, type, isCompleted, duration }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const getIcon = (type: ContentItemProps['type']) => {
        switch (type) {
            case 'Materi': return FaBook;
            case 'Tugas': return FaTasks;
            case 'Praktik': return FaCode;
            case 'Kuis': return FaQuestionCircle;
            case 'Forum Diskusi': return FaComments;
            default: return FaBook;
        }
    };

    const getTypeColor = (type: ContentItemProps['type']) => {
        switch (type) {
            case 'Materi': return 'blue';
            case 'Tugas': return 'orange';
            case 'Praktik': return 'green';
            case 'Kuis': return 'purple';
            case 'Forum Diskusi': return 'pink';
            default: return 'gray';
        }
    };

    return (
        <Box
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg={bgColor}
            borderColor={borderColor}
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
        >
            <HStack justify="space-between" align="center">
                <HStack spacing={4}>
                    <Icon as={getIcon(type)} color={`${getTypeColor(type)}.500`} boxSize={5} />
                    <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{title}</Text>
                        <HStack spacing={2}>
                            <Badge colorScheme={getTypeColor(type)} variant="subtle">
                                {type}
                            </Badge>
                            <Text fontSize="sm" color="gray.500">
                                {duration}
                            </Text>
                        </HStack>
                    </VStack>
                </HStack>
                {isCompleted && (
                    <Icon as={FaCheck} color="green.500" boxSize={5} />
                )}
            </HStack>
        </Box>
    );
};

const StudentList: React.FC = () => {
    const students: Student[] = [
        { id: 1, name: "Ahmad Fauzan", status: "active" },
        { id: 2, name: "Budi Santoso", status: "active" },
        { id: 3, name: "Citra Dewi", status: "inactive" },
    ];

    return (
        <List spacing={3}>
            {students.map((student) => (
                <ListItem
                    key={student.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Text>{student.name}</Text>
                    <Badge
                        colorScheme={student.status === 'active' ? 'green' : 'gray'}
                    >
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                </ListItem>
            ))}
        </List>
    );
};

const ClassContentPage: React.FC = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const bannerBg = useColorModeValue('blue.50', 'blue.900');

    const chapters: Chapter[] = [
        {
            title: "Chapter 1: Pengenalan Pemrograman",
            contents: [
                { title: "Pengantar Logika Pemrograman", type: "Materi", duration: "30 min", isCompleted: true },
                { title: "Latihan Dasar Blockly", type: "Praktik", duration: "45 min", isCompleted: true },
                { title: "Quiz Konsep Dasar", type: "Kuis", duration: "20 min", isCompleted: false },
                { title: "Diskusi Pengenalan", type: "Forum Diskusi", duration: "-", isCompleted: false },
            ]
        },
        {
            title: "Chapter 2: Struktur Kontrol",
            contents: [
                { title: "Penggunaan If-Else", type: "Materi", duration: "45 min", isCompleted: false },
                { title: "Praktik If-Else Blockly", type: "Praktik", duration: "60 min", isCompleted: false },
                { title: "Tugas Struktur Kontrol", type: "Tugas", duration: "120 min", isCompleted: false },
            ]
        }
    ];

    return (
        <Box bg={bgColor} minH="100vh">
            {/* Banner Section */}
            <Box bg={bannerBg} py={8}>
                <Container maxW="container.xl">
                    <HStack spacing={8}>
                        <Image
                            src="/api/placeholder/800/200"
                            alt="Class Banner"
                            width="200px"
                            height="200px"
                            objectFit="cover"
                            borderRadius="lg"
                        />
                        <VStack align="start" spacing={4}>
                            <Heading size="xl">Pemrograman Dasar</Heading>
                            <Text fontSize="lg">
                                Pembelajaran dasar logika pemrograman menggunakan blockly
                            </Text>
                            <HStack spacing={6}>
                                <HStack>
                                    <FaUsers />
                                    <Text>156 Siswa</Text>
                                </HStack>
                                <HStack>
                                    <FaChalkboardTeacher />
                                    <Text>4 Materi</Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </HStack>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxW="container.xl" py={8}>
                <Tabs variant="enclosed">
                    <TabList>
                        <Tab>Materi</Tab>
                        <Tab>Daftar Siswa</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Accordion allowMultiple>
                                {chapters.map((chapter, index) => (
                                    <AccordionItem key={index}>
                                        <AccordionButton py={4}>
                                            <Box flex="1" textAlign="left">
                                                <Text fontWeight="bold">{chapter.title}</Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            <VStack spacing={4} align="stretch">
                                                {chapter.contents.map((content, idx) => (
                                                    <ContentItem key={idx} {...content} />
                                                ))}
                                            </VStack>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </TabPanel>
                        <TabPanel>
                            <StudentList />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Container>
        </Box>
    );
};

export default ClassContentPage;