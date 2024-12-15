import React from 'react';
import { Button, Icon, useToast } from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';

interface ReuseSolutionButtonProps {
    xml: string;
    challengeSlug: string;
    timeSpent: string;
}

const ReuseSolutionButton: React.FC<ReuseSolutionButtonProps> = ({
    xml,
    challengeSlug,
    timeSpent
}) => {
    const toast = useToast();

    const convertTimeToMs = (timeString: string): number => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
    };

    const handleReuseSolution = () => {
        try {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

            const getKey = (key: string) => `challenge_${challengeSlug}_${userId}_${key}`;

            // Save the XML to sessionStorage
            const sessionKey = `blockly_workspace_${challengeSlug}_${userId}`;
            sessionStorage.setItem(sessionKey, xml);

            // Convert time string to milliseconds and save
            const timeInMs = convertTimeToMs(timeSpent);
            localStorage.setItem(getKey('timeSpent'), timeInMs.toString());

            // Set flag to indicate this is a resumed solution
            localStorage.setItem(getKey('isResumed'), 'true');

            // Set challenge as active
            localStorage.setItem(getKey('active'), 'true');

            // Clear start time
            localStorage.removeItem(getKey('start'));

            toast({
                title: 'Solusi tersimpan',
                description: 'Anda akan dialihkan ke halaman tantangan',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });

            window.location.href = `/tantangan/${challengeSlug}`;
        } catch (error) {
            console.error('Error saving solution:', error);
            toast({
                title: 'Gagal menyimpan solusi',
                description: 'Terjadi kesalahan saat menyimpan solusi Anda',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Button
            onClick={handleReuseSolution}
            colorScheme="brand"
            variant="outline"
            leftIcon={<Icon as={FaEdit} />}
        >
            Lanjutkan Pengerjaan Solusi Ini
        </Button>
    );
};

export default ReuseSolutionButton;