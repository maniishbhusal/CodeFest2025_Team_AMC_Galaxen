const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: 'parent' | 'doctor';
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

interface ApiError {
  error?: string;
  detail?: string;
  [key: string]: unknown;
}

export async function loginDoctor(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;
    throw new Error(errorData.error || errorData.detail || 'Login failed');
  }

  // Verify the user is a doctor
  if (data.user.role !== 'doctor') {
    throw new Error('This portal is only for doctors. Please use the mobile app for parent login.');
  }

  return data as LoginResponse;
}

export async function getCurrentUser(accessToken: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/auth/me/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<{ access: string }> {
  const response = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json();
}

// Doctor Dashboard Types
interface Child {
  id: number;
  full_name: string;
  date_of_birth: string;
  age_years: number;
  age_months: number;
  gender: 'male' | 'female' | 'other';
}

interface MChatResult {
  id: number;
  total_score: number;
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
}

interface MedicalHistory {
  pregnancy_infection: boolean;
  pregnancy_infection_desc?: string;
  birth_complications: boolean;
  birth_complications_desc?: string;
  brain_injury_first_year: boolean;
  brain_injury_desc?: string;
  family_autism_history: boolean;
  requires_specialist: boolean;
}

interface ChildEducation {
  is_in_school: boolean;
  school_name?: string;
  grade_class?: string;
  school_type?: 'government' | 'private' | 'special_school';
}

interface ChildHealth {
  height?: string;
  weight?: string;
  has_vaccinations: 'yes' | 'no' | 'not_sure';
  medical_conditions?: string;
  taking_medication: boolean;
  medication_list?: string;
}

interface AssessmentVideo {
  id: number;
  video_type: string;
  video_url: string;
  description?: string;
  uploaded_at: string;
}

// API Response format from backend
interface PendingPatient {
  assessment_id: number;
  child_id: number;
  child_name: string;
  age: string;
  parent_name: string;
  mchat_score: number | null;
  mchat_risk: 'low' | 'medium' | 'high' | null;
  submitted_at: string;
}

interface PatientDetail {
  id: number;
  child: Child;
  parent: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
  };
  mchat_result?: MChatResult;
  medical_history?: MedicalHistory;
  education?: ChildEducation;
  health?: ChildHealth;
  videos: AssessmentVideo[];
  status: 'pending' | 'in_review' | 'accepted' | 'completed';
  submitted_at: string;
}

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('doctorToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true',
  };
}

// Doctor Dashboard API Functions
// Using /api/therapy/doctor/ endpoints as per architecture.md

export async function getPendingPatients(): Promise<PendingPatient[]> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/pending/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('API Error:', response.status, text);
    throw new Error('Failed to fetch pending patients');
  }

  return response.json();
}

export async function getPatientDetail(childId: number): Promise<PatientDetail> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/patient/${childId}/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('API Error:', response.status, text);
    throw new Error('Failed to fetch patient details');
  }

  return response.json();
}

export async function acceptPatient(childId: number): Promise<{ message: string }> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/patient/${childId}/accept/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('API Error:', response.status, text);
    throw new Error('Failed to accept patient');
  }

  return response.json();
}

export async function getActivePatients(): Promise<ActivePatient[]> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/patients/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('API Error:', response.status, text);
    throw new Error('Failed to fetch active patients');
  }

  return response.json();
}

// Curriculum Types
interface Curriculum {
  id: number;
  title: string;
  description: string;
  duration_days: number;
  type: 'general' | 'specialized';
  spectrum_type?: string;
}

interface CurriculumTask {
  id: number;
  day_number: number;
  title: string;
  why_description: string;
  instructions: string;
  demo_video_url?: string;
  order_index: number;
}

interface CurriculumDetail extends Curriculum {
  tasks: CurriculumTask[];
}

interface ActivePatient {
  assessment_id: number;
  child_id: number;
  child_name: string;
  age: string;
  parent_name: string;
  status: 'accepted' | 'completed';
  has_curriculum: boolean;
  curriculum_day: number | null;
  reviewed_at: string;
}

