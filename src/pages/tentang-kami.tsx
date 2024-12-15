import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    VStack,
    Image,
    useColorModeValue,
    Flex,
    Stack,
    Icon,
    SimpleGrid,
    IconButton,
    Link,
    HStack,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import {
    FaCode,
    FaTrophy,
    FaChartLine,
    FaLinkedin,
    FaEnvelope,
    FaGraduationCap,
    FaAward,
    FaUserGraduate,
    FaRocket
} from 'react-icons/fa';
import SEO from '@/components/SEO';

interface FeatureProps {
    title: string;
    text: string;
    icon: React.ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
    const featureTextColor = useColorModeValue('gray.600', 'gray.300');
    const iconBgColor = useColorModeValue('brand.500', 'brand.400');

    return (
        <Stack
            align={'center'}
            textAlign={'center'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            p={6}
            boxShadow={'lg'}
            transition="all 0.3s"
            _hover={{
                transform: 'translateY(-5px)',
                boxShadow: 'xl',
            }}
            height="full"
        >
            <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={iconBgColor}
                mb={4}
            >
                {icon}
            </Flex>
            <Text fontWeight={700} fontSize={'xl'} mb={2}>{title}</Text>
            <Text color={featureTextColor}>{text}</Text>
        </Stack>
    );
};

const TentangKamiPage: NextPage = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const sectionBgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const secondaryTextColor = useColorModeValue('gray.500', 'gray.400');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <>
            <SEO title="Tentang Kami" />
            <Box bg={bgColor} color={textColor}>
                {/* Hero Section */}
                <Box bg={sectionBgColor} pt={20} pb={16}>
                    <Container maxW={'7xl'}>
                        <Stack
                            direction={{ base: 'column', md: 'row' }}
                            spacing={{ base: 8, md: 12 }}
                            align={'center'}
                            justify={'center'}
                        >
                            {/* Text Content */}
                            <VStack
                                spacing={6}
                                flex={1}
                                align={{ base: 'center', md: 'start' }}
                            >
                                <Heading
                                    size="2xl"
                                    bgGradient="linear(to-r, brand.500, brand.300)"
                                    bgClip="text"
                                    lineHeight={1.4}
                                    textAlign={{ base: 'center', md: 'left' }}
                                >
                                    Tentang Kami
                                </Heading>
                                <Text
                                    color={textColor}
                                    fontSize="lg"
                                    textAlign={{ base: 'center', md: 'left' }}
                                >
                                    Platform pembelajaran pemrograman yang inovatif dan interaktif.
                                    Kami bertujuan untuk membuat coding menjadi lebih mudah dipahami
                                    dan menyenangkan untuk dipelajari melalui pendekatan berbasis blok.
                                </Text>
                            </VStack>

                            {/* Logo */}
                            <Flex
                                justify="center"
                                align="center"
                                flex={1}
                            >
                                <Image
                                    src="logo.png"
                                    alt="e-block logo"
                                    height={{ base: "100px", md: "120px" }}
                                    width="auto"
                                    objectFit="contain"
                                />
                            </Flex>
                        </Stack>
                    </Container>
                </Box>

