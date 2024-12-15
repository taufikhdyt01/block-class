import React, { ReactNode } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    return (
        <Box minH="100vh" bg={bgColor}>
            <AdminSidebar />
            <Box
                ml="250px"
                minH="100vh"
                p={8}
            >
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;