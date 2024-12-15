import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/AuthContext';

export function withAdminAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function AdminProtectedRoute(props: P) {
        const { isLoggedIn, user } = useAuthContext();
        const router = useRouter();

        useEffect(() => {
            if (!isLoggedIn) {
                router.replace('/login');
            } else if (user?.role !== 'admin') {
                router.replace('/');
            }
        }, [isLoggedIn, user]);

        if (!isLoggedIn || user?.role !== 'admin') {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}