import React from 'react';
import {
    Box,
    VStack,
    Text,
    Icon,
    Link,
    useColorModeValue,
    IconButton,
    Flex,
    useColorMode,
    Divider,
    Image,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FiUsers, FiHome, FiAward, FiLogOut, FiArrowLeft } from 'react-icons/fi';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAuth } from '@/hooks/useAuth';

interface SidebarItemProps {
    icon: any;
    children: React.ReactNode;
    href: string;
    isActive?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, children, href, isActive, onClick }) => {
    const activeBg = useColorModeValue('gray.100', 'gray.700');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    if (onClick) {
        return (
            <Box
                display="flex"
                alignItems="center"
                p={3}
                borderRadius="md"
                bg={isActive ? activeBg : 'transparent'}
                _hover={{ bg: hoverBg }}
                cursor="pointer"
                onClick={onClick}
            >
                <Icon as={icon} mr={3} />
                <Text fontWeight={isActive ? "bold" : "normal"}>{children}</Text>
            </Box>
        );
    }

    return (
        <Link
            as={NextLink}
            href={href}
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            width="full"
        >
            <Box
                display="flex"
                alignItems="center"
                p={3}
                borderRadius="md"
                bg={isActive ? activeBg : 'transparent'}
                _hover={{ bg: hoverBg }}
                cursor="pointer"
            >
                <Icon as={icon} mr={3} />
                <Text fontWeight={isActive ? "bold" : "normal"}>{children}</Text>
            </Box>
        </Link>
    );
};

const AdminSidebar = () => {
    const router = useRouter();
    const { logout } = useAuth();
    const { colorMode, toggleColorMode } = useColorMode();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.400');

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <Box
            w="250px"
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            h="100vh"
            position="fixed"
            top={0}
            left={0}
            overflowY="auto"
        >
            {/* Header Area */}
            <Flex
                p={4}
                borderBottom="1px"
                borderColor={borderColor}
                justify="space-between"
                align="center"
                height="60px" // Sesuaikan dengan tinggi navbar utama
            >
                <Box flex="1">
                    <NextLink href="/admin" passHref>
                        <Image
                            src="/logo.png"
                            alt="e-block logo"
                            height="40px"
                            width="auto"
                            objectFit="contain"
                            cursor="pointer"
                        />
                    </NextLink>
                </Box>
                <IconButton
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    aria-label="Toggle color mode"
                    variant="ghost"
                    size="sm"
                />
            </Flex>

            {/* Menu Items */}
            <VStack spacing={1} align="stretch" p={4}>
                {/* Kembali ke Halaman Utama */}
                <SidebarItem
                    icon={FiArrowLeft}
                    href="/"
                >
                    Kembali ke Beranda
                </SidebarItem>

                <Divider my={2} borderColor={borderColor} />

                <Text
                    px={3}
                    py={2}
                    fontSize="sm"
                    fontWeight="medium"
                    color={mutedTextColor}
                >
                    MENU ADMIN
                </Text>

                <SidebarItem
                    icon={FiHome}
                    href="/admin"
                    isActive={router.pathname === '/admin'}
                >
                    Dashboard
                </SidebarItem>
                <SidebarItem
                    icon={FiUsers}
                    href="/admin/users"
                    isActive={router.pathname === '/admin/users'}
                >
                    Daftar User
                </SidebarItem>
                <SidebarItem
                    icon={FiAward}
                    href="/admin/tantangan"
                    isActive={router.pathname === '/admin/tantangan'}
                >
                    Daftar Tantangan
                </SidebarItem>
            </VStack>

            {/* Logout Button at Bottom */}
            <Box position="absolute" bottom={0} width="100%" p={4}>
                <SidebarItem
                    icon={FiLogOut}
                    href="#"
                    onClick={handleLogout}
                >
                    Logout
                </SidebarItem>
            </Box>
        </Box>
    );
};

export default AdminSidebar;