                <Container maxW={'7xl'} py={16}>
                    {/* Features Section */}
                    <VStack spacing={12}>
                        <Heading
                            fontSize={'3xl'}
                            textAlign="center"
                            mb={4}
                        >
                            Fitur Unggulan
                        </Heading>
                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} width="full">
                            <Feature
                                icon={<Icon as={FaCode} w={8} h={8} />}
                                title={'Berbasis Puzzle'}
                                text={'Metode visual intuitif untuk memahami logika pemrograman melalui susunan blok puzzle yang interaktif.'}
                            />
                            <Feature
                                icon={<Icon as={FaRocket} w={8} h={8} />}
                                title={'Simulasi Interaktif'}
                                text={'Pelajari dasar pemrograman melalui simulasi interaktif yang mudah dipahami.'}
                            />
                            <Feature
                                icon={<Icon as={FaTrophy} w={8} h={8} />}
                                title={'Tantangan Menarik'}
                                text={'Uji kemampuan Anda dengan berbagai tantangan pemrograman yang menantang.'}
                            />
                            <Feature
                                icon={<Icon as={FaChartLine} w={8} h={8} />}
                                title={'Sistem Peringkat'}
                                text={'Pantau perkembangan dan bandingkan pencapaian Anda dengan pengguna lain dan raih posisi teratas.'}
                            />
                        </SimpleGrid>
                    </VStack>

                    {/* Profile Section */}
                    <Box
                        mt={20}
                        bg={sectionBgColor}
                        boxShadow={'xl'}
                        rounded={'2xl'}
                        overflow={'hidden'}
                        borderWidth="1px"
                        borderColor={borderColor}
                    >
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={0}>
                            <Flex
                                flex={1}
                                bg={'brand.500'}
                                p={8}
                                align={'center'}
                                justify={'center'}
                                direction={'column'}
                                color={'white'}
                            >
                                <Image
                                    alt={'Taufik Hidayat'}
                                    fit={'cover'}
                                    boxSize={'200px'}
                                    src={'pengembang.jpeg'}
                                    borderRadius={'full'}
                                    border={'4px solid white'}
                                    mb={4}
                                />
                                <Heading size={'lg'} mb={4}>Pengembang</Heading>
                                <Heading size={'md'} mb={6}>Taufik Hidayat</Heading>
                                <VStack spacing={4} align="start">
                                    <HStack spacing={4} align="start">
                                        <Icon as={FaGraduationCap} w={6} h={6} />
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight={500}>Mahasiswa S1 Pendidikan Teknologi Informasi</Text>
                                            <Text fontSize="sm">Universitas Brawijaya</Text>
                                            <Text fontSize="sm" color="whiteAlpha.800">(2021 - Sekarang)</Text>
                                        </VStack>
                                    </HStack>
                                    <HStack spacing={4} align="start">
                                        <Icon as={FaGraduationCap} w={6} h={6} />
                                        <VStack align="start" spacing={1}>
                                            <Text fontWeight={500}>Mahasiswa S2 Magister Ilmu Komputer</Text>
                                            <Text fontSize="sm">Universitas Brawijaya</Text>
                                            <Text fontSize="sm" color="whiteAlpha.800">(2024 - Sekarang)</Text>
                                        </VStack>
                                    </HStack>
                                </VStack>
                            </Flex>
                            <Stack flex={2} p={8} spacing={6}>
                                <VStack align="start" spacing={6}>
                                    <Heading size="md">Tentang Pengembang</Heading>
                                    <Text fontSize={'lg'} color={textColor}>
                                        Taufik adalah seorang mahasiswa yang sedang menempuh pendidikan S1 Pendidikan
                                        Teknologi Informasi dan S2 Magister Ilmu Komputer di Universitas Brawijaya.
                                        Dengan passion di bidang teknologi pembelajaran dan pengembangan perangkat lunak
                                        pendidikan, ia menggabungkan pengetahuan akademis dengan keahlian teknis untuk
                                        menciptakan solusi pembelajaran yang inovatif.
                                    </Text>
                                    <Text fontSize={'lg'} color={textColor}>
                                        Melalui e-block, ia mengembangkan platform pembelajaran yang:
                                    </Text>
                                    <VStack align={'start'} spacing={3} pl={4}>
                                        <Text>• Mudah diakses oleh semua kalangan</Text>
                                        <Text>• Memiliki pendekatan pembelajaran yang terstruktur</Text>
                                        <Text>• Mengutamakan pengalaman pengguna yang interaktif</Text>
                                        <Text>• Mendorong pembelajaran berkelanjutan</Text>
                                    </VStack>
                                </VStack>
                                <HStack spacing={4} pt={4}>
                                    <Link href="https://linkedin.com/in/tfkhdyt" isExternal>
                                        <IconButton
                                            aria-label="LinkedIn"
                                            icon={<FaLinkedin />}
                                            size="lg"
                                            colorScheme="linkedin"
                                            rounded="full"
                                        />
                                    </Link>
                                    <Link href="https://mail.google.com/mail/u/0/?fs=1&to=taufikhdyt0106@gmail.com&su=Your%20Subject&body=Your%20Messages&tf=cm">
                                        <IconButton
                                            aria-label="Email"
                                            icon={<FaEnvelope />}
                                            size="lg"
                                            colorScheme="red"
                                            rounded="full"
                                        />
                                    </Link>
                                </HStack>
                            </Stack>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default TentangKamiPage;