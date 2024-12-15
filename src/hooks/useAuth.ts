import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import * as authUtils from '../utils/auth';
import * as api from '../services/api';
import { useAuthContext, User } from '../contexts/AuthContext';

interface RegisterData {
    username: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    avatar?: File;
}

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const { setIsLoggedIn, setUser, isLoggedIn, user } = useAuthContext();

    useEffect(() => {
        const token = authUtils.getToken();
        if (token) {
            setIsLoggedIn(true);
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUser(user);
                if (router.pathname === '/login') {
                    redirectBasedOnRole(user.role);
                }
            }
        }
    }, [setIsLoggedIn, setUser, router.pathname]);

    const redirectBasedOnRole = (role: string) => {
        if (role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/');
        }
    };

    const handleAuthSuccess = (user: User, token: string) => {
        authUtils.setToken(token);
        setUser(user);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(user));
        redirectBasedOnRole(user.role);
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.login({ email, password });
            const { user, access_token } = response.data;
            handleAuthSuccess(user, access_token.token);
            toast({
                title: 'Login berhasil',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: 'Login gagal',
                description: error.message || 'Terjadi kesalahan saat login',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterData) => {
        setIsLoading(true);
        try {
            // Tambahkan role secara default saat memanggil API register
            const response = await api.register({
                ...userData,
                role: 'user' // Set default role
            });
            
            const { user, access_token } = response.data;
            handleAuthSuccess(user, access_token.token);
            toast({
                title: 'Registrasi berhasil',
                description: 'Anda telah berhasil terdaftar dan masuk.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error: any) {
            let errorMessage = 'Terjadi kesalahan saat registrasi';
            
            // Handle validation errors
            if (error.validationErrors) {
                const firstError = Object.values(error.validationErrors)[0];
                if (Array.isArray(firstError) && firstError.length > 0) {
                    errorMessage = firstError[0];
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast({
                title: 'Registrasi gagal',
                description: errorMessage,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authUtils.removeToken();
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
        router.push('/login');
    };

    return {
        login,
        register,
        logout,
        isLoading,
        redirectBasedOnRole,
        user,
        isLoggedIn
    };
}