import React, { useState, useEffect, ReactNode } from 'react';
import {
    Box,
    VStack,
    HStack,
    Text,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { Clock } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

interface Challenge {
    id: number;
    slug: string;
    title: string;
}

interface SubmissionData {
    challenge_id: number;
    xml: string;
    status: string;
    score: number;
    test_results: any[];
    time_spent?: number;
}

interface TimedChallengeProps {
    challenge: Challenge;
    onSubmit: (data: SubmissionData) => Promise<void>;
    onTimeUpdate: (timeSpent: number) => void;
    children: ReactNode;
}

const TimedChallenge: React.FC<TimedChallengeProps> = ({
    challenge,
    onSubmit,
    onTimeUpdate,
    children
}) => {
    const { user } = useAuthContext();
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [previousTimeSpent, setPreviousTimeSpent] = useState<number>(0);
    const toast = useToast();

    // Color mode values
    const timerBgColor = useColorModeValue('gray.50', 'gray.700');
    const timerBorderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.800', 'white');

    const getStorageKey = (key: string): string => {
        if (!user?.id) return `challenge_${challenge.slug}_anonymous_${key}`;
        return `challenge_${challenge.slug}_${user.id}_${key}`;
    };

    const getStorageValueAsNumber = (key: string): number => {
        const value = localStorage.getItem(key);
        if (!value) return 0;
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
    };

    const clearAllTimerStorage = () => {
        const startKey = getStorageKey('start');
        const activeKey = getStorageKey('active');
        const timeSpentKey = getStorageKey('timeSpent');
        const isResumedKey = getStorageKey('isResumed');

        localStorage.removeItem(startKey);
        localStorage.removeItem(activeKey);
        localStorage.removeItem(timeSpentKey);
        localStorage.removeItem(isResumedKey);
    };

    const initializeTimer = () => {
        if (!user?.id) return false;

        const startKey = getStorageKey('start');
        const activeKey = getStorageKey('active');
        const timeSpentKey = getStorageKey('timeSpent');
        const isResumedKey = getStorageKey('isResumed');

        const now = Date.now();
        const isResumed = localStorage.getItem(isResumedKey) === 'true';

        if (!isResumed) {
            // If not resuming, clear everything
            clearAllTimerStorage();
            setPreviousTimeSpent(0);
            setElapsedTime(0);
            onTimeUpdate(0);
        } else {
            // If resuming, load previous time
            const savedTimeSpent = getStorageValueAsNumber(timeSpentKey);
            setPreviousTimeSpent(savedTimeSpent);
            setElapsedTime(savedTimeSpent);
            onTimeUpdate(savedTimeSpent);
            // Clear the resumed flag
            localStorage.removeItem(isResumedKey);
        }

        localStorage.setItem(startKey, now.toString());
        localStorage.setItem(activeKey, 'true');
        setStartTime(now);

        return true;
    };

    useEffect(() => {
        if (!user?.id) return;

        const startKey = getStorageKey('start');
        const activeKey = getStorageKey('active');
        const isResumedKey = getStorageKey('isResumed');

        const savedStartTime = localStorage.getItem(startKey);
        const isActive = localStorage.getItem(activeKey) === 'true';
        const isResumed = localStorage.getItem(isResumedKey) === 'true';

        if (savedStartTime && isActive) {
            const startTimeNum = Number(savedStartTime);
            if (!isNaN(startTimeNum)) {
                setStartTime(startTimeNum);
                if (isResumed) {
                    const timeSpentKey = getStorageKey('timeSpent');
                    const savedTimeSpent = getStorageValueAsNumber(timeSpentKey);
                    const currentElapsed = Date.now() - startTimeNum + savedTimeSpent;
                    setPreviousTimeSpent(savedTimeSpent);
                    setElapsedTime(currentElapsed);
                    onTimeUpdate(currentElapsed);
                } else {
                    const currentElapsed = Date.now() - startTimeNum;
                    setElapsedTime(currentElapsed);
                    onTimeUpdate(currentElapsed);
                }
            }
        } else {
            const initialized = initializeTimer();
            if (initialized) {
                toast({
                    title: isResumed ? "Timer Dilanjutkan" : "Timer Dimulai",
                    description: isResumed
                        ? "Melanjutkan pengerjaan dari sebelumnya"
                        : "Timer pengerjaan telah dimulai secara otomatis",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }, [user, challenge.slug]);

    useEffect(() => {
        if (startTime) {
            const interval = setInterval(() => {
                const currentTimeSpent = Date.now() - startTime + previousTimeSpent;
                setElapsedTime(currentTimeSpent);
                onTimeUpdate(currentTimeSpent);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startTime, previousTimeSpent, onTimeUpdate]);

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const clearTimer = () => {
        if (!user?.id) return;
        clearAllTimerStorage();
        setStartTime(null);
        setElapsedTime(0);
        setPreviousTimeSpent(0);
    };

    const handleSubmitWithCleanup = async (submissionData: Omit<SubmissionData, 'time_spent'>) => {
        if (!startTime) return;

        try {
            const currentTimeSpent = Date.now() - startTime;
            const totalTimeSpent = currentTimeSpent + previousTimeSpent;

            await onSubmit({
                ...submissionData,
                time_spent: totalTimeSpent
            });

            // Clear timer after successful submission
            clearTimer();
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };

    return (
        <VStack spacing={4} width="100%">
            <Box
                w="100%"
                p={4}
                borderRadius="lg"
                bg={timerBgColor}
                borderWidth={1}
                borderColor={timerBorderColor}
            >
                <HStack spacing={4}>
                    <Clock size={20} color={useColorModeValue('#1A202C', '#FFFFFF')} />
                    <Text fontWeight="bold" color={textColor}>
                        Waktu Pengerjaan: {formatTime(elapsedTime)}
                    </Text>
                </HStack>
            </Box>

            <Box w="100%">
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child as React.ReactElement<any>, {
                            onSubmit: handleSubmitWithCleanup
                        });
                    }
                    return child;
                })}
            </Box>
        </VStack>
    );
};

export default TimedChallenge;