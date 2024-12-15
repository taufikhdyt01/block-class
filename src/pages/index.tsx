import SEO from '@/components/SEO';
import {
    Box,
    Heading,
    Container,
    Text,
    Button,
    Stack,
    useColorModeValue,
    Image,
    Flex,
    SimpleGrid,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
    const router = useRouter();

    return (
        <>
            <SEO title="Beranda" />
            <Box
                minH="calc(100vh - 60px)"
                display="flex"
                alignItems="center"
            >
                <Container
                    maxW={'7xl'}
                    h="100%"
                    pt={{ base: 4, md: 0 }}
                    display="flex"
                    alignItems="center"
                >
                    <Stack
                        align={'center'}
                        spacing={{ base: 8, md: 10 }}
                        direction={{ base: 'column', lg: 'row' }}
                        py={{ base: 4, md: 8 }}
                    >
                        <Stack
                            flex={1}
                            spacing={{ base: 4, md: 6 }}
                            maxW={{ base: '100%', lg: '50%' }}
                        >
                            <Heading
                                lineHeight={1.1}
                                fontWeight={600}
                                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
                                <Text
                                    as={'span'}
                                    position={'relative'}>
                                    JELAJAHI <br /> DUNIA KODING
                                </Text>
                                <br />
                                <Text as={'span'} color={useColorModeValue('brand.500', 'brand.300')}>
                                    MELALUI PUZZLE INTERAKTIF
                                </Text>
                            </Heading>
                            <Text
                                color={useColorModeValue('gray.600', 'gray.400')}
                                fontSize={'xl'}
                            >
                                BlockClass adalah platform pembelajaran pemrograman berbasis blok.
                                Tingkatkan keterampilan coding Anda melalui tantangan yang menarik
                                dan interaktif. Mulai perjalanan coding Anda sekarang!
                            </Text>
                            <SimpleGrid
                                columns={{ base: 1, sm: 2 }}
                                spacing={4}
                                w="full"
                                maxW={{ base: "full", sm: "md" }}
                            >
                                <Button
                                    onClick={() => router.push('/simulasi')}
                                    rounded={'full'}
                                    size={'lg'}
                                    fontWeight={'normal'}
                                    px={8}
                                    variant="outline"
                                    colorScheme="brand"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        shadow: 'md',
                                    }}
                                    transition="all 0.2s"
                                >
                                    Mulai Simulasi
                                </Button>
                                <Button
                                    onClick={() => router.push('/tantangan')}
                                    rounded={'full'}
                                    size={'lg'}
                                    fontWeight={'normal'}
                                    px={8}
                                    colorScheme="brand"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        shadow: 'md',
                                    }}
                                    transition="all 0.2s"
                                >
                                    Mulai Tantangan
                                </Button>
                            </SimpleGrid>
                        </Stack>

                        <Flex
                            flex={1}
                            justify={'center'}
                            align={'center'}
                            display={{ base: 'none', lg: 'flex' }}
                            position="relative"
                            h="100%"
                        >
                            <Image
                                alt={'Block Programming'}
                                fit={'contain'}
                                w={'100%'}
                                h={'auto'}
                                maxH={'80vh'}
                                src={'hero-image.png'}
                                style={{
                                    filter: useColorModeValue('none', 'brightness(0.9) contrast(1.1)')
                                }}
                            />
                        </Flex>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default Home;