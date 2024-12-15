import React, { useState } from 'react';
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
    Icon,
    Alert,
    AlertIcon,
    AlertDescription,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FaEnvelope } from 'react-icons/fa';
import SEO from '@/components/SEO';
import { forgotPassword } from '@/services/api';

interface ValidationErrors {
    [key: string]: string[];
}

const ForgotPasswordPage: NextPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const router = useRouter();
    const toast = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi email
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setErrors({ email: ['Email wajib diisi'] });
            toast({
                title: 'Validasi gagal',
                description: 'Mohon isi email Anda',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await forgotPassword({ email: trimmedEmail });

            setIsEmailSent(true);
            toast({
                title: 'Email terkirim',
                description: response.message,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error: any) {
            console.error('Forgot password error:', error);

            // Handle validation errors if any
            if (error.data && typeof error.data === 'object') {
                setErrors(error.data);
            }

            toast({
                title: 'Gagal mengirim email',
                description: error.message || 'Terjadi kesalahan saat mengirim email reset password',
                status: 'error',
                duration: 4000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push('/login');
    };

    return (
        <>
            <SEO title="Lupa Password" />
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
                                    Lupa Password?
                                </Heading>
                                <Text
                                    color={useColorModeValue('gray.600', 'gray.400')}
                                    textAlign="center"
                                >
                                    Masukkan email Anda untuk menerima instruksi reset password
                                </Text>
                            </VStack>

                            {isEmailSent ? (
                                <VStack spacing={6}>
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
                                        <AlertDescription maxWidth="sm">
                                            Email berisi instruksi reset password telah dikirim ke{' '}
                                            <strong>{email}</strong>. Silakan cek inbox atau folder spam
                                            Anda.
                                        </AlertDescription>
                                    </Alert>
                                    <Button
                                        colorScheme="brand"
                                        width="100%"
                                        onClick={handleBackToLogin}
                                    >
                                        Kembali ke Halaman Login
                                    </Button>
                                </VStack>
                            ) : (
                                <Box as="form" onSubmit={handleSubmit}>
                                    <VStack spacing={6}>
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
                                                    placeholder="Masukkan email Anda"
                                                />
                                            </InputGroup>
                                            {errors.email && (
                                                <Text color="red.500" fontSize="sm" mt={1}>
                                                    {errors.email[0]}
                                                </Text>
                                            )}
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            colorScheme="brand"
                                            width="100%"
                                            size="lg"
                                            isLoading={isLoading}
                                            loadingText="Mengirim..."
                                        >
                                            Kirim Instruksi Reset Password
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            width="100%"
                                            onClick={handleBackToLogin}
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

export default ForgotPasswordPage;