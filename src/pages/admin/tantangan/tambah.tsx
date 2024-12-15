import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
    VStack,
    Heading,
    useToast,
    Grid,
    GridItem,
    FormHelperText,
    IconButton,
    HStack,
    Card,
    CardHeader,
    CardBody,
    Text,
    Alert,
    AlertIcon,
    Spinner,
    Badge
} from '@chakra-ui/react';
import * as Blockly from 'blockly';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/AdminLayout';
import { withAdminAuth } from '@/components/withAdminAuth';
import { CreateChallengeData, createChallenge, getAdminChallenges, AdminChallenge } from '@/services/api';
import BlocklyComponent from '@/components/BlocklyComponent';
import { getToolboxXml } from '@/utils/blockly/toolbox';
import SEO from '@/components/SEO';

const AdminAddChallengePage = () => {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);
    const [availableChallenges, setAvailableChallenges] = useState<AdminChallenge[]>([]);
    const [blocklyLanguage, setBlocklyLanguage] = useState<'en' | 'id'>('id');
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [formData, setFormData] = useState<CreateChallengeData>({
        title: '',
        description: '',
        difficulty: 'easy',
        category: '',
        access_type: 'public',
        access_code: null,
        required_challenge_id: null,
        function_name: '',
        initial_xml: '',
        hints: [''],
        constraints: [''],
        test_cases: [
            {
                input: [''],
                expected_output: '',
                is_sample: true
            }
        ]
    });

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                setIsLoadingChallenges(true);
                const response = await getAdminChallenges();
                setAvailableChallenges(response.data);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Gagal memuat daftar tantangan',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setIsLoadingChallenges(false);
            }
        };

        fetchChallenges();
    }, [toast]);

    useEffect(() => {
        if (formData.access_type !== 'sequential') {
            setFormData(prev => ({
                ...prev,
                required_challenge_id: null
            }));
        }
    }, [formData.access_type]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'required_challenge_id') {
            setFormData(prev => ({
                ...prev,
                required_challenge_id: value ? Number(value) : null
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayInput = (index: number, value: string, field: 'hints' | 'constraints') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field: 'hints' | 'constraints') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (index: number, field: 'hints' | 'constraints') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleTestCaseChange = useCallback((index: number, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.map((testCase, i) => {
                if (i === index) {
                    if (field === 'input') {
                        return {
                            ...testCase,
                            input: [value] // Simpan sebagai array
                        };
                    } else if (field === 'expected_output') {
                        return {
                            ...testCase,
                            expected_output: value
                        };
                    } else if (field === 'is_sample') {
                        return {
                            ...testCase,
                            is_sample: value === 'true' // Konversi string ke boolean
                        };
                    }
                }
                return testCase;
            })
        }));
    }, []);

    const addTestCase = () => {
        setFormData(prev => ({
            ...prev,
            test_cases: [
                ...prev.test_cases,
                {
                    input: [''],
                    expected_output: '',
                    is_sample: false
                }
            ]
        }));
    };

    const removeTestCase = (index: number) => {
        setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.filter((_, i) => i !== index)
        }));
    };

    const handleWorkspaceChange = useCallback((newWorkspace: Blockly.WorkspaceSvg) => {
        workspaceRef.current = newWorkspace;
    }, []);

    // Handler untuk generate dan simpan XML
    const handleSaveXml = useCallback(() => {
        if (workspaceRef.current) {
            try {
                const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
                const xmlString = Blockly.Xml.domToText(xml);
                setFormData(prev => ({
                    ...prev,
                    initial_xml: xmlString
                }));
                toast({
                    title: 'XML Disimpan',
                    description: 'Template workspace berhasil disimpan',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error saving XML:', error);
                toast({
                    title: 'Error',
                    description: 'Gagal menyimpan XML workspace',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }, [toast]);

    const handleClearWorkspace = useCallback(() => {
        if (workspaceRef.current) {
            workspaceRef.current.clear();
            setFormData(prev => ({
                ...prev,
                initial_xml: ''
            }));
            toast({
                title: 'Workspace Dibersihkan',
                description: 'Semua blok telah dihapus',
                status: 'info',
                duration: 2000,
                isClosable: true,
            });
        }
    }, [toast]);

    // Handle submit tetap sama seperti sebelumnya
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validasi form
            if (!formData.title || !formData.description || !formData.function_name) {
                throw new Error('Mohon lengkapi semua field yang diperlukan');
            }

            if (formData.access_type === 'private' && !formData.access_code) {
                throw new Error('Kode akses diperlukan untuk tantangan private');
            }

            if (formData.test_cases.length === 0) {
                throw new Error('Minimal harus ada satu test case');
            }

            // Format test cases sebelum submit
            const dataToSubmit: CreateChallengeData = {
                ...formData,
                test_cases: formData.test_cases.map(tc => ({
                    ...tc,
                    input: tc.input.map(i => Number(i)),
                    expected_output: Number(tc.expected_output)
                }))
            };

            const response = await createChallenge(dataToSubmit);

            toast({
                title: 'Berhasil',
                description: 'Tantangan berhasil ditambahkan',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            router.push('/admin/tantangan');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Gagal menambahkan tantangan',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO title="Daftar Tantangan" />
            <AdminLayout>
                <Box maxW="container.xl" mx="auto" py={8}>
                    <VStack spacing={8} align="stretch">
                        <Heading size="lg">Tambah Tantangan Baru</Heading>

                        <form onSubmit={handleSubmit}>
                            <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                                {/* Informasi Dasar */}
                                <GridItem colSpan={8}>
                                    <Card>
                                        <CardHeader>
                                            <Heading size="md">Informasi Dasar</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <VStack spacing={4}>
                                                <FormControl isRequired>
                                                    <FormLabel>Judul Tantangan</FormLabel>
                                                    <Input
                                                        name="title"
                                                        value={formData.title}
                                                        onChange={handleInputChange}
                                                        placeholder="Contoh: Menghitung Luas Persegi"
                                                    />
                                                </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel>Deskripsi</FormLabel>
                                                    <Textarea
                                                        name="description"
                                                        value={formData.description}
                                                        onChange={handleInputChange}
                                                        placeholder="Jelaskan tentang tantangan ini..."
                                                        minH="200px"
                                                    />
                                                </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel>Nama Fungsi</FormLabel>
                                                    <Input
                                                        name="function_name"
                                                        value={formData.function_name}
                                                        onChange={handleInputChange}
                                                        placeholder="Contoh: hitungLuasPersegi"
                                                    />
                                                    <FormHelperText>
                                                        Gunakan format camelCase untuk nama fungsi
                                                    </FormHelperText>
                                                </FormControl>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </GridItem>

                                {/* Pengaturan */}
                                <GridItem colSpan={4}>
                                    <VStack spacing={4}>
                                        <Card w="full">
                                            <CardHeader>
                                                <Heading size="md">Pengaturan</Heading>
                                            </CardHeader>
                                            <CardBody>
                                                <VStack spacing={4}>
                                                    <FormControl isRequired>
                                                        <FormLabel>Tingkat Kesulitan</FormLabel>
                                                        <Select
                                                            name="difficulty"
                                                            value={formData.difficulty}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="easy">Mudah</option>
                                                            <option value="medium">Sedang</option>
                                                            <option value="hard">Sulit</option>
                                                        </Select>
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>Kategori</FormLabel>
                                                        <Input
                                                            name="category"
                                                            value={formData.category}
                                                            onChange={handleInputChange}
                                                            placeholder="Contoh: Geometri"
                                                        />
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>Tipe Akses</FormLabel>
                                                        <Select
                                                            name="access_type"
                                                            value={formData.access_type}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value="public">Publik</option>
                                                            <option value="private">Private</option>
                                                            <option value="sequential">Berurutan</option>
                                                        </Select>
                                                    </FormControl>

                                                    {formData.access_type === 'private' && (
                                                        <FormControl isRequired>
                                                            <FormLabel>Kode Akses</FormLabel>
                                                            <Input
                                                                name="access_code"
                                                                value={formData.access_code || ''}
                                                                onChange={handleInputChange}
                                                                placeholder="Contoh: GEOM101"
                                                            />
                                                        </FormControl>
                                                    )}

                                                    {formData.access_type === 'sequential' && (
                                                        <FormControl isRequired>
                                                            <FormLabel>Tantangan Prasyarat</FormLabel>
                                                            {isLoadingChallenges ? (
                                                                <HStack spacing={2}>
                                                                    <Spinner size="sm" />
                                                                    <Text fontSize="sm">Memuat daftar tantangan...</Text>
                                                                </HStack>
                                                            ) : (
                                                                <>
                                                                    <Select
                                                                        name="required_challenge_id"
                                                                        value={formData.required_challenge_id?.toString() || ''}
                                                                        onChange={handleInputChange}
                                                                        placeholder="Pilih tantangan prasyarat"
                                                                    >
                                                                        {availableChallenges.map(challenge => (
                                                                            <option key={challenge.id} value={challenge.id}>
                                                                                {challenge.title} - {challenge.category} ({challenge.difficulty})
                                                                            </option>
                                                                        ))}
                                                                    </Select>
                                                                    <FormHelperText>
                                                                        Tantangan ini hanya dapat diakses setelah menyelesaikan tantangan yang dipilih
                                                                    </FormHelperText>
                                                                </>
                                                            )}
                                                        </FormControl>
                                                    )}
                                                </VStack>
                                            </CardBody>
                                        </Card>
                                    </VStack>
                                </GridItem>

                                <GridItem colSpan={12}>
                                    <Card>
                                        <CardHeader>
                                            <HStack justify="space-between">
                                                <Heading size="md">Template Workspace</Heading>
                                                <HStack spacing={4}>
                                                    <Select
                                                        value={blocklyLanguage}
                                                        onChange={(e) => setBlocklyLanguage(e.target.value as 'en' | 'id')}
                                                        width="200px"
                                                    >
                                                        <option value="en">English</option>
                                                        <option value="id">Indonesia</option>
                                                    </Select>
                                                    <Button
                                                        colorScheme="blue"
                                                        leftIcon={<FiSave />}
                                                        onClick={handleSaveXml}
                                                    >
                                                        Simpan Template
                                                    </Button>
                                                    <Button
                                                        colorScheme="red"
                                                        variant="outline"
                                                        leftIcon={<FiTrash2 />}
                                                        onClick={handleClearWorkspace}
                                                    >
                                                        Bersihkan
                                                    </Button>
                                                </HStack>
                                            </HStack>
                                        </CardHeader>
                                        <CardBody>
                                            <VStack spacing={4} align="stretch">
                                                <Alert status="info">
                                                    <AlertIcon />
                                                    Susun blok-blok untuk membuat template awal, lalu klik "Simpan Template" untuk menyimpan konfigurasi
                                                </Alert>

                                                <Box height="500px" borderWidth={1} borderRadius="lg" overflow="hidden">
                                                    <BlocklyComponent
                                                        language={blocklyLanguage}
                                                        toolboxXml={getToolboxXml(blocklyLanguage)}
                                                        onWorkspaceChange={handleWorkspaceChange}
                                                        initialXml={formData.initial_xml || undefined}
                                                    />
                                                </Box>

                                                {formData.initial_xml && (
                                                    <FormControl>
                                                        <FormLabel>XML Template yang Tersimpan</FormLabel>
                                                        <Textarea
                                                            value={formData.initial_xml}
                                                            readOnly
                                                            size="sm"
                                                            height="100px"
                                                            fontFamily="monospace"
                                                            fontSize="sm"
                                                        />
                                                        <FormHelperText>
                                                            XML ini akan menjadi template awal untuk user saat mengerjakan tantangan
                                                        </FormHelperText>
                                                    </FormControl>
                                                )}
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </GridItem>

                                {/* Hints */}
                                <GridItem colSpan={6}>
                                    <Card>
                                        <CardHeader>
                                            <Heading size="md">Petunjuk</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <VStack spacing={4} align="stretch">
                                                {formData.hints.map((hint, index) => (
                                                    <HStack key={index}>
                                                        <FormControl>
                                                            <Input
                                                                value={hint}
                                                                onChange={(e) => handleArrayInput(index, e.target.value, 'hints')}
                                                                placeholder="Tambahkan petunjuk..."
                                                            />
                                                        </FormControl>
                                                        <IconButton
                                                            aria-label="Hapus petunjuk"
                                                            icon={<FiTrash2 />}
                                                            onClick={() => removeArrayItem(index, 'hints')}
                                                            colorScheme="red"
                                                        />
                                                    </HStack>
                                                ))}
                                                <Button
                                                    leftIcon={<FiPlus />}
                                                    onClick={() => addArrayItem('hints')}
                                                    size="sm"
                                                >
                                                    Tambah Petunjuk
                                                </Button>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </GridItem>

                                {/* Constraints */}
                                <GridItem colSpan={6}>
                                    <Card>
                                        <CardHeader>
                                            <Heading size="md">Batasan</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <VStack spacing={4} align="stretch">
                                                {formData.constraints.map((constraint, index) => (
                                                    <HStack key={index}>
                                                        <FormControl>
                                                            <Input
                                                                value={constraint}
                                                                onChange={(e) => handleArrayInput(index, e.target.value, 'constraints')}
                                                                placeholder="Tambahkan batasan..."
                                                            />
                                                        </FormControl>
                                                        <IconButton
                                                            aria-label="Hapus batasan"
                                                            icon={<FiTrash2 />}
                                                            onClick={() => removeArrayItem(index, 'constraints')}
                                                            colorScheme="red"
                                                        />
                                                    </HStack>
                                                ))}
                                                <Button
                                                    leftIcon={<FiPlus />}
                                                    onClick={() => addArrayItem('constraints')}
                                                    size="sm"
                                                >
                                                    Tambah Batasan
                                                </Button>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </GridItem>

                                {/* Test Cases */}
                                <GridItem colSpan={12}>
                                    <Card>
                                        <CardHeader>
                                            <Heading size="md">Test Cases</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <VStack spacing={4} align="stretch">
                                                {formData.test_cases.map((testCase, index) => (
                                                    <Box key={index} p={4} borderWidth={1} borderRadius="md">
                                                        <HStack justify="space-between" mb={4}>
                                                            <Text fontWeight="bold">
                                                                Test Case #{index + 1}
                                                            </Text>
                                                            <HStack spacing={2}>
                                                                <Badge
                                                                    colorScheme={testCase.is_sample ? 'green' : 'gray'}
                                                                >
                                                                    {testCase.is_sample ? 'Sample' : 'Hidden'}
                                                                </Badge>
                                                                <IconButton
                                                                    aria-label="Hapus test case"
                                                                    icon={<FiTrash2 />}
                                                                    onClick={() => removeTestCase(index)}
                                                                    colorScheme="red"
                                                                    size="sm"
                                                                />
                                                            </HStack>
                                                        </HStack>
                                                        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                                                            <FormControl isRequired>
                                                                <FormLabel>Input</FormLabel>
                                                                <Input
                                                                    value={testCase.input[0]}
                                                                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                                                    placeholder="Nilai input"
                                                                />
                                                                <FormHelperText>
                                                                    Contoh: 42 (number), "hello" (string), true/false (boolean)
                                                                </FormHelperText>
                                                            </FormControl>
                                                            <FormControl isRequired>
                                                                <FormLabel>Expected Output</FormLabel>
                                                                <Input
                                                                    value={testCase.expected_output}
                                                                    onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                                                                    placeholder="Nilai output yang diharapkan"
                                                                />
                                                                <FormHelperText>
                                                                    Contoh: 42 (number), "hello" (string), true/false (boolean)
                                                                </FormHelperText>
                                                            </FormControl>
                                                            <FormControl>
                                                                <FormLabel>Tipe</FormLabel>
                                                                <Select
                                                                    value={testCase.is_sample ? 'true' : 'false'}
                                                                    onChange={(e) => handleTestCaseChange(index, 'is_sample', e.target.value)}
                                                                >
                                                                    <option value="true">Sample</option>
                                                                    <option value="false">Hidden</option>
                                                                </Select>
                                                                <FormHelperText>
                                                                    Sample: Ditampilkan ke user | Hidden: Digunakan untuk pengujian
                                                                </FormHelperText>
                                                            </FormControl>
                                                        </Grid>
                                                    </Box>
                                                ))}
                                                <Button
                                                    leftIcon={<FiPlus />}
                                                    onClick={addTestCase}
                                                    size="sm"
                                                >
                                                    Tambah Test Case
                                                </Button>
                                            </VStack>
                                        </CardBody>
                                    </Card>
                                </GridItem>

                                {/* Tombol Submit */}
                                <GridItem colSpan={12}>
                                    <HStack spacing={4} justify="flex-end">
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push('/admin/tantangan')}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            colorScheme="blue"
                                            type="submit"
                                            isLoading={isSubmitting}
                                            loadingText="Menyimpan..."
                                        >
                                            Simpan Tantangan
                                        </Button>
                                    </HStack>
                                </GridItem>
                            </Grid>
                        </form>
                    </VStack>
                </Box>
            </AdminLayout>
        </>
    );
};

export default withAdminAuth(AdminAddChallengePage);