import React from 'react';
import {
    Box,
    Flex,
    Text,
    Stack,
    useColorModeValue,
    useDisclosure,
    IconButton,
    Button,
    useColorMode,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    HStack,
    Image,
    Tooltip,
    Collapse,
    VStack,
    useBreakpointValue,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    MoonIcon,
    SunIcon,
    ChevronDownIcon
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';
import ClientOnly from './ClientOnly';
import {
    FaHome,
    FaGraduationCap,
    FaCode,
    FaTrophy,
    FaMedal,
    FaUserCircle,
    FaSignOutAlt,
    FaUserCog,
} from 'react-icons/fa';

// NavItem Component with icon
const NavItem = ({
    children,
    href,
    icon: Icon,
    isMobile = false
}: {
    children: React.ReactNode;
    href: string;
    icon: React.ElementType;
    isMobile?: boolean;
}) => {
    const router = useRouter();
    const isActive = router.pathname === href;
    const [isHovered, setIsHovered] = React.useState(false);

    const iconColor = isActive
        ? 'var(--chakra-colors-brand-500)'
        : isHovered
            ? 'var(--chakra-colors-brand-500)'
            : useColorModeValue('var(--chakra-colors-gray-600)', 'var(--chakra-colors-gray-400)');

    return (
        <Button
            variant="ghost"
            fontWeight={isActive ? "semibold" : "normal"}
            color={isActive ? 'brand.500' : useColorModeValue('gray.700', 'gray.300')}
            onClick={() => router.push(href)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            leftIcon={
                <Icon
                    style={{
                        fontSize: '1.2em',
                        color: iconColor,
                        transition: 'color 0.2s',
                    }}
                />
            }
            size="md"
            px={4}
            width={isMobile ? "full" : "auto"}
            justifyContent={isMobile ? "flex-start" : "center"}
            bg={isActive ? useColorModeValue('brand.50', 'rgba(0, 115, 230, 0.1)') : 'transparent'}
            _hover={{
                bg: useColorModeValue('brand.50', 'rgba(0, 115, 230, 0.1)'),
                color: 'brand.500',
            }}
            _active={{
                bg: useColorModeValue('brand.100', 'rgba(0, 115, 230, 0.2)'),
            }}
            transition="all 0.2s"
        >
            {children}
        </Button>
    );
};

interface MobileNavProps {
    isOpen: boolean;
    onToggle: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen }) => {
    const { isLoggedIn, user } = useAuthContext();
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <Collapse in={isOpen} animateOpacity>
            <Box
                pb={4}
                px={4}
                bg={useColorModeValue('white', 'gray.800')}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                shadow="md"
            >
                <VStack spacing={2} align="stretch">
                    <NavItem href="/" icon={FaHome} isMobile>Beranda</NavItem>
                    <NavItem href="/kelas" icon={FaGraduationCap} isMobile>Kelas</NavItem>
                    <NavItem href="/simulasi" icon={FaCode} isMobile>Simulasi</NavItem>
                    <NavItem href="/tantangan" icon={FaTrophy} isMobile>Tantangan</NavItem>
                    <NavItem href="/papan-peringkat" icon={FaMedal} isMobile>Papan Peringkat</NavItem>

                    {!isLoggedIn && (
                        <>
                            <Button
                                width="full"
                                variant="ghost"
                                onClick={() => router.push('/login')}
                                color={useColorModeValue('gray.700', 'gray.300')}
                                _hover={{
                                    bg: useColorModeValue('brand.50', 'rgba(0, 115, 230, 0.1)'),
                                }}
                            >
                                Masuk
                            </Button>
                            <Button
                                width="full"
                                onClick={() => router.push('/register')}
                                bg="brand.500"
                                color="white"
                                _hover={{
                                    bg: 'brand.600',
                                }}
                            >
                                Daftar
                            </Button>
                        </>
                    )}
                </VStack>
            </Box>
        </Collapse>
    );
};