interface ProgressEntry {
  id: number;
  task: CurriculumTask;
  day_number: number;
  date: string;
  status: 'not_done' | 'done_with_help' | 'done_without_help';
  video_url?: string;
  parent_notes?: string;
  submitted_at: string;
}

interface DoctorReviewData {
  id: number;
  review_period: number;
  observations: string;
  spectrum_identified?: string;
  recommendations: string;
  reviewed_at: string;
}

interface PatientProgress {
  curriculum: {
    id: number;
    title: string;
    duration_days: number;
    current_day: number;
    status: 'active' | 'completed' | 'paused';
    start_date: string;
    end_date: string;
  };
  stats: {
    total_tasks_submitted: number;
    tasks_done: number;
    tasks_done_without_help: number;
    completion_rate: number;
  };
  progress: ProgressEntry[];
  reviews: DoctorReviewData[];
}

// Curriculum API Functions
export async function getCurricula(): Promise<Curriculum[]> {
  const response = await fetch(`${BASE_URL}/api/therapy/curricula/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch curricula');
  }

  return response.json();
}

export async function getCurriculumDetail(id: number): Promise<CurriculumDetail> {
  const response = await fetch(`${BASE_URL}/api/therapy/curricula/${id}/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch curriculum details');
  }

  return response.json();
}

export async function assignCurriculum(childId: number, curriculumId: number, startDate: string): Promise<{ message: string; child_curriculum_id: number }> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/patient/${childId}/assign/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      curriculum_id: curriculumId,
      start_date: startDate,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to assign curriculum');
  }

  return response.json();
}

export async function getPatientProgress(childId: number): Promise<PatientProgress> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/patient/${childId}/progress/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to fetch patient progress');
  }

  return response.json();
}

export async function createReview(
  childId: number,
  data: {
    review_period: number;
    observations: string;
    spectrum_identified?: string;
    recommendations: string;
  }
): Promise<{ message: string; review_id: number }> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/patient/${childId}/review/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || 'Failed to create review');
  }

  return response.json();
}

// Diagnosis Report Types
interface DiagnosisReport {
  id: number;
  has_autism: boolean;
  spectrum_type: 'none' | 'mild' | 'moderate' | 'severe' | null;
  detailed_report: string;
  next_steps: string;
  shared_with_parent: boolean;
  created_at: string;
  doctor_name: string;
}

interface CreateDiagnosisData {
  has_autism: boolean;
  spectrum_type?: 'none' | 'mild' | 'moderate' | 'severe';
  detailed_report: string;
  next_steps: string;
  shared_with_parent: boolean;
}

// Diagnosis Report API Functions
export async function createDiagnosisReport(
  childId: number,
  data: CreateDiagnosisData
): Promise<{ message: string; report_id: number }> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/patient/${childId}/diagnosis/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || 'Failed to create diagnosis report');
  }

  return response.json();
}

interface DiagnosisReportsResponse {
  child_id: number;
  child_name: string;
  reports: DiagnosisReport[];
}

export async function getDiagnosisReports(childId: number): Promise<DiagnosisReport[]> {
  const response = await fetch(`${BASE_URL}/api/therapy/child/${childId}/reports/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch diagnosis reports');
  }

  const data: DiagnosisReportsResponse = await response.json();
  return data.reports || [];
}

export async function toggleReportSharing(reportId: number): Promise<{ message: string; shared_with_parent: boolean }> {
  const response = await fetch(`${BASE_URL}/api/therapy/doctor/report/${reportId}/toggle-share/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to toggle report sharing');
  }

  return response.json();
}

export type {
  LoginCredentials,
  User,
  AuthTokens,
  LoginResponse,
  Child,
  MChatResult,
  MedicalHistory,
  ChildEducation,
  ChildHealth,
  AssessmentVideo,
  PendingPatient,
  PatientDetail,
  Curriculum,
  CurriculumTask,
  CurriculumDetail,
  ActivePatient,
  ProgressEntry,
  DoctorReviewData,
  PatientProgress,
  DiagnosisReport,
  CreateDiagnosisData,
};
