import { apiClient } from "./client";

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category_id: number;
  instructor_id: number;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  price: number;
  status: "draft" | "published";
  image_url: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  instructor?: {
    id: number;
    name: string;
    email: string;
  };
  modules?: Module[];
  enrollment?: Enrollment;
  progress?: CourseProgress;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order_index: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content?: string;
  video_url?: string;
  duration: number;
  order_index: number;
  is_free: boolean;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: "active" | "completed" | "cancelled";
  amount_paid: number;
  payment_status: "pending" | "paid" | "failed";
  enrolled_at: string;
  completed_at?: string;
}

export interface CourseProgress {
  course_id: number;
  user_id: number;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  time_spent_minutes: number;
  last_accessed: string;
  module_progress?: ModuleProgress[];
}

export interface ModuleProgress {
  module_id: number;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export interface CoursesResponse {
  success: boolean;
  data: Course[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CourseFilters {
  search?: string;
  category_id?: number;
  level?: string;
  page?: number;
  per_page?: number;
}

export const coursesApi = {
  // Get all courses (public)
  getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category_id) params.append("category_id", filters.category_id.toString());
    if (filters?.level) params.append("level", filters.level);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());

    const response = await apiClient.get(`/courses?${params.toString()}`);
    return response.data;
  },

  // Get course details (public)
  getCourse: async (id: number): Promise<{ success: boolean; data: Course }> => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  // Get categories (public)
  getCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await apiClient.get("/categories");
    return response.data;
  },

  // Student specific endpoints
  student: {
    // Get enrolled courses
    getEnrolledCourses: async (): Promise<{ success: boolean; data: Course[] }> => {
      const response = await apiClient.get("/student/courses");
      return response.data;
    },

    // Get enrollments
    getEnrollments: async (): Promise<{ success: boolean; data: Enrollment[] }> => {
      const response = await apiClient.get("/student/enrollments");
      return response.data;
    },

    // Enroll in a course
    enrollCourse: async (courseId: number, paymentDetails?: any): Promise<{
      success: boolean;
      message: string;
      enrollment: Enrollment;
      transaction?: any;
    }> => {
      const response = await apiClient.post(`/student/courses/${courseId}/enroll`, paymentDetails);
      return response.data;
    },

    // Get course progress
    getCourseProgress: async (courseId: number): Promise<{ success: boolean; data: CourseProgress }> => {
      const response = await apiClient.get(`/student/courses/${courseId}/progress`);
      return response.data;
    },

    // Complete a lesson
    completeLesson: async (lessonId: number): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.post(`/student/lessons/${lessonId}/complete`);
      return response.data;
    },

    // Get analytics
    getAnalytics: async (): Promise<{ success: boolean; data: any }> => {
      const response = await apiClient.get("/student/analytics");
      return response.data;
    },

    // Get dashboard data
    getDashboard: async (): Promise<{ success: boolean; data: any }> => {
      const response = await apiClient.get("/student/dashboard");
      return response.data;
    },
  },
};