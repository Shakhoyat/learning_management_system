I'll help you create a comprehensive, recruiter-focused LMS project that showcases modern web development skills. Let me break this down into a detailed daily workflow that emphasizes clean commits, professional development practices, and impressive features that demonstrate real-world capabilities.

## **Advanced LMS Project: 8-Day Development Sprint**

### **Project Overview & Tech Stack**

Your LMS will demonstrate proficiency in full-stack development with these technologies:
- **Backend**: Laravel 11 with Sanctum authentication, Redis caching, and queue jobs
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui components
- **Database**: PostgreSQL with proper indexing and relationships
- **Additional**: Docker for containerization, GitHub Actions for CI/CD

Let me guide you through each day with specific tasks and commit strategies that will make your GitHub activity graph look professional and consistent.

### **Day 1: Foundation & Database Architecture**

**Morning Session (4 hours):**
Start by setting up your development environment with Docker. Create a `docker-compose.yml` file that spins up PostgreSQL, Redis, and your Laravel application. This immediately shows recruiters you understand containerization.

```yaml
# Commit 1: "feat: Initialize Docker environment with PostgreSQL and Redis"
services:
  postgres:
    image: postgres:15
  redis:
    image: redis:alpine
  app:
    build: ./backend
```

Design your database schema thoughtfully. Create migrations for these core tables:
- `users` (with roles: admin, instructor, student)
- `courses` (title, description, thumbnail, price, instructor_id)
- `modules` (course_id, title, order_index)
- `lessons` (module_id, title, content, video_url, duration, order_index)
- `enrollments` (user_id, course_id, enrolled_at, completed_at)
- `progress` (user_id, lesson_id, completed_at, time_spent)

**Afternoon Session (4 hours):**
Implement Laravel authentication with Sanctum, but go beyond basics. Add email verification, password reset functionality, and role-based middleware. Create separate API route groups for each user role.

```php
// Commit 2: "feat: Implement multi-role authentication with Sanctum"
// Commit 3: "feat: Add role-based middleware and API route protection"
```

### **Day 2: Core Backend APIs & Advanced Features**

**Morning Session:**
Build your course management APIs with proper resource controllers. Implement pagination, filtering, and searching capabilities using Laravel's query builder. Add Eloquent relationships with eager loading to prevent N+1 queries.

```php
// Example: CoursesController with advanced filtering
public function index(Request $request)
{
    $courses = Course::with(['instructor', 'modules.lessons'])
        ->when($request->search, function($query, $search) {
            $query->where('title', 'like', "%{$search}%");
        })
        ->when($request->category, function($query, $category) {
            $query->where('category_id', $category);
        })
        ->paginate(12);
}
```

**Afternoon Session:**
Implement a sophisticated enrollment system with payment simulation. Add a `transactions` table to track payments, and use database transactions to ensure data consistency. Create a queue job for sending enrollment confirmation emails.

```php
// Commit 4: "feat: Add course CRUD with advanced filtering and search"
// Commit 5: "feat: Implement enrollment system with payment tracking"
// Commit 6: "feat: Add queue jobs for email notifications"
```

### **Day 3: Progress Tracking & Analytics**

**Morning Session:**
Build a comprehensive progress tracking system. Create endpoints that calculate completion percentages at lesson, module, and course levels. Use PostgreSQL window functions for efficient analytics queries.

```sql
-- Example: Calculate student progress across all enrolled courses
WITH lesson_progress AS (
    SELECT user_id, course_id, 
           COUNT(DISTINCT p.lesson_id) as completed_lessons,
           COUNT(DISTINCT l.id) as total_lessons
    FROM enrollments e
    JOIN lessons l ON l.course_id = e.course_id
    LEFT JOIN progress p ON p.user_id = e.user_id AND p.lesson_id = l.id
    GROUP BY user_id, course_id
)
SELECT *, (completed_lessons::float / total_lessons * 100) as completion_percentage
FROM lesson_progress;
```

