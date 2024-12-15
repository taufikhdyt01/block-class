import React, { useRef, useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Avatar,
    Center,
    Text,
    Box,
} from '@chakra-ui/react';
import { updateProfile } from '@/services/api';
import { useAuthContext } from '@/contexts/AuthContext';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
    currentAvatar: string;
    onProfileUpdate: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    currentName,
    currentAvatar,
    onProfileUpdate
}) => {
    const [name, setName] = useState(currentName);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const { updateUser } = useAuthContext();

    // Reset form saat modal dibuka
    useEffect(() => {
        if (isOpen) {
            setName(currentName);
            setAvatarFile(null);
            setPreviewUrl(currentAvatar);
        }
    }, [isOpen, currentName, currentAvatar]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validasi ukuran file (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast({
                    title: "Ukuran file terlalu besar",
                    description: "Ukuran file maksimal adalah 2MB",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            // Validasi tipe file
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast({
                    title: "Format file tidak sesuai",
                    description: "Silakan pilih file gambar dengan format JPG, JPEG, atau PNG",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            setAvatarFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        // Validasi nama tidak boleh kosong
        if (!name.trim()) {
            toast({
                title: "Nama tidak boleh kosong",
                description: "Silakan masukkan nama Anda",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();

            // Selalu kirim nama
            formData.append('name', name.trim());

            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const response = await updateProfile(formData);

            if (response.success) {
                // Update context global
                updateUser({
                    name: response.data.name,
                    avatar: response.data.avatar
                });

                toast({
                    title: "Berhasil",
                    description: "Profil Anda berhasil diperbarui",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                await onProfileUpdate();
                onClose();
            } else {
                throw new Error(response.message || "Terjadi kesalahan saat memperbarui profil");
            }
        } catch (error: any) {
            toast({
                title: "Gagal memperbarui profil",
                description: error.message || "Terjadi kesalahan yang tidak diketahui",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Bersihkan URL preview jika berbeda dari avatar saat ini
        if (previewUrl !== currentAvatar) {
            URL.revokeObjectURL(previewUrl);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Perbarui Profil</ModalHeader>
                <ModalCloseButton aria-label="Tutup" />
                <ModalBody>
                    <VStack spacing={6}>
                        {/* Upload Foto Profil */}
                        <FormControl>
                            <Center>
                                <Box position="relative">
                                    <Avatar
                                        size="2xl"
                                        src={previewUrl}
                                        name={name}
                                        cursor="pointer"
                                        onClick={handleAvatarClick}
                                    />
                                    <Input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        display="none"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        aria-label="Upload foto profil"
                                    />
                                </Box>
                            </Center>
                            <Center>
                                <Box position="relative">
                                    <Text
                                        fontSize="sm"
                                        color="gray.500"
                                        textAlign="center"
                                        mt={2}
                                    >
                                        Klik untuk mengganti foto profil
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        textAlign="center"
                                    >
                                        Format: JPG, JPEG, PNG (Maks. 2MB)
                                    </Text>
                                </Box>
                            </Center>
                        </FormControl>

                        {/* Input Nama */}
                        <FormControl>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Masukkan nama lengkap Anda"
                                aria-label="Nama lengkap"
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        onClick={handleClose}
                        isDisabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Menyimpan..."
                    >
                        Simpan Perubahan
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditProfileModal;