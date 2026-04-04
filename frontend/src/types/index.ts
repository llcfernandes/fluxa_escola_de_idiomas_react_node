// ─── AUTH ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  language: 'pt' | 'en';
  enrolledCourses: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  language?: 'pt' | 'en';
}

// ─── COURSES ──────────────────────────────────────────────────────
export interface CourseModule {
  name: string;
  weeks: number;
  description: string;
}

export interface Course {
  id: string;
  slug: string;
  language: string;
  flag: string;
  level: string;
  duration: string;
  hoursPerWeek: number;
  maxStudents: number;
  price: number;
  priceLabel: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  longDescription: string;
  certifications: string[];
  modules: CourseModule[];
  image: string;
  rating: number;
  totalStudents: number;
  featured: boolean;
  order: number;
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  courseId: string;
  courseName: string;
  avatar: string;
  rating: number;
  text: string;
  result: string;
  featured: boolean;
}

// ─── CONTACT ──────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  courseInterest?: string;
}

// ─── API ──────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { msg: string; path: string }[];
  timestamp: string;
}

// ─── UI ───────────────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface NavItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}