**Afternoon Session:**
Add a quiz system with multiple question types (MCQ, true/false, short answer). Implement automatic grading for objective questions and store results in a `quiz_attempts` table. Create analytics endpoints for instructors to view student performance.

```php
// Commit 7: "feat: Add comprehensive progress tracking system"
// Commit 8: "feat: Implement quiz module with auto-grading"
// Commit 9: "feat: Add instructor analytics dashboard API"
```

### **Day 4: Next.js Frontend Foundation**

**Morning Session:**
Initialize your Next.js application with TypeScript and configure it properly. Set up your authentication context using Next-Auth or a custom solution with Sanctum. Create a clean folder structure that separates concerns:

```
/app
  /(auth)
    /login
    /register
  /(dashboard)
    /student
    /instructor
    /admin
/components
  /ui (shadcn components)
  /features
/lib
  /api (API client functions)
  /hooks (custom React hooks)
```

**Afternoon Session:**
Build reusable components using shadcn/ui for a professional look. Create a responsive navigation system that adapts based on user roles. Implement proper loading states and error boundaries.

```typescript
// Commit 10: "feat: Initialize Next.js with TypeScript and authentication"
// Commit 11: "feat: Add role-based navigation and layout components"
// Commit 12: "feat: Implement reusable UI components with shadcn"
```

### **Day 5: Student Experience**

**Morning Session:**
Create the student dashboard with course browsing, filtering, and search functionality. Implement infinite scrolling or pagination for course listings. Add course detail pages with module/lesson structure visualization.

**Afternoon Session:**
Build the lesson player interface with video support, markdown content rendering, and progress tracking. Implement keyboard shortcuts for navigation and create a distraction-free learning mode. Add note-taking functionality that saves to the backend.

```typescript
// Example: Custom hook for lesson navigation
const useLessonNavigation = () => {
  const { lessonId } = useParams();
  const router = useRouter();
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigateToNext();
      if (e.key === 'ArrowLeft') navigateToPrevious();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lessonId]);
};
```

```typescript
// Commit 13: "feat: Build student dashboard with course discovery"
// Commit 14: "feat: Add lesson player with keyboard navigation"
// Commit 15: "feat: Implement note-taking system for students"
```

### **FRONTEND DEVELOPMENT SPRINT: 3-Day React Implementation**

*Building on your completed Laravel backend with Tailwind v3*

---

## **Day 1: React Foundation & Authentication System**

### **Morning Session (4 hours): Project Setup & Core Architecture**

**Step 1: Initialize React Application with Docker & shadcn/ui (1 hour)**

Since you're using Docker, we'll set up the React frontend to work with your existing Docker environment:

```bash
# Navigate to project root (where docker-compose.yml is)
cd c:\Users\skt_pie\Videos\lms-web-project-new

# Create React app with Vite (this will be built in Docker)
npm create vite@latest frontend -- --template react-ts

# Navigate to frontend directory
cd frontend

# Create Dockerfile for React frontend
```

**Create Dockerfile for React Frontend:**
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Install shadcn/ui and essential dependencies
RUN npm install @tanstack/react-query axios react-router-dom
RUN npm install react-hook-form @hookform/resolvers zod
RUN npm install sonner react-hot-toast

# Install shadcn/ui dependencies
RUN npm install tailwindcss postcss autoprefixer
RUN npm install @radix-ui/react-slot
RUN npm install class-variance-authority clsx tailwind-merge
RUN npm install lucide-react recharts

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**Update your API configuration for Docker:**
```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  // Use the Docker service name for internal communication
  // The frontend Docker service can access backend via 'app:8000'
  // But for browser requests, use localhost:8000
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000/api'  // For browser requests
    : 'http://app:8000/api',       // For server-side requests (if any)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Initialize shadcn/ui in Docker environment:**
```bash
# After creating the frontend directory, initialize Tailwind and shadcn/ui
cd frontend

# Initialize Tailwind CSS
npx tailwindcss init -p

