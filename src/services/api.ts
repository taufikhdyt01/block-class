import { getToken } from '../utils/auth';

interface ApiError extends Error {
  status?: number;
  data?: any;
}

interface ValidationError {
  [key: string]: string[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: number;
  data: T;
}

async function httpClient<T>(
  endpoint: string, 
  { body, method = 'GET', headers = {}, ...customConfig }: any = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json'
  };

  // Hanya tambahkan Content-Type jika bukan GET request dan bukan FormData
  if (method !== 'GET' && !(body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  // Hanya tambahkan body jika bukan GET request
  if (method !== 'GET' && body) {
    if (body instanceof FormData) {
      config.body = body;
      // Hapus Content-Type header untuk FormData
      delete config.headers['Content-Type'];
    } else {
      config.body = JSON.stringify(body);
    }
  }

  try {
    const queryString = endpoint.includes('?') ? '' : '?';
    const response = await fetch(`/api/proxy?path=${endpoint}${queryString}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred') as ApiError;
      error.status = response.status;
      error.data = data.errors || data.data;
      throw error;
    }

    return data;
  } catch (error: any) {
    if (!error.status) {
      error.status = 500;
    }
    if (!error.data && error.message) {
      error.data = { message: [error.message] };
    }
    throw error;
  }
}

// Fungsi login
export async function login(credentials: { email: string; password: string }): Promise<AuthResponse> {
  return httpClient<AuthResponseData>('login', {
    method: 'POST',
    body: credentials
  });
}

// Fungsi register
export async function register(userData: RegisterData): Promise<AuthResponse> {
  const formData = new FormData();
  
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'avatar' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return httpClient<AuthResponseData>('register', {
    method: 'POST',
    body: formData
  });
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AccessToken {
  token: string;
  type: string;
}

interface AuthResponseData {
  user: AuthUser;
  access_token: AccessToken;
}

export interface AuthResponse extends ApiResponse<AuthResponseData> {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  avatar?: File;
  role: string;
}

export interface Challenge {
    id: number;
    title: string;
    slug: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    access_type: 'public' | 'private' | 'sequential';
    access_code: string
    is_accessible: boolean;
    required_challenge_id?: number;
    function_name: string;
    initial_xml: string;
    hints: string[];
    constraints: string[];
    test_cases: TestCase[];
    created_at: string;
    updated_at: string;
}

export interface ChallengesResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        challenges: Challenge[];
        pagination: Pagination;
    };
}

export interface VerifyAccessResponse {
    success: boolean;
    message: string;
}

export const getChallenges = async (page: number = 1): Promise<ChallengesResponse> => {
    return httpClient(`challenges?page=${page}`);
};

interface VerifyAccessRequest {
    access_code: string;
}

export interface VerifyAccessResponse extends ApiResponse<null> {}

export const verifyAccessCode = async (slug: string, code: string): Promise<VerifyAccessResponse> => {
    return httpClient<null>(`challenges/${slug}/verify-access`, {
        method: 'POST',
        body: {
            access_code: code
        }
    });
};


export interface TestCase {
    id: number;
    input: (number | string)[];
    expected_output: number | string | null;
    is_sample: boolean;
}

export interface TestResult {
    test_case_id?: number;
    passed: boolean;
    output: any;
    expected: number | string | null;
    input: (number | string)[];
    consoleOutput: string;
}

interface ChallengeResponse {
    success: boolean;
    message: string;
    code: number;
    data: Challenge;
}

export const getChallengeBySlug = async (slug: string): Promise<Challenge> => {
    const response: ChallengeResponse = await httpClient(`challenges/${slug}`);
    return response.data;
};

export interface Submission {
    id: number;
    user_id: number;
    challenge_id: number;
    xml: string;
    status: string;
    score: number;
    time_spent: string;
    submitted_at: string;
    test_results: TestResult[];
}

interface SubmissionRequest {
    challenge_id: number;
    xml: string;
    status: string;
    score: number;
    time_spent: number;
    test_results: {
        test_case_id: number;
        passed: boolean;
        output: string;
        console_output: string;
    }[];
}

interface SubmissionResponse {
    success: boolean;
    message: string;
    code: number;
    data: Submission;
}

export interface SubmissionList {
    id: number;
    status: string;
    score: number;
    time_spent: string;
    submitted_at: string;
}
interface SubmissionListResponse {
    success: boolean;
    message: string;
    code: number;
    data: SubmissionList[];
}

export const submitChallenge = async (submission: SubmissionRequest): Promise<SubmissionResponse> => {
    return httpClient('submissions', { method: 'POST', body: submission });
};

export const getSubmissionById = async (id: number): Promise<SubmissionResponse> => {
    return httpClient(`submissions/${id}`);
};

export const getSubmissionsByChallenge = async (slug: string): Promise<SubmissionListResponse> => {
    return httpClient(`challenges/${slug}/submissions`);
};

export interface LeaderboardEntry {
    id: number;
    user: string;
    score: number;
    time_spent: string;
    submission_time: string;
}

export interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export interface LeaderboardData {
    leaderboard: LeaderboardEntry[];
    pagination: Pagination;
}

export interface LeaderboardResponse {
    success: boolean;
    message: string;
    code: number;
    data: LeaderboardData;
}

export const getChallengeLeaderboard = async (slug: string, page: number = 1): Promise<LeaderboardResponse> => {
    return httpClient(`challenges/${slug}/leaderboard?page=${page}`);
};

export interface UserProfile {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar: string;
    total_challenges: number;
    completed_challenges: number;
    total_score: number;
    challenge_history: ChallengeHistory[];
}

export interface ChallengeHistory {
    challenge_id: number;
    title: string;
    difficulty: string;
    best_score: number;
    status: string;
    completed_at: string;
}

interface UserProfileResponse {
    success: boolean;
    message: string;
    code: number;
    data: UserProfile;
}

export const fetchUserProfile = async (): Promise<UserProfileResponse> => {
    return httpClient('user/profile');
};

export interface LeaderboardUser {
    id: number;
    user: string;
    total_score: number;
    completed_challenges: number;
}

interface OverallLeaderboardResponse {
    success: boolean;
    message: string;
    code: number;
    data: {
        leaderboard: LeaderboardUser[];
        pagination: Pagination;
    };
}

export const getOverallLeaderboard = async (page: number = 1): Promise<OverallLeaderboardResponse> => {
    return httpClient(`leaderboard?page=${page}`);
};

export interface DashboardStats {
    total_users: {
        value: number;
        change: string;
    };
    total_challenges: {
        value: number;
        change: string;
    };
    completed_challenges: {
        value: number;
        change: string;
    };
    completion_rate: {
        value: string;
        change: string;
    };
}

export interface RecentActivity {
    user: string;
    action: string;
    target: string;
    timestamp: string;
}

export interface RecentSubmission {
    user: string;
    challenge: string;
    status: string;
    score: number;
    submitted_at: string;
}

export interface DashboardData {
    stats: DashboardStats;
    recent_activities: RecentActivity[];
    recent_submissions: RecentSubmission[];
}

interface DashboardResponse {
    success: boolean;
    message: string;
    code: number;
    data: DashboardData;
}

export const getAdminDashboard = async (): Promise<DashboardResponse> => {
    return httpClient('admin/dashboard');
};

export interface AdminUser {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    created_at: string;
    updated_at: string;
}

interface AdminUserResponse {
    success: boolean;
    message: string;
    code: number;
    data: AdminUser[];
}

export const getAdminUsers = async (): Promise<AdminUserResponse> => {
    return httpClient('admin/users');
};


export interface AdminChallenge {
    id: number;
    title: string;
    slug: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    access_type: 'public' | 'private' | 'sequential';
    access_code: string | null;
}
interface AdminChallengesResponse {
    success: boolean;
    message: string;
    code: number;
    data: AdminChallenge[];
}
// Get all challenges (admin)
export const getAdminChallenges = async (): Promise<AdminChallengesResponse> => {
    return httpClient('admin/challenges');
};

export interface CreateChallengeData {
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    access_type: 'public' | 'private' | 'sequential';
    access_code?: string | null;
    required_challenge_id?: number | null;
    function_name: string;
    initial_xml: string;
    hints: string[];
    constraints: string[];
    test_cases: {
        input: any[];
        expected_output: any;
        is_sample: boolean;
    }[];
}
export const createChallenge = async (data: CreateChallengeData): Promise<ApiResponse<AdminChallenge>> => {
    return httpClient('admin/challenges', {
        method: 'POST',
        body: data
    });
};

// Helper type untuk membuat semua properti menjadi optional
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Tipe untuk update challenge yang mengizinkan partial update
export type UpdateChallengeData = DeepPartial<CreateChallengeData>;

// Interface untuk response update challenge
interface UpdateChallengeResponse extends ApiResponse<AdminChallenge> {}

// Fungsi untuk update challenge
export const updateChallenge = async (slug: string, data: UpdateChallengeData): Promise<UpdateChallengeResponse> => {
    return httpClient(`admin/challenges/${slug}`, {
        method: 'PUT',
        body: data
    });
};

// Interface untuk detail challenge admin (jika ada field tambahan khusus admin)
export interface AdminChallengeDetail extends CreateChallengeData {
    id: number;
    slug: string;
    created_at: string;
    updated_at: string;
}

// Fungsi untuk mendapatkan detail challenge (admin)
export const getAdminChallengeBySlug = async (slug: string): Promise<AdminChallengeDetail> => {
    const response = await httpClient<AdminChallengeDetail>(`admin/challenges/${slug}`);
    return response.data;
};

// Update interface untuk delete response
interface DeleteChallengeResponse extends ApiResponse<null> {}

// Update fungsi delete challenge
export const deleteChallenge = async (slug: string): Promise<DeleteChallengeResponse> => {
    return httpClient(`admin/challenges/${slug}`, {
        method: 'DELETE'
    });
};

export interface AdminChallenge {
    id: number;
    slug: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    access_type: 'public' | 'private' | 'sequential';
    access_code: string | null;
}

export interface ForgotPasswordRequest {
    email: string;
}

interface ForgotPasswordResponseData {
    status: string;
}

export interface ForgotPasswordResponse extends ApiResponse<ForgotPasswordResponseData> {}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return httpClient<ForgotPasswordResponseData>('forgot-password', {
        method: 'POST',
        body: data
    });
}

export interface ResetPasswordRequest {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}

interface ResetPasswordResponseData {
    status: string;
}

export interface ResetPasswordResponse extends ApiResponse<ResetPasswordResponseData> {}

export async function resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return httpClient<ResetPasswordResponseData>('reset-password', {
        method: 'POST',
        body: data
    });
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: File;
}

export async function updateProfile(data: FormData): Promise<ApiResponse<AuthUser>> {
  return httpClient<AuthUser>('user/profile/update', {
    method: 'POST',
    body: data
  });
}

export interface Class {
    id: number;
    slug: string;
    title: string;
    banner: string;
    detail: string;
    access_code: string;
    status: string;
    total_students: number;
    total_teachers: number;
    total_chapters: number;
    is_enrolled: boolean;
    created_at: string;
    updated_at: string;
}

export interface ClassesData {
    classes: Class[];
    pagination: Pagination;
}

export interface ClassesResponse extends ApiResponse<ClassesData> {}

export const getClasses = async (page: number = 1): Promise<ClassesResponse> => {
    return httpClient<ClassesData>(`classes?page=${page}`);
};

export const verifyClassCode = async (slug: string, code: string): Promise<ApiResponse<null>> => {
    return httpClient<null>(`classes/${slug}/enroll`, {
        method: 'POST',
        body: {
            access_code: code
        }
    });
};