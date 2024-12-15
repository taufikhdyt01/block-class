import React, { useState } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Badge,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    useToast,
    useColorModeValue,
    useDisclosure,
    Icon,
    Tooltip,
    InputGroup,
    InputRightElement,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import {
    Lock,
    Award,
    ChevronRight,
    Timer,
    Play
} from 'lucide-react';
import { useRouter } from 'next/router';
import { Challenge, verifyAccessCode } from '@/services/api';

interface ChallengeCardProps {
    challenge: Challenge;
    onAccessGranted?: () => void;
    isAuthenticated: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
    challenge,
    onAccessGranted,
    isAuthenticated
}) => {
    const [accessCode, setAccessCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        isOpen: isAccessModalOpen,
        onOpen: onAccessModalOpen,
        onClose: onAccessModalClose
    } = useDisclosure();

    const {
        isOpen: isTimerModalOpen,
        onOpen: onTimerModalOpen,
        onClose: onTimerModalClose
    } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    // Chakra UI colors
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.200');
    const headingColor = useColorModeValue('brand.600', 'brand.300');
    const hoverBg = useColorModeValue('gray.50', 'gray.600');
    const difficultyConfig = {
        easy: { color: 'green', text: 'Mudah', icon: Award },
        medium: { color: 'yellow', text: 'Sedang', icon: Award },
        hard: { color: 'red', text: 'Sulit', icon: Award }
    };

    const config = difficultyConfig[challenge.difficulty as keyof typeof difficultyConfig] ||
        difficultyConfig.medium;

    const checkExistingTimer = () => {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) return false;

        const timerKey = `challenge_${challenge.slug}_${userId}_start`;
        const activeKey = `challenge_${challenge.slug}_${userId}_active`;

        const existingStart = localStorage.getItem(timerKey);
        const isActive = localStorage.getItem(activeKey);

        return existingStart && isActive === 'true';
    };

    const startTimer = () => {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        if (!userId) {
            console.error('User ID not found');
            return;
        }

        const now = Date.now();
        const timerKey = `challenge_${challenge.slug}_${userId}_start`;
        const activeKey = `challenge_${challenge.slug}_${userId}_active`;

        try {
            localStorage.setItem(timerKey, now.toString());
            localStorage.setItem(activeKey, 'true');
            router.push(`/tantangan/${challenge.slug}`);
        } catch (error) {
            console.error('Error starting timer:', error);
            toast({
                title: "Error",
                description: "Terjadi kesalahan saat memulai timer",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleStartChallenge = () => {
        if (!isAuthenticated) {
            toast({
                title: "Login Diperlukan",
                description: "Silakan login terlebih dahulu untuk mengakses tantangan",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            router.push('/login');
            return;
        }

        if (!challenge.is_accessible) {
            if (challenge.access_type === 'private') {
                onAccessModalOpen();
            } else {
                toast({
                    title: "Akses Ditolak",
                    description: challenge.access_type === 'sequential'
                        ? "Selesaikan tantangan sebelumnya terlebih dahulu"
                        : "Anda tidak memiliki akses ke tantangan ini",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
            return;
        }

        // Check if timer already exists
        if (checkExistingTimer()) {
            // If timer exists, directly navigate to challenge
            router.push(`/tantangan/${challenge.slug}`);
        } else {
            // If no timer exists, show confirmation modal
            onTimerModalOpen();
        }
    };

    const getButtonText = () => {
        if (!isAuthenticated) {
            return 'Login untuk Mulai';
        }
        if (challenge.is_accessible) {
            return 'Mulai Tantangan';
        }
        return challenge.access_type === 'sequential'
            ? 'Selesaikan Tantangan Sebelumnya'
            : 'Masukkan Kode Akses';
    };

    const handleVerifyAccess = async () => {
        if (!accessCode.trim()) {
            toast({
                title: "Error",
                description: "Kode akses tidak boleh kosong",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await verifyAccessCode(challenge.slug, accessCode);
            if (response.success) {
                toast({
                    title: "Berhasil",
                    description: "Kode akses valid. Anda sekarang dapat mengakses tantangan ini",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onAccessModalClose();
                if (onAccessGranted) {
                    onAccessGranted();
                }

                // Show timer confirmation modal instead of directly navigating
                onTimerModalOpen();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Kode akses tidak valid",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
            setAccessCode('');
        }
    };

    return (
        <Box
            bg={bgColor}
            rounded="xl"
            shadow="sm"
            borderWidth={1}
            borderColor={borderColor}
            transition="all 0.2s"
            _hover={{
                transform: 'translateY(-2px)',
                shadow: 'md',
                borderColor: 'brand.500',
            }}
            position="relative"
            overflow="hidden"
        >
            {/* Status Indicator */}
            {!challenge.is_accessible && (
                <Box
                    position="absolute"
                    top={0}
                    right={0}
                    p={2}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    borderBottomLeftRadius="md"
                >
                    <Tooltip
                        label={challenge.access_type === 'sequential'
                            ? 'Selesaikan tantangan sebelumnya'
                            : 'Membutuhkan kode akses'}
                        placement="top"
                    >
                        <Box>
                            <Lock size={16} color={textColor} />
                        </Box>
                    </Tooltip>
                </Box>
            )}

            {/* Card Content */}
            <Box p={6}>
                <VStack align="stretch" spacing={4}>
                    {/* Title & Badges */}
                    <VStack align="start" spacing={3}>
                        <Heading size="md" color={headingColor}>
                            {challenge.title}
                        </Heading>
                        <HStack spacing={2} flexWrap="wrap">
                            <Tooltip label={`Tingkat Kesulitan: ${config.text}`}>
                                <Badge
                                    colorScheme={config.color}
                                    display="flex"
                                    alignItems="center"
                                    px={2}
                                    py={1}
                                >
                                    <Icon as={config.icon} mr={1} />
                                    {config.text}
                                </Badge>
                            </Tooltip>
                            <Tooltip label={`Kategori: ${challenge.category}`}>
                                <Badge
                                    colorScheme="purple"
                                    display="flex"
                                    alignItems="center"
                                    px={2}
                                    py={1}
                                >
                                    {challenge.category}
                                </Badge>
                            </Tooltip>
                        </HStack>
                    </VStack>

                    {/* Description */}
                    <Text
                        color={textColor}
                        noOfLines={2}
                        fontSize="sm"
                    >
                        {challenge.description}
                    </Text>

                    {/* Action Button */}
                    <Button
                        colorScheme={isAuthenticated && challenge.is_accessible ? 'brand' : 'gray'}
                        size="md"
                        width="100%"
                        rightIcon={<ChevronRight size={16} />}
                        onClick={handleStartChallenge}
                        _hover={{
                            transform: 'translateX(4px)',
                        }}
                        transition="all 0.2s"
                    >
                        {getButtonText()}
                    </Button>
                </VStack>
            </Box>

            {/* Access Code Modal */}
            <Modal
                isOpen={isAccessModalOpen}
                onClose={onAccessModalClose}
                isCentered
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent>
                    <ModalHeader>Masukkan Kode Akses</ModalHeader>
                    <ModalBody>
                        <VStack spacing={4}>
                            <Text textAlign="center" color={textColor}>
                                Tantangan ini memerlukan kode akses untuk dapat dikerjakan
                            </Text>
                            <InputGroup size="lg">
                                <Input
                                    placeholder="Masukkan kode akses"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !isSubmitting) {
                                            handleVerifyAccess();
                                        }
                                    }}
                                    pr="4.5rem"
                                />
                                <InputRightElement width="4.5rem">
                                    <Icon as={Lock} color="gray.400" />
                                </InputRightElement>
                            </InputGroup>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            onClick={onAccessModalClose}
                            isDisabled={isSubmitting}
                        >
                            Batal
                        </Button>
                        <Button
                            colorScheme="brand"
                            onClick={handleVerifyAccess}
                            isLoading={isSubmitting}
                            loadingText="Memverifikasi..."
                        >
                            Verifikasi
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Timer Confirmation Modal */}
            <Modal isOpen={isTimerModalOpen} onClose={onTimerModalClose} isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent>
                    <ModalHeader>Mulai Tantangan</ModalHeader>
                    <ModalBody>
                        <VStack spacing={4}>
                            <Alert
                                status="info"
                                bg={useColorModeValue('blue.50', 'blue.900')}
                                color={textColor}
                            >
                                <AlertIcon />
                                <Text>
                                    Timer akan dimulai segera setelah Anda mengklik tombol Mulai.
                                    Waktu pengerjaan akan direkam sampai Anda mengirimkan jawaban.
                                </Text>
                            </Alert>
                            <HStack>
                                <Icon as={Timer} />
                                <Text>Siap untuk memulai tantangan?</Text>
                            </HStack>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onTimerModalClose}>
                            Batal
                        </Button>
                        <Button
                            colorScheme="brand"
                            leftIcon={<Play size={16} />}
                            onClick={startTimer}
                        >
                            Mulai Sekarang
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default ChallengeCard;