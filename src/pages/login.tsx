import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Heading,
    Input,
    VStack,
    Text,
    Link as ChakraLink,
    useToast,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    Icon,
    Divider,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { login } from '../services/api';
import { setToken } from '../utils/auth';
import { useAuthContext } from '../contexts/AuthContext';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import SEO from '@/components/SEO';

interface ValidationErrors {
    [key: string]: string[];
}

const LoginPage: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const router = useRouter();
    const toast = useToast();
    const { setIsLoggedIn, setUser, isLoggedIn, user } = useAuthContext();

    const translateErrorMessage = (message: string) => {
        const errorTranslations: { [key: string]: string } = {
            "These credentials do not match our records.": "Email atau kata sandi yang Anda masukkan salah",
            "The email field is required.": "Email harus diisi",
            "The password field is required.": "Kata sandi harus diisi",
            "The email must be a valid email address.": "Format email tidak valid",
            // Tambahkan terjemahan lain jika diperlukan
        };

        return errorTranslations[message] || message;
    };

    useEffect(() => {
        if (isLoggedIn && user) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        }
    }, [isLoggedIn, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi di frontend
        const trimmedEmail = email.trim();
        if (!trimmedEmail || !password) {
            const newErrors: ValidationErrors = {};
            if (!trimmedEmail) newErrors.email = ['Email wajib diisi'];
            if (!password) newErrors.password = ['Password wajib diisi'];
            setErrors(newErrors);

            toast({
                title: 'Validasi gagal',
                description: 'Mohon isi semua field yang wajib',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await login({
                email: trimmedEmail,
                password
            });

            if (response.data.access_token) {
                const token = response.data.access_token.token;
                setToken(token);

                const userData = response.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsLoggedIn(true);

                toast({
                    title: 'Login berhasil',
                    description: 'Selamat datang kembali!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                if (userData.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            }
        } catch (error: any) {
            console.error('Login error details:', error);

            setIsLoading(false);

            if (error.data) {
                setErrors(error.data);

                const translatedErrors = Object.values(error.data)
                    .flat()
                    .map(err => translateErrorMessage(err as string));

                toast({
                    title: 'Login Gagal',
                    description: (
                        <VStack align="start" spacing={1}>
                            {translatedErrors.map((msg, idx) => (
                                <Text key={idx}>{msg}</Text>
                            ))}
                        </VStack>
                    ),
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Login Gagal',
                    description: 'Terjadi kesalahan saat proses login. Silakan coba lagi.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
            return;
        }
        setIsLoading(false);
    };

    // Jika sudah login, tampilkan loading
    if (isLoggedIn && user) {
        return (
            <Container maxW="container.sm" py={10}>
                <VStack spacing={8}>
                    <Heading>Mengalihkan...</Heading>
                </VStack>
            </Container>
        );
    }

    return (
        <>
            <SEO title="Masuk" />
            <Box
                minH="calc(100vh - 60px)"
                display="flex"
                alignItems="center"
                bg={useColorModeValue('gray.50', 'gray.900')}
            >
                <Container maxW="lg" py={12}>
                    <Box
                        bg={useColorModeValue('white', 'gray.800')}
                        p={8}
                        borderRadius="xl"
                        boxShadow="lg"
                        border="1px solid"
                        borderColor={useColorModeValue('gray.200', 'gray.700')}
                    >
                        <VStack spacing={8} align="stretch">
                            <VStack spacing={3}>
                                <Box position="relative" width="200px" height="60px">
                                    <Image
                                        src="/logo.png"
                                        alt="e-block logo"
                                        layout="fill"
                                        objectFit="contain"
                                        priority
                                    />
                                </Box>
                                <Heading size="lg" textAlign="center">
                                    Selamat Datang Kembali
                                </Heading>
                                <Text color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
                                    Masuk untuk melanjutkan pembelajaran Anda
                                </Text>
                            </VStack>

                            <Box as="form" onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement>
                                                <Icon as={FaEnvelope} color="gray.500" />
                                            </InputLeftElement>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                                placeholder="Masukkan email Anda"
                                            />
                                        </InputGroup>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Kata Sandi</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement>
                                                <Icon as={FaLock} color="gray.500" />
                                            </InputLeftElement>
                                            <Input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Masukkan kata sandi"
                                            />
                                        </InputGroup>
                                        <Box textAlign="right" mt={1}>
                                            <Link href="/forgot-password" passHref>
                                                <ChakraLink color="brand.500" fontSize="sm">
                                                    Lupa kata sandi?
                                                </ChakraLink>
                                            </Link>
                                        </Box>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        colorScheme="brand"
                                        width="100%"
                                        size="lg"
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                        loadingText="Memproses..."
                                    >
                                        Masuk
                                    </Button>
                                </VStack>
                            </Box>

                            <VStack spacing={4} pt={2}>
                                <Divider />
                                <Text>
                                    Belum punya akun?{' '}
                                    <Link href="/register" passHref>
                                        <ChakraLink color="brand.500" fontWeight="semibold">
                                            Daftar di sini
                                        </ChakraLink>
                                    </Link>
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default LoginPage;