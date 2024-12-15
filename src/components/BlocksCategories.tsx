import React, { useState } from 'react';
import {
    Box,
    Text,
    VStack,
    Heading,
    Image,
    Grid,
    GridItem,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    useColorModeValue,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Button,
} from '@chakra-ui/react';
import { Search, Settings, BookOpen } from 'lucide-react';

interface Image {
    url: string;
    caption: string;
}

interface Section {
    title: string;
    content: string;
    images: Image[];
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

interface Categories {
    [key: string]: Category;
}

interface ImageGalleryProps {
    images: Image[];
}

interface ModificationStepsProps {
    steps: ModificationStep[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const captionColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {images.map((image, index) => (
                <Box key={index}>
                    <Image
                        src={image.url}
                        alt={image.caption}
                        borderRadius="md"
                        boxShadow="sm"
                        width="100%"
                    />
                    <Text
                        mt={2}
                        fontSize="sm"
                        color={captionColor}
                        fontStyle="italic"
                    >
                        {image.caption}
                    </Text>
                </Box>
            ))}
        </Grid>
    );
};

const ModificationSteps: React.FC<ModificationStepsProps> = ({ steps }) => {
    return (
        <VStack spacing={8} align="stretch">
            {steps.map((step, index) => (
                <Grid key={index} templateColumns="repeat(2, 1fr)" gap={6} alignItems="start">
                    <Flex gap={3}>
                        <Flex
                            w={6}
                            h={6}
                            borderRadius="full"
                            bg="blue.500"
                            color="white"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="sm"
                            flexShrink={0}
                        >
                            {index + 1}
                        </Flex>
                        <Text color={useColorModeValue('gray.700', 'gray.300')}>
                            {step.content}
                        </Text>
                    </Flex>
                    <Box>
                        <Image
                            src={step.image.url}
                            alt={step.image.caption}
                            borderRadius="md"
                            boxShadow="sm"
                            width="100%"
                        />
                        <Text
                            mt={2}
                            fontSize="sm"
                            color={useColorModeValue('gray.600', 'gray.400')}
                            fontStyle="italic"
                        >
                            {step.image.caption}
                        </Text>
                    </Box>
                </Grid>
            ))}
        </VStack>
    );
};

const BlockCategories: React.FC<{ categories: Categories }> = ({ categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(Object.keys(categories)[0]);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const headingColor = useColorModeValue('gray.800', 'white');
    const activeBgColor = useColorModeValue('blue.50', 'blue.900');
    const activeTextColor = useColorModeValue('blue.700', 'blue.200');
    const cardBg = useColorModeValue('white', 'gray.800');

    const filteredCategories = Object.entries(categories).filter(([_, category]) => {
        const query = searchQuery.toLowerCase();
        return (
            category.title.toLowerCase().includes(query) ||
            category.description.toLowerCase().includes(query) ||
            category.sections.some(section =>
                section.title.toLowerCase().includes(query) ||
                section.content.toLowerCase().includes(query)
            )
        );
    });

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <Text>
                {parts.map((part, index) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <Text
                            as="mark"
                            key={index}
                            bg="yellow.200"
                            color="gray.900"
                            px={0.5}
                            rounded="sm"
                        >
                            {part}
                        </Text>
                    ) : (
                        part
                    )
                )}
            </Text>
        );
    };

    return (
        <Box w="full">
            {/* Header and Search Section */}
            <VStack spacing={4} align="stretch" mb={6}>
                <Flex justify="space-between" align="center">
                    <Heading size="lg">Dokumentasi Block</Heading>
                    <InputGroup maxW="xs">
                        <InputLeftElement>
                            <Icon as={Search} color="gray.500" />
                        </InputLeftElement>
                        <Input
                            placeholder="Cari dokumentasi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Flex>
                <Text color={textColor}>
                    Pelajari berbagai kategori blok dan cara penggunaannya dalam pemrograman visual.
                </Text>
            </VStack>

            {/* Main Content Grid */}
            <Grid templateColumns="1fr 3fr" gap={6}>
                {/* Sidebar Navigation */}
                <Box
                    bg={cardBg}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    overflow="hidden"
                >
                    <VStack spacing={0} align="stretch">
                        {filteredCategories.map(([key, category]) => (
                            <Button
                                key={key}
                                onClick={() => setActiveCategory(key)}
                                variant="ghost"
                                justifyContent="flex-start"
                                px={4}
                                py={3}
                                borderLeft="4px solid"
                                borderLeftColor={activeCategory === key ? 'blue.500' : 'transparent'}
                                bg={activeCategory === key ? activeBgColor : 'transparent'}
                                color={activeCategory === key ? activeTextColor : textColor}
                                _hover={{
                                    bg: activeBgColor,
                                }}
                                leftIcon={<Icon as={BookOpen} />}
                                width="full"
                                borderRadius="0"
                            >
                                <Text isTruncated>{highlightText(category.title, searchQuery)}</Text>
                            </Button>
                        ))}
                    </VStack>
                </Box>

                {/* Content Area */}
                <Box
                    bg={cardBg}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    p={6}
                >
                    {activeCategory && categories[activeCategory] && (
                        <VStack spacing={6} align="stretch">
                            {/* Category Header */}
                            <Box borderBottom="1px" borderColor={borderColor} pb={4}>
                                <Heading size="lg" mb={2}>
                                    {highlightText(categories[activeCategory].title, searchQuery)}
                                </Heading>
                                <Text color={textColor}>
                                    {highlightText(categories[activeCategory].description, searchQuery)}
                                </Text>
                            </Box>

                            {/* Sections */}
                            <VStack spacing={6} align="stretch">
                                {categories[activeCategory].sections.map((section, index) => (
                                    <Box
                                        key={index}
                                        borderWidth="1px"
                                        borderColor={borderColor}
                                        borderRadius="lg"
                                        p={4}
                                    >
                                        <Heading size="md" mb={2}>
                                            {highlightText(section.title, searchQuery)}
                                        </Heading>
                                        <Box color={textColor} mb={4} whiteSpace="pre-wrap">
                                            {highlightText(section.content, searchQuery)}
                                        </Box>
                                        <ImageGallery images={section.images} />
                                    </Box>
                                ))}
                            </VStack>

                            {/* Modification Section if exists */}
                            {categories[activeCategory].modification && (
                                <Box
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    borderRadius="lg"
                                    p={4}
                                    mt={6}
                                >
                                    <Flex align="center" gap={2} mb={4}>
                                        <Icon as={Settings} color="blue.500" />
                                        <Heading size="md">
                                            {highlightText(categories[activeCategory].modification.title, searchQuery)}
                                        </Heading>
                                    </Flex>
                                    <Text color={textColor} mb={6}>
                                        {highlightText(categories[activeCategory].modification.description, searchQuery)}
                                    </Text>
                                    <ModificationSteps
                                        steps={categories[activeCategory].modification.steps.map(step => ({
                                            ...step,
                                            content: highlightText(step.content, searchQuery) as any
                                        }))}
                                    />
                                </Box>
                            )}
                        </VStack>
                    )}
                </Box>
            </Grid>
        </Box>
    );
};

export default BlockCategories;