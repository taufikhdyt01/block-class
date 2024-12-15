import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Avatar,
    Badge,
    Spinner,
    useToast,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import AdminLayout from '@/components/AdminLayout';
import { AdminUser, getAdminUsers } from '@/services/api';
import { withAdminAuth } from '@/components/withAdminAuth';
import SEO from '@/components/SEO';

const AdminUsersPage: NextPage = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await getAdminUsers();
                if (response.success) {
                    setUsers(response.data);
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                setError('Gagal memuat daftar user. Silakan coba lagi nanti.');
                toast({
                    title: 'Error',
                    description: 'Gagal memuat daftar user',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [toast]);

    if (isLoading) {
        return (
            <AdminLayout>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Spinner size="xl" />
                </Box>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <Text color="red.500">{error}</Text>
            </AdminLayout>
        );
    }

    return (
        <>
            <SEO title="Daftar User" />
            <AdminLayout>
                <Box>
                    <Heading size="lg" mb={6}>Daftar User</Heading>
                    <Box
                        bg={useColorModeValue('white', 'gray.800')}
                        rounded="lg"
                        shadow="base"
                        overflow="hidden"
                    >
                        <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Avatar</Th>
                                        <Th>Nama</Th>
                                        <Th>Username</Th>
                                        <Th>Email</Th>
                                        <Th>Role</Th>
                                        <Th>Tanggal Pendaftaran</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.map((user) => (
                                        <Tr key={user.id}>
                                            <Td>{user.id}</Td>
                                            <Td>
                                                <Avatar size="sm" name={user.name} src={user.avatar || undefined} />
                                            </Td>
                                            <Td>{user.name}</Td>
                                            <Td>{user.username}</Td>
                                            <Td>{user.email}</Td>
                                            <Td>
                                                <Badge
                                                    colorScheme={user.role === 'admin' ? 'red' : 'blue'}
                                                    textTransform="capitalize"
                                                >
                                                    {user.role}
                                                </Badge>
                                            </Td>
                                            <Td>{new Date(user.created_at).toLocaleString('id-ID')}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>
                </Box>
            </AdminLayout>
        </>
    );
};

export default withAdminAuth(AdminUsersPage);