import SEO from '@/components/SEO';
import {
    Box,
    Container,
    Heading,
    Text,
    Button,
    VStack,
    useColorModeValue,
    Icon,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const Custom404: NextPage = () => {
    const router = useRouter();
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    return (
        <>
            <SEO title="Halaman Tidak Ditemukan" />
            <Box
                minH="calc(100vh - 60px)"
                display="flex"
                alignItems="center"
                bg={bgColor}
            >
                <Container maxW="xl" py={20}>
                    <VStack spacing={8} align="center" textAlign="center">
                        {/* Icon */}
                        <Icon
                            as={FaExclamationTriangle}
                            w={20}
                            h={20}
                            color="brand.500"
                        />

                        {/* Status Code */}
                        <Heading
                            size="4xl"
                            bgGradient="linear(to-r, brand.500, brand.300)"
                            bgClip="text"
                            fontWeight="bold"
                        >
                            404
                        </Heading>

                        {/* Messages */}
                        <VStack spacing={3}>
                            <Heading size="xl">
                                Halaman Tidak Ditemukan
                            </Heading>
                            <Text
                                fontSize="lg"
                                color={useColorModeValue('gray.600', 'gray.400')}
                            >
                                Maaf, halaman yang Anda cari tidak dapat ditemukan.
                            </Text>
                        </VStack>

                        {/* Action Button */}
                        <Button
                            leftIcon={<FaHome />}
                            colorScheme="brand"
                            size="lg"
                            onClick={() => router.push('/')}
                            mt={4}
                        >
                            Kembali ke Beranda
                        </Button>
                    </VStack>
                </Container>
            </Box>
        </>
    );
};

export default Custom404;