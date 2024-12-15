import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    setIsLoggedIn: (value: boolean) => void;
    setUser: (user: User | null) => void;
    updateUser: (data: Partial<User>) => void;
    redirectBasedOnRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const updateUser = (data: Partial<User>) => {
        setUser(prevUser => {
            if (!prevUser) return null;

            const updatedUser = { ...prevUser, ...data };
            // Update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));

            return updatedUser;
        });
    };

    const redirectBasedOnRole = () => {
        if (!user) return;

        if (user.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const authenticated = isAuthenticated();
            setIsLoggedIn(authenticated);
            if (authenticated) {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    if (router.pathname === '/login') {
                        if (parsedUser.role === 'admin') {
                            router.push('/admin');
                        } else {
                            router.push('/');
                        }
                    }

                    if (router.pathname.startsWith('/admin') && parsedUser.role !== 'admin') {
                        router.push('/');
                    }
                }
            } else {
                if (router.pathname.startsWith('/admin')) {
                    router.push('/login');
                }
            }
        };
        checkAuth();
    }, [router.pathname]);

    const contextValue = {
        isLoggedIn,
        user,
        setIsLoggedIn,
        setUser,
        updateUser,
        redirectBasedOnRole
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};