# Initialize shadcn/ui (you'll do this after Docker is running)
# npx shadcn-ui@latest init
```

**Docker commands to run:**
```bash
# Stop existing containers
docker-compose down

# Rebuild containers with new frontend
docker-compose build

# Start all services (backend + frontend + database)
docker-compose up -d

# Check if all services are running
docker-compose ps
```

**Access your applications:**
- **Frontend (React)**: http://localhost:3001
- **Backend (Laravel)**: http://localhost:8000
- **API Testing**: http://localhost:8000/api

**Initialize shadcn/ui components inside Docker container:**
```bash
# Execute commands inside the running frontend container
docker-compose exec frontend npx shadcn-ui@latest init

# Install essential UI components
docker-compose exec frontend npx shadcn-ui@latest add button
docker-compose exec frontend npx shadcn-ui@latest add card
docker-compose exec frontend npx shadcn-ui@latest add input
docker-compose exec frontend npx shadcn-ui@latest add form
docker-compose exec frontend npx shadcn-ui@latest add label
docker-compose exec frontend npx shadcn-ui@latest add badge
docker-compose exec frontend npx shadcn-ui@latest add avatar
docker-compose exec frontend npx shadcn-ui@latest add dropdown-menu
docker-compose exec frontend npx shadcn-ui@latest add navigation-menu
docker-compose exec frontend npx shadcn-ui@latest add tabs
docker-compose exec frontend npx shadcn-ui@latest add progress
docker-compose exec frontend npx shadcn-ui@latest add separator
docker-compose exec frontend npx shadcn-ui@latest add sheet
docker-compose exec frontend npx shadcn-ui@latest add dialog
docker-compose exec frontend npx shadcn-ui@latest add table
docker-compose exec frontend npx shadcn-ui@latest add skeleton
docker-compose exec frontend npx shadcn-ui@latest add radio-group
docker-compose exec frontend npx shadcn-ui@latest add checkbox
docker-compose exec frontend npx shadcn-ui@latest add textarea
```

**Step 2: Configure Tailwind CSS (30 mins)**
```bash
# Initialize Tailwind config
npx tailwindcss init -p

# Configure to work with your existing Laravel Tailwind setup
```

**Step 3: Project Structure Setup (30 mins)**
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── pages/
│   ├── auth/         # Login, Register, ForgotPassword
│   ├── student/      # Student dashboard, courses
│   ├── instructor/   # Instructor dashboard
│   └── admin/        # Admin panel
├── hooks/            # Custom React hooks
├── services/         # API services
├── utils/            # Utility functions
├── types/            # TypeScript types
└── context/          # React context providers
```

**Step 4: API Client Setup (2 hours)**
Create a robust API client that works with your Laravel Sanctum backend:

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **Afternoon Session (4 hours): Authentication System**

**Step 5: Authentication Context & Hooks (2 hours)**
```typescript
// context/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// hooks/useAuth.ts - Custom hook for authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Step 6: Login & Register Pages (2 hours)**
Create beautiful, responsive forms using your Laravel API endpoints:

```typescript
// pages/auth/Login.tsx
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Beautiful form with Tailwind styling */}
    </div>
  );
};
```

**Commits for Day 1 (Docker Workflow):**
```bash
# Commit the frontend setup
git add frontend/
git commit -m "feat: Initialize React frontend with Docker and Vite"

# Commit Docker configuration updates
git add docker-compose.yml frontend/Dockerfile
git commit -m "feat: Configure Docker environment for React frontend"

# Commit shadcn/ui setup
git add frontend/components.json frontend/tailwind.config.js
git commit -m "feat: Setup shadcn/ui with Tailwind CSS in Docker"

# Commit API client and authentication setup
git add frontend/src/services/ frontend/src/context/
git commit -m "feat: Implement API client and authentication context"

# Commit auth pages
git add frontend/src/pages/auth/
git commit -m "feat: Create login and registration pages with shadcn/ui"
```

**Docker Development Workflow:**
```bash
# During development, you can:

# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f frontend
docker-compose logs -f app

