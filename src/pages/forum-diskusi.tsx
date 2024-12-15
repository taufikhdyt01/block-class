import React, { useState } from 'react';
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
    Avatar,
    Input,
    Textarea,
    Divider,
    Badge,
    Flex,
} from '@chakra-ui/react';
import {
    FaChevronRight,
    FaComments,
    FaClock,
    FaThumbsUp,
    FaReply,
} from 'react-icons/fa';

interface Comment {
    id: number;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
    replies: Reply[];
}

interface Reply {
    id: number;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
}

const ForumDiscussionPage: React.FC = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const [newDiscussion, setNewDiscussion] = useState('');
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            authorName: 'Budi Santoso',
            authorAvatar: '/api/placeholder/40/40',
            content: 'Bagaimana cara menggunakan loop dalam blockly? Saya masih bingung dengan konsep pengulangan.',
            timestamp: '2 jam yang lalu',
            replies: [
                {
                    id: 1,
                    authorName: 'Ahmad Fauzan',
                    authorAvatar: '/api/placeholder/40/40',
                    content: 'Untuk menggunakan loop di blockly, Anda bisa menggunakan blok "repeat" yang ada di kategori Loops. Taruh blok yang ingin diulang di dalam blok repeat.',
                    timestamp: '1 jam yang lalu',
                }
            ]
        }
    ]);

    const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => (
        <Box
            p={6}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
            width="100%"
        >
            <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                    <HStack spacing={4}>
                        <Avatar src={comment.authorAvatar} name={comment.authorName} size="sm" />
                        <VStack align="start" spacing={0}>
                            <Text fontWeight="bold">{comment.authorName}</Text>
                            <Text fontSize="sm" color="gray.500">{comment.timestamp}</Text>
                        </VStack>
                    </HStack>
                    <Badge colorScheme="blue">Pertanyaan</Badge>
                </HStack>

                <Text>{comment.content}</Text>

                <HStack spacing={4}>
                    <Button
                        size="sm"
                        leftIcon={<FaReply />}
                        variant="ghost"
                        colorScheme="blue"
                    >
                        Balas
                    </Button>
                </HStack>

                {/* Replies */}
                <VStack align="stretch" pl={8} spacing={4}>
                    {comment.replies.map(reply => (
                        <Box
                            key={reply.id}
                            p={4}
                            bg={useColorModeValue('gray.50', 'gray.700')}
                            borderRadius="md"
                        >
                            <VStack align="stretch" spacing={3}>
                                <HStack spacing={4}>

                                    <Avatar src={reply.authorAvatar} name={reply.authorName} size="xs" />
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold" fontSize="sm">{reply.authorName}</Text>
                                        <Text fontSize="xs" color="gray.500">{reply.timestamp}</Text>
                                    </VStack>
                                </HStack>
                                <Text fontSize="sm">{reply.content}</Text>
                            </VStack>
                        </Box>
                    ))}
                </VStack>
            </VStack>
        </Box>
    );

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
                            <BreadcrumbLink>Forum Diskusi</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    {/* Header */}
                    <VStack align="start" spacing={4}>
                        <Badge colorScheme="blue" fontSize="sm">
                            Chapter 1: Pengenalan Pemrograman
                        </Badge>
                        <Heading size="lg">Forum Diskusi</Heading>
                        <HStack>
                            <Icon as={FaComments} color="gray.500" />
                            <Text color="gray.500">{comments.length} Diskusi</Text>
                        </HStack>
                    </VStack>

                    {/* New Discussion Form */}
                    <Box
                        p={6}
                        bg={cardBg}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <VStack align="stretch" spacing={4}>
                            <Heading size="sm">Mulai Diskusi Baru</Heading>
                            <Textarea
                                value={newDiscussion}
                                onChange={(e) => setNewDiscussion(e.target.value)}
                                placeholder="Tulis pertanyaan atau diskusi Anda di sini..."
                                rows={4}
                            />
                            <Button
                                colorScheme="blue"
                                alignSelf="flex-end"
                                leftIcon={<FaComments />}
                            >
                                Kirim Diskusi
                            </Button>
                        </VStack>
                    </Box>

                    {/* Discussion List */}
                    <VStack spacing={4} align="stretch">
                        {comments.map(comment => (
                            <CommentCard key={comment.id} comment={comment} />
                        ))}
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
};

export default ForumDiscussionPage;