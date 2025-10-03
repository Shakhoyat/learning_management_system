# 🎓 Laravel Learning Management System (LMS)

<p align="center">
<img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
</p>

<p align="center">
<strong>A comprehensive Learning Management System showcasing advanced Laravel concepts, design patterns, and modern architecture</strong>
</p>

<p align="center">
<img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
<img src="https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker">
</p>

---

## 📖 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🏗️ Architecture & Design Patterns](#️-architecture--design-patterns)
- [💡 Laravel Concepts Demonstrated](#-laravel-concepts-demonstrated)
- [🗄️ Database Design](#️-database-design)
- [🔧 Core Features](#-core-features)
- [🚀 Advanced Implementations](#-advanced-implementations)
- [📊 Performance & Analytics](#-performance--analytics)
- [🛡️ Security Implementation](#️-security-implementation)
- [🧪 Testing Strategy](#-testing-strategy)
- [📦 Installation & Setup](#-installation--setup)
- [🎯 API Documentation](#-api-documentation)

---

## 🎯 Project Overview

This Learning Management System is a **production-ready Laravel application** that demonstrates comprehensive implementation of modern Laravel concepts, design patterns, and best practices. Built as a showcase of advanced Laravel development skills, it implements a complete educational platform with sophisticated user management, course delivery, progress tracking, and assessment systems.

### 🌟 Key Highlights

- **12 Eloquent Models** with complex relationships
- **17 Database Migrations** with advanced PostgreSQL features
- **RESTful API Architecture** with role-based access control
- **Advanced Progress Tracking** using Window Functions & CTEs
- **Automated Quiz System** with intelligent grading
- **Asynchronous Job Processing** for email notifications
- **Comprehensive Security** implementation

---

## 🏗️ Architecture & Design Patterns

### 🏛️ **Architectural Patterns Implemented**

#### 1. **Service Layer Pattern**
```php
// QuizGradingService - Complex business logic separation
class QuizGradingService 
{
    public function gradeAttempt(QuizAttempt $attempt): array
    {
        // Sophisticated auto-grading logic
        // Multiple question types support
        // Intelligent feedback generation
    }
}
```

#### 2. **Job Queue Pattern** 
```php
// Asynchronous email processing
class SendEnrollmentConfirmationEmail implements ShouldQueue
{
    use Queueable;
    
    public function handle(): void
    {
        Mail::to($this->enrollment->user->email)
            ->send(new EnrollmentConfirmationMail($this->enrollment));
    }
}
```

#### 3. **Middleware Pattern**
```php
// Custom role-based authorization
class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $userRole = $request->user()->role;
        
        if (!in_array($userRole, $roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        
        return $next($request);
    }
}
```

#### 4. **Repository Pattern (Eloquent Models as Smart Repositories)**
```php
// Models with business logic encapsulation
class Course extends Model 
{
    public function getEffectivePrice()
    {
        return $this->discount_price ?: $this->price;
    }
    
    public function getProgressForUser($userId)
    {
        // Complex progress calculation logic
    }
}
```

---

## 💡 Laravel Concepts Demonstrated

### ✅ **Core Framework Features**

| **Concept** | **Implementation** | **Files** | **Description** |
|-------------|-------------------|-----------|-----------------|
| **Eloquent ORM** | ✅ Advanced | 12 Models | Complex relationships, accessor/mutators, scopes |
| **Migrations** | ✅ Complete | 17 migrations | Schema design, foreign keys, indexes |
| **Seeders** | ✅ Comprehensive | Multiple seeders | Realistic test data generation |
| **Validation** | ✅ Extensive | All controllers | Request validation, custom rules |
| **Middleware** | ✅ Custom | RoleMiddleware | Authorization, authentication |
| **Route Groups** | ✅ Organized | api.php | Role-based route organization |
| **API Resources** | ⚠️ Planned | - | Response formatting enhancement |

### 🔐 **Authentication & Authorization**

```php
// Laravel Sanctum Implementation
Route::middleware(['auth:sanctum', 'role:admin,instructor'])->group(function () {
    Route::prefix('instructor')->group(function () {
        Route::get('/analytics', [AnalyticsController::class, 'instructor']);
        Route::post('/courses', [CourseController::class, 'store']);
    });
});

// Email Verification System
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    // Protected routes requiring email verification
});
```

### 🗄️ **Advanced Database Features**

#### Complex Eloquent Relationships
```php
// Polymorphic & Through Relationships
class Course extends Model 
{
    // HasManyThrough relationship
    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Module::class);
    }
    
    // BelongsToMany with pivot data
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('enrolled_at', 'progress_percentage');
    }
}

// Advanced query scopes
class User extends Model 
{
    public function scopeInstructors($query)
    {
        return $query->where('role', 'instructor');
    }
    
    public function scopeWithCourseProgress($query, $courseId)
    {
        return $query->with(['progress' => function ($q) use ($courseId) {
            $q->whereHas('lesson.module', function ($q) use ($courseId) {
                $q->where('course_id', $courseId);
            });
        }]);
    }
}
```

#### PostgreSQL Advanced Features
```sql
-- Window Functions for Analytics
WITH progress_stats AS (
    SELECT 
        user_id,
        lesson_id,
        completed_at,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY completed_at) as streak_number
    FROM progress 
    WHERE completed_at IS NOT NULL
),
learning_streaks AS (
    SELECT 
        user_id,
        COUNT(*) as current_streak,
        MAX(completed_at) as last_activity
    FROM progress_stats
    GROUP BY user_id
)
SELECT * FROM learning_streaks;
```

---

## 🗄️ Database Design

### 📊 **Entity Relationship Overview**

```mermaid
erDiagram
    Users ||--o{ Enrollments : enrolls
    Users ||--o{ Courses : instructs
    Categories ||--o{ Courses : contains
    Courses ||--o{ Modules : has
    Modules ||--o{ Lessons : contains
    Lessons ||--o{ Progress : tracks
    Lessons ||--o{ Quizzes : has
    Users ||--o{ QuizAttempts : takes
    Quizzes ||--o{ QuizQuestions : contains
    QuizAttempts ||--o{ QuizAnswers : has
    Enrollments ||--o{ Transactions : processes
```

### 🏗️ **Database Schema Highlights**

#### **Users Table** - Multi-role Authentication
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->enum('role', ['admin', 'instructor', 'student'])->default('student');
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

#### **Progress Table** - Advanced Tracking
```php
Schema::create('progress', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
    $table->timestamp('completed_at')->nullable();
    $table->integer('time_spent')->default(0); // seconds
    $table->timestamps();
    
    $table->unique(['user_id', 'lesson_id']); // Prevent duplicates
    $table->index(['user_id', 'completed_at']); // Performance optimization
});
```

---

## 🔧 Core Features

### 👥 **User Management & Authentication**

```php
// Multi-role User System
class User extends Authenticatable
{
    protected $fillable = [
        'name', 'email', 'password', 'role', 'bio', 'avatar'
    ];
    
    // Role-based relationships
    public function coursesAsInstructor()
    {
        return $this->hasMany(Course::class, 'instructor_id');
    }
    
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}

// API Authentication with Sanctum
Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);
    
    if (Auth::attempt($credentials)) {
        $token = Auth::user()->createToken('api-token')->plainTextToken;
        return response()->json(['token' => $token]);
    }
    
    return response()->json(['message' => 'Invalid credentials'], 401);
});
```

### 📚 **Course Management System**

```php
class Course extends Model 
{
    // Dynamic pricing with discounts
    public function getEffectivePrice()
    {
        return $this->discount_price ?: $this->price;
    }
    
    // Course statistics
    public function getCompletionStatistics()
    {
        return [
            'total_students' => $this->enrollments()->count(),
            'completed_students' => $this->enrollments()
                ->where('status', 'completed')->count(),
            'average_progress' => $this->enrollments()
                ->avg('progress_percentage'),
            'total_revenue' => $this->transactions()
                ->where('status', 'completed')->sum('amount')
        ];
    }
}
```

### 📊 **Progress Tracking System**

```php
class Progress extends Model 
{
    // Advanced analytics with PostgreSQL
    public static function getUserProgressAnalytics($userId)
    {
        return DB::select("
            WITH daily_progress AS (
                SELECT 
                    DATE(completed_at) as study_date,
                    COUNT(*) as lessons_completed,
                    SUM(time_spent) as total_time
                FROM progress 
                WHERE user_id = ? AND completed_at IS NOT NULL
                GROUP BY DATE(completed_at)
            ),
            streak_calculation AS (
                SELECT 
                    study_date,
                    lessons_completed,
                    LAG(study_date) OVER (ORDER BY study_date) as prev_date,
                    CASE 
                        WHEN DATE_PART('day', study_date - LAG(study_date) OVER (ORDER BY study_date)) = 1 
                        THEN 1 ELSE 0 
                    END as is_consecutive
                FROM daily_progress
            )
            SELECT 
                COUNT(*) as total_study_days,
                SUM(lessons_completed) as total_lessons,
                ROUND(AVG(lessons_completed), 2) as avg_lessons_per_day,
                MAX(lessons_completed) as max_lessons_in_day
            FROM daily_progress
        ", [$userId]);
    }
}
```

---

## 🚀 Advanced Implementations

### 🧠 **Intelligent Quiz System**

```php
class QuizGradingService 
{
    public function gradeAttempt(QuizAttempt $attempt): array
    {
        $totalPoints = 0;
        $earnedPoints = 0;
        $results = [];

        foreach ($attempt->quizAnswers as $answer) {
            $questionResult = $this->gradeAnswer($answer);
            $results[] = $questionResult;
            
            $totalPoints += $questionResult['points_possible'];
            $earnedPoints += $questionResult['points_earned'];
        }

        $score = $totalPoints > 0 ? ($earnedPoints / $totalPoints) * 100 : 0;
        $isPassed = $score >= $attempt->quiz->passing_score;

        return [
            'score' => round($score, 2),
            'is_passed' => $isPassed,
            'detailed_results' => $results
        ];
    }

    private function checkAnswer(QuizQuestion $question, array $userAnswer): bool
    {
        switch ($question->type) {
            case 'multiple_choice':
                return $this->checkMultipleChoice($question, $userAnswer);
            case 'true_false':
                return $this->checkTrueFalse($question, $userAnswer);
            case 'short_answer':
                return $this->checkShortAnswer($question, $userAnswer);
            default:
                return false;
        }
    }
}
```

### 📧 **Asynchronous Email System**

```php
// Job for handling enrollment confirmations
class SendEnrollmentConfirmationEmail implements ShouldQueue
{
    use Queueable;
    
    public $enrollment;

    public function __construct(Enrollment $enrollment)
    {
        $this->enrollment = $enrollment;
    }

    public function handle(): void
    {
        $this->enrollment->load(['user', 'course.instructor']);

        Mail::to($this->enrollment->user->email)
            ->send(new EnrollmentConfirmationMail($this->enrollment));

        Log::info('Enrollment confirmation sent', [
            'enrollment_id' => $this->enrollment->id,
            'user_email' => $this->enrollment->user->email
        ]);
    }
}

// Triggering the job
public function enrollInCourse(Request $request, Course $course)
{
    DB::transaction(function () use ($request, $course) {
        $enrollment = Enrollment::create([
            'user_id' => Auth::id(),
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now()
        ]);

        // Dispatch email job asynchronously
        SendEnrollmentConfirmationEmail::dispatch($enrollment);
    });
}
```

### 💳 **Transaction Processing System**

```php
class Transaction extends Model 
{
    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';

    protected $fillable = [
        'user_id', 'course_id', 'enrollment_id',
        'transaction_id', 'amount', 'status',
        'payment_method', 'gateway_response'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
        'processed_at' => 'datetime'
    ];

    public function isSuccessful(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'processed_at' => now()
        ]);

        // Update enrollment status
        $this->enrollment->update(['payment_status' => 'paid']);
    }
}
```

---

## 📊 Performance & Analytics

### 📈 **Real-time Analytics Dashboard**

```php
// Student Analytics Endpoint
public function getUserAnalytics(Request $request)
{
    $user = Auth::user();
    
    $analytics = [
        'overview' => [
            'total_enrollments' => $user->enrollments()->count(),
            'completed_courses' => $user->enrollments()->where('status', 'completed')->count(),
            'hours_learned' => $user->progress()->sum('time_spent') / 3600,
            'current_streak' => Progress::getLearningStreak($user->id)
        ],
        'progress_by_course' => $user->enrollments()->with('course')->get()->map(function ($enrollment) {
            return [
                'course_title' => $enrollment->course->title,
                'progress_percentage' => $enrollment->progress_percentage,
                'lessons_completed' => $enrollment->course->getProgressForUser($enrollment->user_id),
                'total_lessons' => $enrollment->course->total_lessons
            ];
        }),
        'recent_activity' => Progress::where('user_id', $user->id)
            ->with('lesson.module.course')
            ->orderBy('completed_at', 'desc')
            ->limit(10)
            ->get()
    ];

    return response()->json($analytics);
}
```

### 🎯 **Instructor Analytics**

```php
public function getInstructorAnalytics()
{
    $instructor = Auth::user();
    
    $analytics = [
        'course_statistics' => $instructor->coursesAsInstructor()->get()->map(function ($course) {
            return [
                'course_id' => $course->id,
                'title' => $course->title,
                'total_students' => $course->enrollments()->count(),
                'completion_rate' => $course->getAverageCompletionRate(),
                'revenue' => $course->transactions()->where('status', 'completed')->sum('amount'),
                'average_rating' => $course->reviews()->avg('rating')
            ];
        }),
        'student_progress' => $this->getDetailedStudentProgress($instructor->id),
        'quiz_performance' => $this->getQuizAnalytics($instructor->id)
    ];

    return response()->json($analytics);
}
```

---

## 🛡️ Security Implementation

### 🔐 **Multi-layered Security Approach**

```php
// 1. Route Protection with Middleware
Route::middleware(['auth:sanctum', 'role:admin,instructor'])->group(function () {
    Route::post('/courses', [CourseController::class, 'store']);
});

// 2. Request Validation
public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255|unique:courses',
        'description' => 'required|string|min:50',
        'price' => 'required|numeric|min:0|max:9999.99',
        'category_id' => 'required|exists:categories,id'
    ]);
    // Process validated data...
}

// 3. Authorization Checks
public function update(Request $request, Course $course)
{
    // Check if user owns the course
    if ($course->instructor_id !== Auth::id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    // Update logic...
}

// 4. Database Transaction Safety
public function enrollInCourse(Course $course)
{
    DB::transaction(function () use ($course) {
        // All enrollment operations in transaction
        $enrollment = Enrollment::create([...]);
        Transaction::create([...]);
        Progress::createForCourse($course, Auth::user());
    });
}
```

### 🔒 **Data Protection Features**

- **Password Hashing**: bcrypt with salt
- **SQL Injection Prevention**: Eloquent ORM parameterization
- **XSS Protection**: Laravel's built-in escaping
- **CSRF Protection**: SPA token verification
- **Rate Limiting**: API throttling implementation
- **Input Validation**: Comprehensive request validation

---

## 🧪 Testing Strategy

### ✅ **Comprehensive Test Coverage**

```php
// Feature Test Example
class CourseEnrollmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_enroll_in_course()
    {
        $student = User::factory()->create(['role' => 'student']);
        $course = Course::factory()->create(['price' => 99.99]);

        $response = $this->actingAs($student)
            ->postJson("/api/student/courses/{$course->id}/enroll");

        $response->assertStatus(201);
        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id
        ]);
    }

    public function test_enrollment_sends_confirmation_email()
    {
        Mail::fake();
        
        $student = User::factory()->create(['role' => 'student']);
        $course = Course::factory()->create();

        $this->actingAs($student)
            ->postJson("/api/student/courses/{$course->id}/enroll");

        Mail::assertSent(EnrollmentConfirmationMail::class);
    }
}
```

---

## 📦 Installation & Setup

### 🐳 **Docker Setup**

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DB_CONNECTION=pgsql
      - DB_HOST=postgres
      - DB_DATABASE=lms_db
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: lms_db
      POSTGRES_USER: lms_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### ⚡ **Quick Start**

```bash
# Clone and setup
git clone <repository>
cd backend

# Install dependencies
composer install
npm install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed

# Start development server
php artisan serve
```

---

## 🎯 API Documentation

### 🔗 **Core API Endpoints**

#### **Authentication**
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/user
```

#### **Courses**
```http
GET    /api/courses              # Public course listing
GET    /api/courses/{id}         # Course details
POST   /api/instructor/courses   # Create course (Instructor)
PUT    /api/instructor/courses/{id} # Update course
```

#### **Enrollment**
```http
GET    /api/student/enrollments     # User's enrollments
POST   /api/student/courses/{id}/enroll # Enroll in course
GET    /api/student/courses/{id}/progress # Course progress
```

#### **Progress Tracking**
```http
POST   /api/student/lessons/{id}/complete # Mark lesson complete
GET    /api/student/analytics              # Learning analytics
GET    /api/instructor/analytics           # Teaching analytics
```

#### **Quiz System**
```http
GET    /api/lessons/{id}/quizzes              # Available quizzes
POST   /api/lessons/{id}/quizzes/{id}/attempts # Start attempt
POST   /api/quiz-attempts/{id}/submit          # Submit quiz
```

---

## 🎉 **Laravel Concepts Mastery Demonstrated**

### ✅ **Advanced Laravel Features Showcase**

| **Concept** | **Mastery Level** | **Implementation Examples** |
|-------------|-------------------|----------------------------|
| **Eloquent Relationships** | ⭐⭐⭐⭐⭐ | HasManyThrough, Polymorphic, Pivot Tables |
| **Database Migrations** | ⭐⭐⭐⭐⭐ | Complex schemas, Foreign keys, Indexes |
| **Query Optimization** | ⭐⭐⭐⭐⭐ | Window Functions, CTEs, Eager Loading |
| **API Architecture** | ⭐⭐⭐⭐⭐ | RESTful design, Resource controllers |
| **Authentication** | ⭐⭐⭐⭐⭐ | Sanctum, Multi-role, Email verification |
| **Job Queues** | ⭐⭐⭐⭐ | Asynchronous email processing |
| **Service Layer** | ⭐⭐⭐⭐ | Quiz grading service |
| **Middleware** | ⭐⭐⭐⭐ | Custom role-based authorization |
| **Validation** | ⭐⭐⭐⭐⭐ | Comprehensive request validation |
| **Database Transactions** | ⭐⭐⭐⭐ | Data consistency & integrity |

---

## 🏆 **Project Achievements**

- ✅ **12 Eloquent Models** with sophisticated relationships
- ✅ **17 Database Migrations** with PostgreSQL optimization
- ✅ **Advanced Progress Tracking** using Window Functions
- ✅ **Intelligent Quiz System** with auto-grading
- ✅ **Role-based API Security** with Sanctum
- ✅ **Asynchronous Job Processing** for scalability
- ✅ **Comprehensive Analytics** for insights
- ✅ **Production-ready Architecture** with Docker support

---

**🚀 This LMS demonstrates mastery of Laravel framework capabilities and modern PHP development practices, ready for enterprise-level deployment and scaling.**