const NavbarContent = () => {
    const { isOpen, onToggle, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const { logout } = useAuth();
    const { isLoggedIn, user } = useAuthContext();
    const router = useRouter();

    // Detect screen size changes
    const isMobile = useBreakpointValue({ base: true, md: false });

    // Close mobile menu when screen size changes to desktop
    React.useEffect(() => {
        if (!isMobile && isOpen) {
            onClose();
        }
    }, [isMobile, isOpen, onClose]);

    const handleLogout = () => {
        logout();
    };

    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            zIndex={1000}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow="sm"
        >
            <Flex
                maxW="8xl"
                mx="auto"
                color={useColorModeValue('gray.700', 'gray.300')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                align={'center'}
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                        zIndex={2}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Box cursor="pointer" onClick={() => router.push('/')} zIndex={2}>
                        <Image
                            src="/logo.png"
                            alt="e-block logo"
                            height="40px"
                            width="auto"
                            objectFit="contain"
                        />
                    </Box>

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <Stack direction={'row'} spacing={1}>
                            <NavItem href="/" icon={FaHome}>Beranda</NavItem>
                            <NavItem href="/kelas" icon={FaGraduationCap}>Kelas</NavItem>
                            <NavItem href="/simulasi" icon={FaCode}>Simulasi</NavItem>
                            <NavItem href="/tantangan" icon={FaTrophy}>Tantangan</NavItem>
                            <NavItem href="/papan-peringkat" icon={FaMedal}>Papan Peringkat</NavItem>
                        </Stack>
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}
                    align={'center'}
                >
                    <Tooltip
                        label={colorMode === 'light' ? 'Aktifkan Mode Gelap' : 'Aktifkan Mode Terang'}
                        placement="bottom"
                        hasArrow
                        openDelay={300}
                        bg={useColorModeValue('gray.700', 'gray.200')}
                        color={useColorModeValue('white', 'gray.800')}
                    >
                        <IconButton
                            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            onClick={toggleColorMode}
                            aria-label={colorMode === 'light' ? 'Aktifkan Dark Mode' : 'Aktifkan Light Mode'}
                            variant="ghost"
                            color={useColorModeValue('gray.700', 'gray.300')}
                            _hover={{
                                bg: useColorModeValue('brand.50', 'rgba(0, 115, 230, 0.1)'),
                                color: 'brand.500',
                                transform: 'scale(1.1)',
                            }}
                            _active={{
                                bg: useColorModeValue('brand.100', 'rgba(0, 115, 230, 0.2)'),
                                transform: 'scale(0.98)',
                            }}
                            transition="all 0.2s"
                            fontSize="xl"
                            size="md"
                            p={2}
                        />
                    </Tooltip>
                    {isLoggedIn && user ? (
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                <HStack spacing={3}>
                                    <Box display={{ base: 'none', md: 'block' }} textAlign="right">
                                        <Text fontSize="sm" fontWeight="bold">{user.name}</Text>
                                        <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                                            {user.email}
                                        </Text>
                                    </Box>
                                    <Avatar
                                        size={'sm'}
                                        src={user.avatar}
                                        name={user.name}
                                    />
                                    <ChevronDownIcon />
                                </HStack>
                            </MenuButton>
                            <MenuList>
                                {user.role === 'admin' && (
                                    <>
                                        <MenuItem
                                            onClick={() => router.push('/admin')}
                                            color="brand.500"
                                            fontWeight="bold"
                                            icon={<FaUserCog style={{ fontSize: '1.2em' }} />}
                                        >
                                            Dashboard Admin
                                        </MenuItem>
                                        <MenuDivider />
                                    </>
                                )}
                                <MenuItem
                                    onClick={() => router.push('/profil')}
                                    icon={<FaUserCircle style={{ fontSize: '1.2em' }} />}
                                >
                                    Profil
                                </MenuItem>
                                <MenuItem
                                    onClick={handleLogout}
                                    icon={<FaSignOutAlt style={{ fontSize: '1.2em' }} />}
                                    color={useColorModeValue('red.600', 'red.300')}
                                >
                                    Keluar
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    ) : (
                        <Stack
                            direction={'row'}
                            spacing={6}
                            display={{ base: 'none', md: 'flex' }}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/login')}
                                color={useColorModeValue('gray.700', 'gray.300')}
                                _hover={{
                                    bg: useColorModeValue('brand.50', 'rgba(0, 115, 230, 0.1)'),
                                }}
                            >
                                Masuk
                            </Button>
                            <Button
                                onClick={() => router.push('/register')}
                                bg="brand.500"
                                color="white"
                                _hover={{
                                    bg: 'brand.600',
                                }}
                            >
                                Daftar
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Flex>

            {/* Mobile Navigation Menu */}
            <MobileNav isOpen={isOpen} onToggle={onToggle} />
        </Box>
    );
};

const Navbar = () => {
    return (
        <>
            <ClientOnly fallback={
                <Box height="60px" width="100%" backgroundColor="transparent" />
            }>
                <NavbarContent />
            </ClientOnly>
            {/* Spacer to prevent content from going under navbar */}
            <Box height="60px" />
        </>
    );
};

export default Navbar;