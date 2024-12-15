import { User } from '../contexts/AuthContext';

export interface AuthHookReturn {
    login: (email: string, password: string) => Promise<void>;
    register: (userData: {
        username: string;
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        avatar?: File;
    }) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    redirectBasedOnRole: (role: string) => void;
    user: User | null;
    isLoggedIn: boolean;
}