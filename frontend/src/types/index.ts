export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours?: number;
  rating?: number;
  students_count?: number;
  instructor_id: number;
  instructor: User;
  category_id?: number;
  category?: Category;
  is_published: boolean;
  modules?: Module[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  courses_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order_index: number;
  lessons?: Lesson[];
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content?: string;
  video_url?: string;
  duration?: number;
  order_index: number;
  is_completed?: boolean;
  quiz?: Quiz;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number;
  completed_lessons: number;
  total_lessons: number;
  time_spent: number;
  enrolled_at: string;
  completed_at?: string;
  course: Course;
  user: User;
}

export interface Quiz {
  id: number;
  lesson_id: number;
  title: string;
  description?: string;
  instructions?: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  questions: QuizQuestion[];
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer?: string;
  points: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: number;
  user_id: number;
  quiz_id: number;
  score: number;
  total_points: number;
  passed: boolean;
  started_at: string;
  completed_at?: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
  points_earned: number;
}

export interface Progress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed_at: string;
  time_spent: number;
}

// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: 'student' | 'instructor';
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  next_page_url?: string;
  prev_page_url?: string;
}

// Analytics types
export interface StudentAnalytics {
  total_hours: number;
  certificates: number;
  avg_progress: number;
  achievements?: Achievement[];
}

export interface InstructorAnalytics {
  total_students: number;
  total_revenue: number;
  average_rating: number;
  revenue_chart: Array<{ month: string; revenue: number }>;
  progress_chart: Array<{ name: string; value: number }>;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}