# Execute commands in running containers
docker-compose exec frontend npm install [package-name]
docker-compose exec frontend npx shadcn-ui@latest add [component]

# Restart a specific service after changes
docker-compose restart frontend

# Rebuild and restart everything
docker-compose down && docker-compose up --build -d
```

---

## **Day 2: Student Experience & Course Interface**

### **Morning Session (4 hours): Student Dashboard**

**Step 7: Protected Routes & Navigation (1 hour)**
```typescript
// components/layout/ProtectedRoute.tsx
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// components/layout/Navbar.tsx - Role-based navigation
const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-white border-b border-gray-200">
      {/* Navigation items based on user.role */}
    </nav>
  );
};
```

**Step 8: Student Dashboard with shadcn/ui Analytics (3 hours)**

Create a beautiful dashboard using shadcn/ui components that integrates with your Laravel API:

```typescript
// pages/student/Dashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Trophy, TrendingUp } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"

const StudentDashboard = () => {
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['student-enrollments'],
    queryFn: () => api.get('/student/enrollments').then(res => res.data)
  });
  
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['student-analytics'],
    queryFn: () => api.get('/student/analytics').then(res => res.data)
  });

  if (enrollmentsLoading || analyticsLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          {enrollments?.length || 0} Active Courses
        </Badge>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Completed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_hours || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12.5 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.certificates || 0}</div>
            <p className="text-xs text-muted-foreground">
              +1 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.avg_progress || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="continue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="continue">Continue Learning</TabsTrigger>
          <TabsTrigger value="progress">Progress Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="continue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enrollments?.map(enrollment => (
              <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <ProgressOverview analytics={analytics} />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <AchievementsGrid achievements={analytics?.achievements} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Course Progress Card Component
