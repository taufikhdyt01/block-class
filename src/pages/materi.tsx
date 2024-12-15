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
    Flex,
    Badge,
    Link,
} from '@chakra-ui/react';
import {
    FaChevronRight,
    FaDownload,
    FaArrowLeft,
    FaArrowRight,
    FaFilePdf,
    FaClock
} from 'react-icons/fa';

interface ContentNavigationProps {
    previousContent?: {
        title: string;
        href: string;
    };
    nextContent?: {
        title: string;
        href: string;
    };
}

interface ContentMeta {
    type: 'video' | 'pdf';
    duration?: string;
    fileSize?: string;
}

interface ContentPageProps {
    title?: string;
    chapterTitle?: string;
    content?: {
        type: ContentMeta['type'];
        url: string;
        description: string;
    };
    navigation?: ContentNavigationProps;
}

const VideoEmbed: React.FC<{ url: string }> = ({ url }) => (
    <Box
        position="relative"
        paddingTop="56.25%" // 16:9 Aspect Ratio
        width="100%"
        bg="gray.100"
        borderRadius="lg"
        overflow="hidden"
    >
        <iframe
            src={url}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none"
            }}
            allowFullScreen
        />
    </Box>
);

const PDFDownload: React.FC<{ url: string, filename: string, fileSize: string }> = ({ url, filename, fileSize }) => {
    const bgColor = useColorModeValue('gray.50', 'gray.700');

    return (
        <Box
            p={6}
            bg={bgColor}
            borderRadius="lg"
            borderWidth="1px"
            borderStyle="dashed"
        >
            <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                    <Icon as={FaFilePdf} boxSize={8} color="red.500" />
                    <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{filename}</Text>
                        <Text fontSize="sm" color="gray.500">{fileSize}</Text>
                    </VStack>
                </HStack>
                <Button
                    leftIcon={<FaDownload />}
                    colorScheme="blue"
                    variant="solid"
                    as="a"
                    href={url}
                    download
                >
                    Download PDF
                </Button>
            </VStack>
        </Box>
    );
};

const ContentNavigation: React.FC<ContentNavigationProps> = ({ previousContent, nextContent }) => {
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <HStack justify="space-between" w="100%" pt={8}>
            {previousContent ? (
                <Button
                    leftIcon={<FaArrowLeft />}
                    variant="outline"
                    as={Link}
                    href={previousContent.href}
                >
                    {previousContent.title}
                </Button>
            ) : <Box />}

            {nextContent && (
                <Button
                    rightIcon={<FaArrowRight />}
                    colorScheme="blue"
                    as={Link}
                    href={nextContent.href}
                >
                    {nextContent.title}
                </Button>
            )}
        </HStack>
    );
};

const defaultContent = {
    title: "Pengantar Logika Pemrograman",
    chapterTitle: "Chapter 1: Pengenalan Pemrograman",
    content: {
        type: "video" as const,
        url: "https://www.youtube.com/embed/your-video-id",
        description: `Pada materi ini, kita akan mempelajari dasar-dasar logika pemrograman yang mencakup:

1. Konsep dasar algoritma
2. Penggunaan variabel dan tipe data
3. Struktur kontrol dasar

Setelah mempelajari materi ini, Anda diharapkan dapat memahami konsep dasar pemrograman dan siap untuk melanjutkan ke materi berikutnya.`
    },
    navigation: {
        previousContent: {
            title: "Pendahuluan",
            href: "/courses/programming/intro"
        },
        nextContent: {
            title: "Praktik Blockly",
            href: "/courses/programming/blockly"
        }
    }
};

const MateriPage = () => {
    const sampleContent = {
        title: "Pengantar Logika Pemrograman",
        chapterTitle: "Chapter 1: Pengenalan Pemrograman",
        content: {
            type: "video" as const,
            url: "https://www.youtube.com/embed/your-video-id",
            description: `Pada materi ini, kita akan mempelajari dasar-dasar logika pemrograman yang mencakup:

1. Konsep dasar algoritma
2. Penggunaan variabel dan tipe data
3. Struktur kontrol dasar

Setelah mempelajari materi ini, Anda diharapkan dapat memahami konsep dasar pemrograman dan siap untuk melanjutkan ke materi berikutnya.`
        },
        navigation: {
            previousContent: {
                title: "Pendahuluan",
                href: "/courses/programming/intro"
            },
            nextContent: {
                title: "Praktik Blockly",
                href: "/courses/programming/blockly"
            }
        }
    };

    return <CourseContentPage {...sampleContent} />;
};

const CourseContentPage: React.FC<ContentPageProps> = ({
    title = defaultContent.title,
    chapterTitle = defaultContent.chapterTitle,
    content = defaultContent.content,
    navigation = defaultContent.navigation
}) => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    const contentMeta: ContentMeta = {
        type: content.type,
        duration: '25 menit',
        fileSize: '2.4 MB'
    };

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

                    {/* Content Header */}
                    <VStack align="start" spacing={4}>
                        <Badge colorScheme="blue" fontSize="sm">
                            {chapterTitle}
                        </Badge>
                        <Heading size="lg">{title}</Heading>
                        <HStack>
                            <Icon as={FaClock} color="gray.500" />
                            <Text color="gray.500">{contentMeta.duration}</Text>
                        </HStack>
                    </VStack>

                    {/* Main Content */}
                    <Box
                        bg={useColorModeValue('white', 'gray.800')}
                        p={8}
                        borderRadius="lg"
                        shadow="sm"
                    >
                        {content.type === 'video' ? (
                            <VideoEmbed url={content.url} />
                        ) : (
                            <PDFDownload
                                url={content.url}
                                filename="materi-pembelajaran.pdf"
                                fileSize={contentMeta.fileSize || ''}
                            />
                        )}

                        {/* Content Description */}
                        <Box mt={6}>
                            <Text whiteSpace="pre-wrap">
                                {content.description}
                            </Text>
                        </Box>
                    </Box>

                    {/* Navigation between contents */}
                    <ContentNavigation {...navigation} />
                </VStack>
            </Container>
        </Box>
    );
};

export default MateriPage;