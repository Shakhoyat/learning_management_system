<?php

use App\Http\Controllers\Api\AuthController;
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

        Route::get('/courses', function () {
            return response()->json(['message' => 'Instructor courses']);
        });

        Route::post('/courses', function () {
            return response()->json(['message' => 'Course created']);
        });

        Route::put('/courses/{course}', function () {
            return response()->json(['message' => 'Course updated']);
        });

        Route::get('/students', function () {
            return response()->json(['message' => 'Enrolled students']);
        });
    });

    // Student routes
    Route::prefix('student')->middleware(['role:admin,instructor,student'])->group(function () {
        Route::get('/dashboard', function () {
            return response()->json(['message' => 'Student dashboard data']);
        });

        Route::get('/courses', function () {
            return response()->json(['message' => 'Enrolled courses']);
        });

        Route::post('/courses/{course}/enroll', function () {
            return response()->json(['message' => 'Enrolled in course']);
        });

        Route::get('/progress', function () {
            return response()->json(['message' => 'Learning progress']);
        });

        Route::post('/courses/{course}/lessons/{lesson}/complete', function () {
            return response()->json(['message' => 'Lesson completed']);
        });
    });

    // Email verified routes
    Route::middleware(['verified'])->group(function () {
        Route::get('/verified-only', function () {
            return response()->json(['message' => 'This route requires email verification']);
        });
    });
});
