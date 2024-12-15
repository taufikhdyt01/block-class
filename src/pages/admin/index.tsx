import React, { useEffect, useState } from 'react';
import {
    Box,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Heading,
    Text,
    useColorModeValue,
    Icon,
    Flex,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import { FiUsers, FiAward, FiCheckCircle, FiActivity } from 'react-icons/fi';
import AdminLayout from '@/components/AdminLayout';
import {
    DashboardData,
    RecentActivity,
    RecentSubmission,
    getAdminDashboard
} from '@/services/api';
import { withAdminAuth } from '@/components/withAdminAuth';
import SEO from '@/components/SEO';

interface StatCardProps {
    title: string;
    stat: string;
    icon: React.ElementType;
    helpText?: string;
}

function StatCard(props: StatCardProps) {
    const { title, stat, icon, helpText } = props;
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Stat
            px={{ base: 4, md: 8 }}
            py={5}
            bg={bgColor}
            shadow="base"
            rounded="lg"
            position="relative"
        >
            <Flex justifyContent="space-between">
                <Box pl={2}>
                    <StatLabel fontWeight="medium" isTruncated color={textColor}>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="medium">
                        {stat}
                    </StatNumber>
                    {helpText && (
                        <StatHelpText color={textColor}>
                            {helpText}
                        </StatHelpText>
                    )}
                </Box>
                <Box my="auto" alignContent="center">
                    <Icon as={icon} w={8} h={8} color="blue.500" />
                </Box>
            </Flex>
        </Stat>
    );
}

interface RecentActivitiesProps {
    activities: RecentActivity[];
}

const RecentActivitiesList: React.FC<RecentActivitiesProps> = ({ activities }) => {
    const bgColor = useColorModeValue('white', 'gray.800');

    return (
        <Box bg={bgColor} shadow="base" rounded="lg" p={4}>
            <Heading size="md" mb={4}>Aktivitas Terbaru</Heading>
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th>Pengguna</Th>
                        <Th>Aktivitas</Th>
                        <Th>Waktu</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {activities.map((activity, index) => (
                        <Tr key={index}>
                            <Td>
                                <Text fontWeight="medium">{activity.user}</Text>
                            </Td>
                            <Td>
                                {activity.action} {activity.target}
                            </Td>
                            <Td>{activity.timestamp}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

interface RecentSubmissionsProps {
    submissions: RecentSubmission[];
}

const RecentSubmissionsList: React.FC<RecentSubmissionsProps> = ({ submissions }) => {
    const bgColor = useColorModeValue('white', 'gray.800');

    return (
        <Box bg={bgColor} shadow="base" rounded="lg" p={4}>
            <Heading size="md" mb={4}>Pengajuan Terbaru</Heading>
            <Table variant="simple" size="sm">
                <Thead>
                    <Tr>
                        <Th>Pengguna</Th>
                        <Th>Tantangan</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Skor</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {submissions.map((submission, index) => (
                        <Tr key={index}>
                            <Td>{submission.user}</Td>
                            <Td>{submission.challenge}</Td>
                            <Td>
                                <Badge
                                    colorScheme={submission.status === 'accepted' ? 'green' : 'red'}
                                >
                                    {submission.status === 'accepted' ? 'Jawaban Benar' : 'Jawaban Salah'}
                                </Badge>
                            </Td>
                            <Td isNumeric>{submission.score}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

const AdminDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await getAdminDashboard();
                if (response.success) {
                    setDashboardData(response.data);
                } else {
                    throw new Error(response.message);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Gagal memuat data dashboard. Silakan coba lagi nanti.');
                toast({
                    title: 'Error',
                    description: 'Gagal memuat data dashboard',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();

        // Optional: Set up polling to refresh data periodically
        const interval = setInterval(fetchDashboardData, 60000); // Refresh every minute

        return () => clearInterval(interval);
    }, [toast]);

    if (isLoading) {
        return (
            <AdminLayout>
                <Flex justify="center" align="center" height="100vh">
                    <Spinner size="xl" />
                </Flex>
            </AdminLayout>
        );
    }

    if (error || !dashboardData) {
        return (
            <AdminLayout>
                <Text color="red.500">{error || 'Terjadi kesalahan dalam memuat data'}</Text>
            </AdminLayout>
        );
    }

    const { stats, recent_activities, recent_submissions } = dashboardData;

    return (
        <>
            <SEO title="Dashboard Admin" />
            <AdminLayout>
                <Box>
                    <Heading size="lg" mb={6}>Dashboard Admin</Heading>

                    {/* Statistics */}
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
                        <StatCard
                            title="Total User"
                            stat={stats.total_users.value.toString()}
                            icon={FiUsers}
                            helpText={stats.total_users.change}
                        />
                        <StatCard
                            title="Total Tantangan"
                            stat={stats.total_challenges.value.toString()}
                            icon={FiAward}
                            helpText={stats.total_challenges.change}
                        />
                        <StatCard
                            title="Tantangan Selesai"
                            stat={stats.completed_challenges.value.toString()}
                            icon={FiCheckCircle}
                            helpText={stats.completed_challenges.change}
                        />
                        <StatCard
                            title="Tingkat Penyelesaian"
                            stat={stats.completion_rate.value}
                            icon={FiActivity}
                            helpText={stats.completion_rate.change}
                        />
                    </SimpleGrid>

                    {/* Activities and Recent Submissions */}
                    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                        <RecentActivitiesList activities={recent_activities} />
                        <RecentSubmissionsList submissions={recent_submissions} />
                    </SimpleGrid>
                </Box>
            </AdminLayout>
        </>
    );
};

export default withAdminAuth(AdminDashboardPage);