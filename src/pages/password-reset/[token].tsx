import React, { useState, useEffect } from 'react';
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
    useToast,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Icon,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import SEO from '@/components/SEO';
import { resetPassword } from '@/services/api';

interface ValidationErrors {
    [key: string]: string[];
}

const PasswordResetPage: NextPage = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const router = useRouter();
    const toast = useToast();
    const { token, email } = router.query;

    // Password validation rules
    const validatePassword = () => {
        const newErrors: ValidationErrors = {};

        if (password.length < 8) {
            newErrors.password = ['Password minimal 8 karakter'];
        }

        if (password !== passwordConfirmation) {
            newErrors.password_confirmation = ['Konfirmasi password tidak cocok'];
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        const validationErrors = validatePassword();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast({
                title: 'Validasi gagal',
                description: 'Mohon periksa kembali form Anda',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!token || !email || Array.isArray(token) || Array.isArray(email)) {
            toast({
                title: 'Error',
                description: 'Token atau email tidak valid',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await resetPassword({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            setIsSuccess(true);
            toast({
                title: 'Password berhasil diubah',
                description: 'Silakan login dengan password baru Anda',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            // Redirect ke halaman login setelah 3 detik
            setTimeout(() => {
                router.push('/login');
            }, 3000);

        } catch (error: any) {
            console.error('Reset password error:', error);

            if (error.data && typeof error.data === 'object') {
                setErrors(error.data);
            }

            toast({
                title: 'Gagal mengubah password',
                description: error.message || 'Terjadi kesalahan saat mengubah password',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Redirect if no token or email in URL
    useEffect(() => {
        if (router.isReady && (!token || !email)) {
            router.push('/login');
        }
    }, [router.isReady, token, email, router]);

    return (
        <>
            <SEO title="Reset Password" />
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
                                <Heading size="lg" textAlign="center">
                                    Reset Password
                                </Heading>
                                <Text
                                    color={useColorModeValue('gray.600', 'gray.400')}
                                    textAlign="center"
                                >
                                    Masukkan password baru Anda
                                </Text>
                            </VStack>

                            {isSuccess ? (
                                <Alert
                                    status="success"
                                    variant="subtle"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    textAlign="center"
                                    borderRadius="lg"
                                    py={6}
                                >
                                    <AlertIcon boxSize="40px" mr={0} mb={4} />
                                    <Text>
                                        Password berhasil diubah. Anda akan dialihkan ke halaman login...
                                    </Text>
                                </Alert>
                            ) : (
                                <Box as="form" onSubmit={handleSubmit}>
                                    <VStack spacing={6}>
                                        <FormControl isRequired isInvalid={!!errors.password}>
                                            <FormLabel>Password Baru</FormLabel>
                                            <InputGroup>
                                                <InputLeftElement>
                                                    <Icon as={FaLock} color="gray.500" />
                                                </InputLeftElement>
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Masukkan password baru"
                                                />
                                                <InputRightElement>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        <Icon
                                                            as={showPassword ? FaEyeSlash : FaEye}
                                                            color="gray.500"
                                                        />
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            {errors.password && (
                                                <Text color="red.500" fontSize="sm" mt={1}>
                                                    {errors.password[0]}
                                                </Text>
                                            )}
                                        </FormControl>

                                        <FormControl
                                            isRequired
                                            isInvalid={!!errors.password_confirmation}
                                        >
                                            <FormLabel>Konfirmasi Password Baru</FormLabel>
                                            <InputGroup>
                                                <InputLeftElement>
                                                    <Icon as={FaLock} color="gray.500" />
                                                </InputLeftElement>
                                                <Input
                                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                                    value={passwordConfirmation}
                                                    onChange={(e) =>
                                                        setPasswordConfirmation(e.target.value)
                                                    }
                                                    placeholder="Konfirmasi password baru"
                                                />
                                                <InputRightElement>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            setShowPasswordConfirmation(
                                                                !showPasswordConfirmation
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            as={
                                                                showPasswordConfirmation
                                                                    ? FaEyeSlash
                                                                    : FaEye
                                                            }
                                                            color="gray.500"
                                                        />
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            {errors.password_confirmation && (
                                                <Text color="red.500" fontSize="sm" mt={1}>
                                                    {errors.password_confirmation[0]}
                                                </Text>
                                            )}
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            colorScheme="brand"
                                            width="100%"
                                            size="lg"
                                            isLoading={isLoading}
                                            loadingText="Menyimpan..."
                                        >
                                            Reset Password
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            width="100%"
                                            onClick={() => router.push('/login')}
                                        >
                                            Kembali ke Halaman Login
                                        </Button>
                                    </VStack>
                                </Box>
                            )}
                        </VStack>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default PasswordResetPage;