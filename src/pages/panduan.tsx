import React, { useState } from 'react';
import {
    Box,
    Text,
    VStack,
    Input,
    Grid,
    Icon,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    Container,
    Heading,
    Flex,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Image,
    Collapse,
    useDisclosure,
} from '@chakra-ui/react';
import { Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Categories } from '@/constants/BlockCategories';
import SEO from '@/components/SEO';

// Types
interface Image {
    url: string;
    caption: string;
}

interface Section {
    title: string;
    content: string;
    images: Image[];
}

interface SectionProps {
    section: Section;
    searchQuery: string;
}

interface ModificationStep {
    content: string;
    image: Image;
}

interface Modification {
    title: string;
    description: string;
    steps: ModificationStep[];
}

interface Category {
    title: string;
    description: string;
    sections: Section[];
    modification?: Modification;
}

const PanduanPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>(Object.keys(Categories)[0]);

    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');
    const gradientText = useColorModeValue(
        'linear(to-r, blue.600, blue.400)',
        'linear(to-r, blue.400, blue.300)'
    );

    const filteredCategories = Object.entries(Categories).filter(([_, category]) => {
        const query = searchQuery.toLowerCase();
        const matchesTitle = category.title.toLowerCase().includes(query);
        const matchesDescription = category.description.toLowerCase().includes(query);
        const matchesSections = category.sections.some(section =>
            section.title.toLowerCase().includes(query) ||
            section.content.toLowerCase().includes(query)
        );
        return matchesTitle || matchesDescription || matchesSections;
    });

    return (
        <>
            <SEO title="Panduan" />
            <Box minH="calc(100vh - 60px)" bg={bgColor} py={8}>
                <Container maxW="container.xl">
                    {/* Header */}
                    <VStack textAlign="center" mb={8} spacing={4}>
                        <Heading
                            fontSize={{ base: "3xl", md: "4xl" }}
                            bgGradient={gradientText}
                            bgClip="text"
                            lineHeight={1.4}
                        >
                            Panduan Penggunaan
                        </Heading>
                        <Text fontSize="lg" color={textColor} maxW="2xl" mx="auto">
                            Pelajari cara menggunakan berbagai jenis blok dan konsep pemrograman
                            dalam pemrograman visual
                        </Text>
                        <Box w="full" maxW="xl">
                            <InputGroup size="lg">
                                <InputLeftElement>
                                    <Icon as={Search} color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Cari panduan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    bg={cardBg}
                                    borderColor={borderColor}
                                    fontSize="md"
                                />
                            </InputGroup>
                        </Box>
                    </VStack>

                    {/* Main Content */}
                    <Grid templateColumns={{ base: '1fr', lg: '280px 1fr' }} gap={8}>
                        {/* Sidebar Navigation */}
                        <Box display={{ base: 'none', lg: 'block' }}>
                            <VStack
                                spacing={2}
                                position="sticky"
                                top="20px"
                                maxH="calc(100vh - 40px)"
                                overflowY="auto"
                                pb={4}
                            >
                                {filteredCategories.map(([key, category]) => (
                                    <Button
                                        key={key}
                                        w="full"
                                        justifyContent="start"
                                        variant={activeCategory === key ? 'solid' : 'ghost'}
                                        colorScheme={activeCategory === key ? 'blue' : 'gray'}
                                        leftIcon={<BookOpen size={18} />}
                                        onClick={() => setActiveCategory(key)}
                                        py={6}
                                    >
                                        <Text fontSize="sm" fontWeight="medium">
                                            {category.title}
                                        </Text>
                                    </Button>
                                ))}
                            </VStack>
                        </Box>

                        {/* Mobile Category Tabs */}
                        <Tabs
                            display={{ base: 'block', lg: 'none' }}
                            variant="soft-rounded"
                            colorScheme="blue"
                            mb={6}
                        >
                            <TabList overflowX="auto" py={2}>
                                {filteredCategories.map(([key, category]) => (
                                    <Tab
                                        key={key}
                                        onClick={() => setActiveCategory(key)}
                                        fontSize="sm"
                                        py={3}
                                        px={4}
                                        whiteSpace="nowrap"
                                    >
                                        {category.title}
                                    </Tab>
                                ))}
                            </TabList>
                        </Tabs>

                        {/* Content */}
                        <Box>
                            {filteredCategories.map(([key, category]) => (
                                <Box
                                    key={key}
                                    display={activeCategory === key ? 'block' : 'none'}
                                >
                                    <VStack spacing={8} align="stretch">
                                        <Box>
                                            <Heading size="xl" mb={4}>
                                                {category.title}
                                            </Heading>
                                            <Text fontSize="lg" color={textColor}>
                                                {category.description}
                                            </Text>
                                        </Box>

                                        {/* Sections */}
                                        {category.sections.map((section, index) => (
                                            <Section
                                                key={index}
                                                section={section}
                                                searchQuery={searchQuery}
                                            />
                                        ))}

                                        {/* Modification Guide */}
                                        {category.modification && (
                                            <ModificationGuide
                                                modification={category.modification}
                                            />
                                        )}
                                    </VStack>
                                </Box>
                            ))}

                            {/* Empty State */}
                            {filteredCategories.length === 0 && (
                                <EmptyState
                                    searchQuery={searchQuery}
                                    onReset={() => setSearchQuery('')}
                                />
                            )}
                        </Box>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

// Section Component
const Section: React.FC<SectionProps> = ({ section, searchQuery }) => {
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            rounded="lg"
            overflow="hidden"
        >
            <Button
                onClick={onToggle}
                variant="ghost"
                width="full"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={6}
                py={4}
                _hover={{ bg: 'transparent' }}
            >
                <Heading size="md">{section.title}</Heading>
                <Icon as={isOpen ? ChevronUp : ChevronDown} />
            </Button>

            <Collapse in={isOpen}>
                <Box p={6} pt={2}>
                    <Text color={textColor} whiteSpace="pre-wrap" mb={6}>
                        {section.content}
                    </Text>

                    {section.images.length > 0 && (
                        <Grid
                            templateColumns={{
                                base: '1fr',
                                md: 'repeat(2, 1fr)'
                            }}
                            gap={4}
                        >
                            {section.images.map((image, index) => (
                                <Box key={index}>
                                    <Image
                                        src={image.url}
                                        alt={image.caption}
                                        rounded="md"
                                        shadow="sm"
                                    />
                                    <Text
                                        fontSize="sm"
                                        color={textColor}
                                        mt={2}
                                        fontStyle="italic"
                                    >
                                        {image.caption}
                                    </Text>
                                </Box>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};

// Modification Guide Component
interface ModificationGuideProps {
    modification: Modification;
}

const ModificationGuide: React.FC<ModificationGuideProps> = ({ modification }) => {
    const textColor = useColorModeValue('gray.600', 'gray.400');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    return (
        <Box
            mt={8}
            p={6}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            rounded="lg"
        >
            <Heading size="lg" mb={4}>
                {modification.title}
            </Heading>
            <Text color={textColor} mb={6}>
                {modification.description}
            </Text>
            <VStack spacing={6} align="stretch">
                {modification.steps.map((step, index) => (
                    <Grid
                        key={index}
                        templateColumns={{
                            base: '1fr',
                            md: 'repeat(2, 1fr)'
                        }}
                        gap={6}
                    >
                        <Flex gap={3}>
                            <Flex
                                w={6}
                                h={6}
                                rounded="full"
                                bg="blue.500"
                                color="white"
                                align="center"
                                justify="center"
                                fontSize="sm"
                                flexShrink={0}
                            >
                                {index + 1}
                            </Flex>
                            <Text color={textColor}>
                                {step.content}
                            </Text>
                        </Flex>
                        <Box>
                            <Image
                                src={step.image.url}
                                alt={step.image.caption}
                                rounded="md"
                                shadow="sm"
                            />
                            <Text
                                mt={2}
                                fontSize="sm"
                                color={textColor}
                                fontStyle="italic"
                            >
                                {step.image.caption}
                            </Text>
                        </Box>
                    </Grid>
                ))}
            </VStack>
        </Box>
    );
};

// Empty State Component
interface EmptyStateProps {
    searchQuery: string;
    onReset: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onReset }) => {
    const textColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <VStack spacing={4} py={12}>
            <Text fontSize="lg" color={textColor}>
                Tidak ada panduan yang sesuai dengan pencarian "{searchQuery}"
            </Text>
            <Button
                variant="outline"
                onClick={onReset}
            >
                Reset Pencarian
            </Button>
        </VStack>
    );
};

export default PanduanPage;