import React, { ReactNode, useEffect, useState } from 'react';
import {
    Box,
    Tabs,
    TabList,
    Tab,
    Container,
    Heading,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    HStack,
    Icon,
    Text,
    VStack,
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import {
    FaChevronRight,
    FaCode,
    FaMedal,
    FaPaperPlane,
    FaTrophy
} from 'react-icons/fa';

interface ChallengeLayoutProps {
    children: ReactNode;
    slug: string;
    challengeTitle: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
}

const ChallengeLayout: React.FC<ChallengeLayoutProps> = ({
    children,
    slug,
    challengeTitle,
    difficulty,
    category
}) => {
    const router = useRouter();
    const [tabIndex, setTabIndex] = useState(0);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const breadcrumbColor = useColorModeValue('gray.600', 'gray.400');

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
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

    const getDifficultyLabel = (difficulty?: string) => {
        switch (difficulty) {
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

    useEffect(() => {
        const path = router.pathname;
        if (path.includes('/pengajuan') || path.includes('/hasil')) {
            setTabIndex(1);
        } else if (path.endsWith('/papan-peringkat')) {
            setTabIndex(2);
        } else {
            setTabIndex(0);
        }
    }, [router.pathname]);

    const handleTabChange = (index: number) => {
        setTabIndex(index);
        switch (index) {
            case 0:
                router.push(`/tantangan/${slug}`);
                break;
            case 1:
                router.push(`/tantangan/${slug}/pengajuan`);
                break;
            case 2:
                router.push(`/tantangan/${slug}/papan-peringkat`);
                break;
        }
    };

    const tabData = [
        { label: 'Soal', icon: FaCode },
        { label: 'Pengajuan', icon: FaPaperPlane },
        { label: 'Papan Peringkat', icon: FaMedal },
    ];

    return (
        <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 60px)">
            <Container maxW="container.xl" py={8}>
                <VStack spacing={8} align="stretch">
                    {/* Breadcrumb Navigation */}
                    <Breadcrumb
                        spacing={2}
                        separator={<Icon as={FaChevronRight} color={breadcrumbColor} w={3} h={3} />}
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                href="/tantangan"
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push('/tantangan');
                                }}
                            >
                                <HStack spacing={2}>
                                    <Icon as={FaTrophy} w={4} h={4} />
                                    <Text>Tantangan</Text>
                                </HStack>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <Text color={useColorModeValue('gray.800', 'white')} fontWeight="medium">
                                {challengeTitle}
                            </Text>
                        </BreadcrumbItem>
                    </Breadcrumb>

                    {/* Challenge Title & Info */}
                    <Box
                        bg={bgColor}
                        p={6}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <VStack align="start" spacing={4}>
                            <Heading
                                size="xl"
                                bgGradient="linear(to-r, brand.500, brand.300)"
                                bgClip="text"
                            >
                                {challengeTitle}
                            </Heading>
                            <HStack spacing={4}>
                                {difficulty && (
                                    <Badge
                                        colorScheme={getDifficultyColor(difficulty)}
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="sm"
                                        textTransform="capitalize"
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <Box as="span" mr={2}>●</Box>
                                        {getDifficultyLabel(difficulty)}
                                    </Badge>
                                )}
                                {category && (
                                    <Badge
                                        colorScheme="purple"
                                        px={3}
                                        py={1}
                                        borderRadius="full"
                                        fontSize="sm"
                                        textTransform="capitalize"
                                    >
                                        {category}
                                    </Badge>
                                )}
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Navigation Tabs */}
                    <Box
                        bg={bgColor}
                        borderRadius="lg"
                        boxShadow="sm"
                        borderWidth={1}
                        borderColor={borderColor}
                    >
                        <Tabs
                            index={tabIndex}
                            onChange={handleTabChange}
                            isLazy
                            colorScheme="brand"
                            variant="enclosed"
                        >
                            <TabList px={4} pt={4}>
                                {tabData.map((tab, index) => (
                                    <Tab
                                        key={index}
                                        _selected={{
                                            color: 'brand.500',
                                            borderColor: 'inherit',
                                            borderBottom: 'none',
                                            bg: bgColor
                                        }}
                                    >
                                        <HStack spacing={2}>
                                            <Icon as={tab.icon} />
                                            <Text>{tab.label}</Text>
                                        </HStack>
                                    </Tab>
                                ))}
                            </TabList>
                            <Box p={6}>
                                {children}
                            </Box>
                        </Tabs>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default ChallengeLayout;