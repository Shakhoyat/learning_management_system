<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\QuizController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'sendPasswordResetLink']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Email verification routes
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed'])
        ->name('verification.verify');
});

// Public course routes
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);
Route::get('/categories', [CourseController::class, 'categories']);

// Test quiz routes (public for testing)
Route::get('/test/lessons/{lesson}/quizzes', [QuizController::class, 'index']);
Route::get('/test/quiz/{id}', function ($id) {
    $quiz = App\Models\Quiz::with('questions')->find($id);
    return response()->json([
        'status' => 'success',
        'data' => $quiz
    ]);
});

// Protected routes - require authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // General authenticated routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
            ->middleware(['throttle:6,1']);
    });

    // Admin-only routes
    Route::prefix('admin')->middleware(['role:admin'])->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Admin dashboard data']);
        });

        Route::get('/users', function () {
            return response()->json(['message' => 'All users data']);
        });

        Route::post('/users/{user}/promote', function () {
            return response()->json(['message' => 'User promoted']);
        });

        Route::delete('/users/{user}', function () {
            return response()->json(['message' => 'User deleted']);
        });
    });

    // Instructor routes
    Route::prefix('instructor')->middleware(['role:admin,instructor'])->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Instructor dashboard data']);
        });

        // Course management for instructors
        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{course}', [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

        // Progress analytics for instructors
        Route::get('/analytics', [ProgressController::class, 'getInstructorAnalytics']);
        Route::get('/courses/{course}/students/progress', [ProgressController::class, 'getCourseStudentProgress']);

        Route::get('/students', function () {
            return response()->json(['message' => 'Enrolled students']);
        });
    });

    // Student routes
    Route::prefix('student')->middleware(['role:admin,instructor,student'])->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Student dashboard data']);
        });

        // Enrollment routes
        Route::get('/enrollments', [EnrollmentController::class, 'getUserEnrollments']);
        Route::post('/courses/{course}/enroll', [EnrollmentController::class, 'enrollInCourse']);

        // Progress tracking routes
        Route::get('/analytics', [ProgressController::class, 'getUserAnalytics']);
        Route::get('/courses/{course}/progress', [ProgressController::class, 'getCourseProgress']);
        Route::post('/lessons/{lesson}/complete', [ProgressController::class, 'completeLesson']);

        // Quiz routes for students
        Route::prefix('lessons/{lesson}/quizzes')->group(function () {
            Route::get('/', [QuizController::class, 'index']);
            Route::get('/{quiz}', [QuizController::class, 'show']);
            Route::post('/{quiz}/attempts', [QuizController::class, 'startAttempt']);
        });

        Route::prefix('quiz-attempts/{attempt}')->group(function () {
            Route::post('/answers', [QuizController::class, 'submitAnswer']);
            Route::post('/submit', [QuizController::class, 'submitQuiz']);
        });

        Route::get('/courses', function () {
            return response()->json(['message' => 'Enrolled courses']);
        });
    });

    // Instructor routes
    Route::prefix('instructor')->middleware(['role:instructor'])->group(function () {
        Route::get('/analytics', [ProgressController::class, 'getInstructorAnalytics']);
        Route::get('/courses/{course}/students', [ProgressController::class, 'getCourseStudentProgress']);

        // Quiz management for instructors
        Route::prefix('lessons/{lesson}/quizzes')->group(function () {
            Route::post('/', [QuizController::class, 'store']);
            Route::put('/{quiz}', [QuizController::class, 'update']);
            Route::delete('/{quiz}', [QuizController::class, 'destroy']);
            Route::get('/{quiz}/analytics', [QuizController::class, 'getAnalytics']);
        });
    });

    // Email verified routes
    Route::middleware(['verified'])->group(function () {
        Route::get('/verified-only', function () {
            return response()->json(['message' => 'This route requires email verification']);
        });
    });
});
