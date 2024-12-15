import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    VStack,
    Text,
    Link as ChakraLink,
    Avatar,
    FormErrorMessage,
    useToast,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    Icon,
    Divider,
    Center,
    HStack,
    InputRightElement,
    IconButton,
    Tooltip,
} from '@chakra-ui/react';
import { FaUser, FaEnvelope, FaLock, FaUserCircle, FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { register } from '../services/api';
import { setToken } from '../utils/auth';
import { useRouter } from 'next/router';
import { useAuthContext } from '../contexts/AuthContext';
import SEO from '@/components/SEO';

interface ValidationErrors {
    [key: string]: string[];
}

interface ValidationErrorResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        [key: string]: string[];
    };
}

const RegisterPage: NextPage = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const router = useRouter();
    const { setIsLoggedIn, setUser } = useAuthContext();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const response = await register({
                username,
                name,
                email,
                password,
                password_confirmation: confirmPassword,
                avatar: avatar || undefined,
                role: 'user'
            });

            if (response.data.access_token) {
                // Simpan token
                const token = response.data.access_token.token;
                setToken(token);

                // Simpan data user di localStorage dan context
                const userData = response.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                // Update status login
                setIsLoggedIn(true);

                toast({
                    title: 'Registrasi berhasil',
                    description: 'Selamat datang di e-block!',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });

                // Redirect berdasarkan role
                if (userData.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            }
        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.data) {
                setErrors(error.data);

                // Mapping pesan error ke bahasa Indonesia yang lebih jelas
                const errorMessages: string[] = [];

                if (error.data.username) {
                    const usernameError = error.data.username[0];
                    if (usernameError.includes('already been taken')) {
                        errorMessages.push('Username sudah digunakan, silakan pilih username lain');
                    }
                }

                if (error.data.email) {
                    const emailError = error.data.email[0];
                    if (emailError.includes('already been taken')) {
                        errorMessages.push('Email sudah terdaftar, silakan gunakan email lain');
                    }
                }

                if (error.data.password) {
                    error.data.password.forEach((passError: string) => {
                        if (passError.includes('confirmation does not match')) {
                            errorMessages.push('Konfirmasi kata sandi tidak sesuai');
                        }
                        if (passError.includes('at least 8 characters')) {
                            errorMessages.push('Kata sandi minimal 8 karakter');
                        }
                    });
                }

                // Tampilkan semua pesan error dalam satu toast
                if (errorMessages.length > 0) {
                    toast({
                        title: 'Registrasi gagal',
                        description: (
                            <VStack align="start" spacing={1}>
                                {errorMessages.map((msg, idx) => (
                                    <Text key={idx}>• {msg}</Text>
                                ))}
                            </VStack>
                        ),
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    // Fallback untuk error yang tidak ter-handle
                    toast({
                        title: 'Registrasi gagal',
                        description: 'Terjadi kesalahan validasi. Silakan periksa kembali data Anda.',
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } else {
                // Handle general error
                toast({
                    title: 'Registrasi gagal',
                    description: 'Terjadi kesalahan saat memproses registrasi. Silakan coba lagi.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 2 * 1024 * 1024; // 2MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

            // Reset error
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.avatar;
                return newErrors;
            });

            // Validasi ukuran file
            if (file.size > maxSize) {
                setErrors(prev => ({
                    ...prev,
                    avatar: ['Ukuran file tidak boleh lebih dari 2MB']
                }));
                toast({
                    title: "Ukuran file terlalu besar",
                    description: "Maksimal ukuran file adalah 2MB",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            // Validasi tipe file
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    avatar: ['Format file harus JPG, JPEG, PNG, atau GIF']
                }));
                toast({
                    title: "Format file tidak didukung",
                    description: "Gunakan format JPG, JPEG, PNG, atau GIF",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            // Jika validasi berhasil
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                toast({
                    title: "Foto berhasil diunggah",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const translateErrorMessage = (message: string) => {
        const errorTranslations: { [key: string]: string } = {
            // Password confirmations
            "The password field confirmation does not match.": "Konfirmasi kata sandi tidak sesuai",
            "The confirm password field is required.": "Konfirmasi kata sandi harus diisi",
            // Password requirements
            "The password field must be at least 8 characters.": "Kata sandi minimal 8 karakter",
            // Username errors
            "The username has already been taken.": "Username sudah digunakan",
            "The username field is required.": "Username harus diisi",
            // Email errors
            "The email has already been taken.": "Email sudah terdaftar",
            "The email field is required.": "Email harus diisi",
            "The email must be a valid email address.": "Format email tidak valid",
            // Name errors
            "The name field is required.": "Nama harus diisi",
        };

        return errorTranslations[message] || message;
    };

    return (
        <>
            <SEO title="Daftar" />
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
                        <VStack spacing={8}>
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
                                <Heading size="lg">Buat Akun Baru</Heading>
                                <Text color={useColorModeValue('gray.600', 'gray.400')} textAlign="center">
                                    Bergabung dengan e-block untuk memulai pembelajaran pemrograman
                                </Text>
                            </VStack>

                            <Box as="form" onSubmit={handleSubmit} width="100%">
                                <VStack spacing={4}>
                                    <Center>
                                        <Tooltip label="Klik untuk mengganti avatar" placement="top">
                                            <Box position="relative" cursor="pointer" onClick={() => fileInputRef.current?.click()}>
                                                <Avatar
                                                    size="2xl"
                                                    src={avatarPreview || undefined}
                                                    bg="brand.500"
                                                />
                                                <Center
                                                    position="absolute"
                                                    bottom={0}
                                                    right={0}
                                                    bg="brand.500"
                                                    w={8}
                                                    h={8}
                                                    borderRadius="full"
                                                    boxShadow="base"
                                                >
                                                    <Icon as={FaCamera} color="white" />
                                                </Center>
                                            </Box>
                                        </Tooltip>
                                    </Center>

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={handleAvatarChange}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />

                                    <FormControl isRequired isInvalid={!!errors.username}>
                                        <FormLabel>Username</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement width="auto" pl={3} pr={1}>
                                                <Text color="gray.500">@</Text>
                                            </InputLeftElement>
                                            <Input
                                                value={username}
                                                onChange={(e) => {
                                                    const formattedUsername = e.target.value.replace(/\s+/g, '').toLowerCase();
                                                    setUsername(formattedUsername);
                                                }}
                                                placeholder="Masukkan username"
                                                pl={8}
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>
                                            {errors.username?.map(error => translateErrorMessage(error))}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.name}>
                                        <FormLabel>Nama Lengkap</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement>
                                                <Icon as={FaUserCircle} color="gray.500" />
                                            </InputLeftElement>
                                            <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Masukkan nama lengkap"
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>
                                            {errors.name?.map(error => translateErrorMessage(error))}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.email}>
                                        <FormLabel>Email</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement>
                                                <Icon as={FaEnvelope} color="gray.500" />
                                            </InputLeftElement>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                                placeholder="Masukkan email"
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>
                                            {errors.email?.map(error => translateErrorMessage(error))}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.password}>
                                        <FormLabel>Kata Sandi</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement>
                                                <Icon as={FaLock} color="gray.500" />
                                            </InputLeftElement>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Masukkan kata sandi"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    onClick={() => setShowPassword(!showPassword)}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>
                                            <VStack align="start" spacing={1} w="full">
                                                {errors.password?.map((error, index) => (
                                                    <Text key={index}>
                                                        • {translateErrorMessage(error)}
                                                    </Text>
                                                ))}
                                            </VStack>
                                        </FormErrorMessage>
                                        <Text fontSize="sm" color="gray.500" mt={1}>
                                            Minimal 8 karakter
                                        </Text>
                                    </FormControl>

                                    <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                                        <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement>
                                                <Icon as={FaLock} color="gray.500" />
                                            </InputLeftElement>
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Konfirmasi kata sandi"
                                            />
                                            <InputRightElement>
                                                <IconButton
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage>
                                            {errors.confirmPassword?.map(error => translateErrorMessage(error))}
                                        </FormErrorMessage>
                                        <Text fontSize="sm" color="gray.500" mt={1}>
                                            Minimal 8 karakter
                                        </Text>
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
                                        Daftar
                                    </Button>
                                </VStack>
                            </Box>

                            <VStack spacing={4} pt={2}>
                                <Divider />
                                <Text>
                                    Sudah punya akun?{' '}
                                    <Link href="/login" passHref>
                                        <ChakraLink color="brand.500" fontWeight="semibold">
                                            Masuk di sini
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

export default RegisterPage;