const CourseProgressCard = ({ enrollment }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-2">
              {enrollment.course.title}
            </CardTitle>
            <CardDescription>
              by {enrollment.course.instructor.name}
            </CardDescription>
          </div>
          <Badge variant={enrollment.progress >= 100 ? "default" : "secondary"}>
            {enrollment.progress >= 100 ? "Completed" : "In Progress"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{enrollment.progress}%</span>
          </div>
          <Progress value={enrollment.progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{enrollment.completed_lessons} / {enrollment.total_lessons} lessons</span>
          <span>{enrollment.time_spent}h spent</span>
        </div>
        
        <div className="pt-2">
          <Button className="w-full" size="sm">
            {enrollment.progress > 0 ? "Continue Learning" : "Start Course"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
```

### **Afternoon Session (4 hours): Course Discovery & Details**

**Step 9: Course Catalog (2 hours)**
```typescript
// pages/student/Courses.tsx
const CourseCatalog = () => {
  const [filters, setFilters] = useState({ search: '', category: '', level: '' });
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () => api.get('/courses', { params: filters }).then(res => res.data)
  });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(res => res.data)
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and filters */}
      <div className="mb-8">
        <SearchBar onSearch={(term) => setFilters(prev => ({ ...prev, search: term }))} />
        <FilterBar categories={categories} onFilterChange={setFilters} />
      </div>
      
      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses?.data?.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
```

**Step 10: Course Detail Page (2 hours)**
```typescript
// pages/student/CourseDetail.tsx
const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/courses/${courseId}`).then(res => res.data)
  });
  
  const enrollMutation = useMutation({
    mutationFn: (paymentData) => 
      api.post(`/student/courses/${courseId}/enroll`, paymentData),
    onSuccess: () => {
      toast.success('Successfully enrolled!');
      navigate(`/student/courses/${courseId}/learn`);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course header with video preview */}
      <div className="bg-gray-900 text-white rounded-lg p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
            <p className="text-gray-300 mb-6">{course?.description}</p>
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-blue-600 px-3 py-1 rounded">{course?.level}</span>
              <span>{course?.duration_hours} hours</span>
              <span>⭐ {course?.rating}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">${course?.price}</span>
              <EnrollButton course={course} onEnroll={enrollMutation.mutate} />
            </div>
          </div>
          <div>
            {/* Course preview video or image */}
            <div className="aspect-video bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Course curriculum */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CourseCurriculum modules={course?.modules} />
        </div>
        <div>
          <CourseInstructor instructor={course?.instructor} />
          <CourseStats course={course} />
        </div>
      </div>
    </div>
  );
};
```

**Commits for Day 2 (Docker Environment):**
```bash
# Commit protected routes and navigation
git add frontend/src/components/layout/
git commit -m "feat: Add protected routes and role-based navigation"

# Commit student dashboard with analytics
git add frontend/src/pages/student/Dashboard.tsx
git commit -m "feat: Implement student dashboard with shadcn/ui analytics"

# Commit course catalog
git add frontend/src/pages/student/Courses.tsx
git commit -m "feat: Create course catalog with search and filters"

# Commit course detail page
git add frontend/src/pages/student/CourseDetail.tsx
git commit -m "feat: Add course detail page with enrollment"

# Update Docker container if needed
docker-compose restart frontend
```

---

## **Day 3: Learning Interface & Instructor Features**

### **Morning Session (4 hours): Lesson Player & Learning Experience**

**Step 11: Lesson Player Interface (3 hours)**
```typescript
// pages/student/LessonPlayer.tsx
const LessonPlayer = () => {
  const { courseId, lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(null);
  
  const { data: course } = useQuery({
    queryKey: ['course-progress', courseId],
    queryFn: () => api.get(`/student/courses/${courseId}/progress`).then(res => res.data)
  });
  
  const completeLesson = useMutation({
    mutationFn: (lessonId) => api.post(`/student/lessons/${lessonId}/complete`),
    onSuccess: () => {
      toast.success('Lesson completed!');
      // Navigate to next lesson
    }
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Course navigation sidebar */}
      <div className="fixed left-0 top-0 w-80 h-full bg-white border-r">
        <CourseSidebar 
          course={course} 
          currentLessonId={lessonId}
          onLessonSelect={setCurrentLesson}
        />
      </div>
      
      {/* Main content area */}
      <div className="ml-80">
        {/* Video player or content area */}
        <div className="aspect-video bg-black">
          {currentLesson?.video_url ? (
            <VideoPlayer 
              src={currentLesson.video_url}
              onComplete={() => completeLesson.mutate(currentLesson.id)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              <ContentRenderer content={currentLesson?.content} />
            </div>
          )}
        </div>
        
        {/* Lesson controls and navigation */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{currentLesson?.title}</h1>
            <div className="flex space-x-2">
              <button className="btn-secondary">Previous</button>
              <button 
                className="btn-primary"
                onClick={() => completeLesson.mutate(currentLesson.id)}
              >
                Mark Complete
              </button>
              <button className="btn-secondary">Next</button>
            </div>
          </div>
          
          {/* Lesson notes and resources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LessonNotes lessonId={lessonId} />
            <LessonResources resources={currentLesson?.resources} />
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Step 12: Interactive Quiz Interface with shadcn/ui (1 hour)**

Create a modern quiz interface using shadcn/ui components:

```typescript
// components/features/QuizPlayer.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Timer, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import api from "@/services/api"

const QuizPlayer = ({ quiz, lessonId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const startQuiz = useMutation({
    mutationFn: () => api.post(`/student/lessons/${lessonId}/quizzes/${quiz.id}/attempts`),
    onSuccess: (data) => setAttemptId(data.data.data.id)
  });
  
  const submitAnswer = useMutation({
    mutationFn: (answerData) => 
      api.post(`/student/quiz-attempts/${attemptId}/answers`, answerData)
  });

  const submitQuiz = useMutation({
    mutationFn: () => api.post(`/student/quiz-attempts/${attemptId}/submit`),
    onSuccess: () => setIsSubmitted(true)
  });

  // Timer effect
  useEffect(() => {
    if (attemptId && timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitQuiz.mutate();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [attemptId, timeRemaining, isSubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentQuestion + 1) / quiz.questions.length) * 100;

  if (!attemptId) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{quiz.title}</CardTitle>
          <p className="text-muted-foreground">{quiz.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Timer className="h-8 w-8 mx-auto text-blue-500" />
              <div>
                <div className="font-semibold">{quiz.time_limit_minutes} minutes</div>
                <div className="text-sm text-muted-foreground">Time limit</div>
              </div>
            </div>
            <div className="space-y-2">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
              <div>
                <div className="font-semibold">{quiz.questions.length} questions</div>
                <div className="text-sm text-muted-foreground">Total questions</div>
              </div>
            </div>
            <div className="space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto text-orange-500" />
              <div>
                <div className="font-semibold">{quiz.passing_score}%</div>
                <div className="text-sm text-muted-foreground">Passing score</div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <p className="text-sm">{quiz.instructions}</p>
          </div>
          
          <div className="text-center">
            <Button onClick={() => startQuiz.mutate()} size="lg">
              Start Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted) {
    return <QuizResults />;
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{currentQ.type.replace('_', ' ')}</Badge>
            <Badge variant="outline">{currentQ.points} points</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <QuestionRenderer 
            question={currentQ}
            onAnswer={(answer) => setAnswers(prev => ({ ...prev, [currentQ.id]: answer }))}
            selectedAnswer={answers[currentQ.id]}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {currentQuestion === quiz.questions.length - 1 ? (
                <Button 
                  onClick={() => submitQuiz.mutate()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button 
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                >
                  Next Question
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Question Renderer Component
const QuestionRenderer = ({ question, onAnswer, selectedAnswer }) => {
  switch (question.type) {
    case 'multiple_choice':
      return (
        <RadioGroup 
          value={selectedAnswer || ""} 
          onValueChange={onAnswer}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    
    case 'true_false':
      return (
        <RadioGroup 
          value={selectedAnswer || ""} 
          onValueChange={onAnswer}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="True" id="true" />
            <Label htmlFor="true" className="cursor-pointer">True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="False" id="false" />
            <Label htmlFor="false" className="cursor-pointer">False</Label>
          </div>
        </RadioGroup>
      );
    
    case 'short_answer':
      return (
        <Textarea
          placeholder="Type your answer here..."
          value={selectedAnswer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          className="min-h-[100px]"
        />
      );
    
    default:
      return <div>Unsupported question type</div>;
  }
};
```

### **Afternoon Session (4 hours): Instructor Dashboard**

**Step 13: Instructor Dashboard with Advanced Analytics (2 hours)**

Create a sophisticated instructor dashboard using shadcn/ui and Recharts:

```typescript
// pages/instructor/Dashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, BookOpen, DollarSign, Star, TrendingUp, Eye } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"

const InstructorDashboard = () => {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['instructor-analytics'],
    queryFn: () => api.get('/instructor/analytics').then(res => res.data)
  });
  
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['instructor-courses'],
    queryFn: () => api.get('/instructor/courses').then(res => res.data)
  });

  if (analyticsLoading || coursesLoading) {
    return <InstructorDashboardSkeleton />
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Monitor your courses and student progress</p>
        </div>
        <Button>
          <BookOpen className="mr-2 h-4 w-4" />
          Create New Course
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Students"
          value={analytics?.total_students?.toString() || "0"}
          change="+12%"
          changeType="positive"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Courses"
          value={courses?.data?.length?.toString() || "0"}
          change="+1"
          changeType="neutral"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${analytics?.total_revenue || "0"}`}
          change="+8.2%"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Average Rating"
          value={analytics?.average_rating?.toString() || "0"}
          change="+0.1"
          changeType="positive"
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue from your courses</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={analytics?.revenue_chart || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>Course completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={analytics?.progress_chart || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics?.progress_chart?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Management */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Course Management</TabsTrigger>
          <TabsTrigger value="students">Student Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Manage and monitor your course performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses?.data?.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.students_count || 0}</TableCell>
                      <TableCell>${course.revenue || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {course.rating || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <StudentAnalytics analytics={analytics} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetrics analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, change, changeType, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${
          changeType === 'positive' ? 'text-green-600' : 
          changeType === 'negative' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
```

**Step 14: Course Creation Form (2 hours)**
```typescript
// pages/instructor/CreateCourse.tsx
const CreateCourse = () => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const createCourse = useMutation({
    mutationFn: (courseData) => api.post('/instructor/courses', courseData),
    onSuccess: (data) => {
      toast.success('Course created successfully!');
      navigate(`/instructor/courses/${data.data.id}/edit`);
    }
  });

  const steps = [
    { title: 'Basic Info', component: BasicInfoStep },
    { title: 'Curriculum', component: CurriculumStep },
    { title: 'Pricing', component: PricingStep },
    { title: 'Review', component: ReviewStep },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Step indicator */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((stepInfo, index) => (
              <StepIndicator 
                key={stepInfo.title}
                step={index + 1}
                title={stepInfo.title}
                isActive={step === index + 1}
                isCompleted={step > index + 1}
              />
            ))}
          </ol>
        </nav>
      </div>
      
      {/* Step content */}
      <div className="bg-white rounded-lg shadow p-6">
        {React.createElement(steps[step - 1].component, {
          register,
          errors,
          watch,
          onNext: () => setStep(prev => prev + 1),
          onPrev: () => setStep(prev => prev - 1),
          onSubmit: handleSubmit(createCourse.mutate),
        })}
      </div>
    </div>
  );
};
```

**Commits for Day 3 (Docker Environment):**
```bash
# Commit lesson player interface
git add frontend/src/pages/student/LessonPlayer.tsx
git commit -m "feat: Implement lesson player with video support"

# Commit quiz interface with shadcn/ui
git add frontend/src/components/features/QuizPlayer.tsx
git commit -m "feat: Add interactive quiz interface with shadcn/ui and timer"

# Commit instructor dashboard
git add frontend/src/pages/instructor/Dashboard.tsx
git commit -m "feat: Create instructor dashboard with Recharts analytics"

# Commit course creation wizard
git add frontend/src/pages/instructor/CreateCourse.tsx
git commit -m "feat: Add course creation wizard with step indicator"

# Final commit for course management
git add frontend/src/components/instructor/
git commit -m "feat: Implement comprehensive course management interface"

# Rebuild Docker containers if needed
docker-compose down && docker-compose up --build -d
```

**Docker Testing Commands:**
```bash
# Test your React frontend in Docker
docker-compose logs -f frontend

# Access frontend container for debugging
docker-compose exec frontend sh

# Install additional packages if needed
docker-compose exec frontend npm install [package-name]

# Check if all services are communicating
curl http://localhost:3001  # Frontend
curl http://localhost:8000/api/categories  # Backend API
```

---

## **Final Day Tasks (Evening): Polish & Integration**

**Step 15: Error Handling & Loading States (1 hour)**
```typescript
// components/ui/ErrorBoundary.tsx
// components/ui/LoadingSpinner.tsx
// Global error handling and beautiful loading states
```

**Step 16: Responsive Design Polish (1 hour)**
```css
/* Ensure all components work perfectly on mobile */
/* Add smooth animations and transitions */
```

**Step 17: Testing & Bug Fixes (1 hour)**
```bash
# Test all user flows
# Fix any integration issues with Laravel backend
# Ensure proper error handling
```

**Final Commits:**
```bash
git commit -m "feat: Add error boundaries and loading states"
git commit -m "style: Polish responsive design and animations"
git commit -m "fix: Resolve integration issues and improve UX"
git commit -m "docs: Update README with frontend setup instructions"
```

---

## **Key Technical Achievements After 3 Days (Docker Environment):**

✅ **Complete Docker Setup** - Frontend and backend running in containers
✅ **Authentication System** - Login, register, protected routes with shadcn/ui forms
✅ **Modern Student Dashboard** - shadcn/ui cards, progress bars, and analytics
✅ **Interactive Learning Platform** - Course discovery with beautiful shadcn/ui components
✅ **Advanced Quiz System** - Timer, progress tracking, multiple question types with shadcn/ui
✅ **Professional Instructor Dashboard** - Recharts integration, data tables, metric cards
✅ **Responsive Design** - Mobile-first, beautiful UI with shadcn/ui + Tailwind CSS
✅ **Full API Integration** - React frontend communicating with Laravel backend via Docker
✅ **Type Safety** - Full TypeScript implementation with proper types
✅ **Performance Optimized** - React Query for caching, optimistic updates
✅ **Production Ready** - Docker containerization for easy deployment

## **Docker Environment Benefits:**

🐳 **Containerization**: Consistent development environment across machines
🔄 **Hot Reload**: Vite dev server with Docker volumes for instant updates
🌐 **Network Isolation**: Frontend communicates with backend via Docker network
📦 **Dependency Management**: All dependencies contained within Docker images
🚀 **Easy Deployment**: Ready for production deployment with Docker

## **shadcn/ui Components Utilized:**

🎨 **UI Components**: Button, Card, Input, Form, Label, Badge, Avatar
📊 **Data Display**: Table, Progress, Tabs, Separator, Dialog, Sheet
📈 **Analytics**: Custom components with Recharts integration
🎯 **Interactive**: RadioGroup, Checkbox, Textarea, DropdownMenu
💫 **Feedback**: Skeleton loaders, Toast notifications, Loading states

## **Demo Features Ready:**

- **Student Flow**: Browse → Enroll → Learn → Take Quizzes → Track Progress
- **Instructor Flow**: Dashboard → Create Course → Manage Students → View Analytics  
- **Admin Flow**: User management, system overview
- **Modern Analytics**: Beautiful charts and progress tracking
- **Interactive Quizzes**: Timer-based quizzes with multiple question types
- **Docker Deployment**: Complete containerized application ready for production

This 3-day sprint builds a **production-ready React frontend** with **shadcn/ui** running in **Docker** that showcases modern development practices and provides an excellent demo for recruiters! The combination of your robust Laravel backend and this beautiful shadcn/ui frontend, all containerized with Docker, creates a **professional-grade LMS platform** that demonstrates full-stack expertise and DevOps knowledge. 🚀

<!-- ### **Bonus Features for Extra Impact (Optional Day 9-10):**

If you have extra time, consider adding these high-value features:

1. **AI-Powered Features**: Integrate OpenAI API for automatic quiz generation from lesson content or personalized learning recommendations based on progress patterns.

2. **Certificate Generation**: Create a PDF certificate generation system using libraries like DomPDF or Puppeteer when students complete courses.

3. **Multi-language Support**: Implement i18n in both backend and frontend to demonstrate internationalization capabilities.

4. **Advanced Analytics Dashboard**: Create detailed learning analytics with heat maps showing when students are most active, dropout points in courses, and predictive completion rates.

### **Key Points for Recruiter Appeal:**

Your commit history should tell a story of professional development. Make commits atomic and meaningful - each commit should represent a complete feature or fix. Write clear commit messages following conventional commits specification (feat:, fix:, docs:, test:, refactor:).

Throughout development, demonstrate these practices:
- Write clean, commented code explaining complex logic
- Use design patterns appropriately (Repository pattern, Service classes)
- Implement proper validation and sanitization
- Show security awareness (CSRF protection, SQL injection prevention, XSS protection)
- Document your API endpoints thoroughly
- Include performance considerations in your README

Remember to deploy your application to a service like Railway or Vercel/Supabase combo, providing recruiters with a live demo link. Create demo accounts with pre-populated data so recruiters can immediately explore all features without having to create content themselves.

This project structure demonstrates full-stack proficiency, modern development practices, and the ability to build complex, real-world applications - exactly what recruiters want to see in a portfolio project. -->