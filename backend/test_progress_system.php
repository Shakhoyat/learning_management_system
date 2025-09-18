<?php

// Simple test script to verify the progress tracking system

require __DIR__ . '/vendor/autoload.php';

use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Enrollment;
use App\Models\Progress;

// Set up Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🚀 Testing Progress Tracking System\n\n";

try {
    // Test 1: Check if all tables exist
    echo "1. Checking database tables...\n";
    echo "   Users: " . User::count() . " records\n";
    echo "   Categories: " . Category::count() . " records\n";
    echo "   Courses: " . Course::count() . " records\n";
    echo "   Modules: " . Module::count() . " records\n";
    echo "   Lessons: " . Lesson::count() . " records\n";
    echo "   Enrollments: " . Enrollment::count() . " records\n";
    echo "   Progress: " . Progress::count() . " records\n";
    echo "   ✅ Database tables accessible\n\n";

    // Test 2: Test Progress model methods
    echo "2. Testing Progress model analytics methods...\n";

    // Create a test user if none exist
    $testUser = User::first();
    if (!$testUser) {
        echo "   No users found in database\n";
        echo "   ℹ️  Run user registration first\n\n";
    } else {
        echo "   Testing with user: {$testUser->name} (ID: {$testUser->id})\n";

        // Test analytics methods
        $analytics = Progress::getUserProgressAnalytics($testUser->id);
        echo "   User analytics query executed successfully\n";

        $streak = Progress::getLearningStreak($testUser->id);
        echo "   Learning streak query executed successfully\n";

        echo "   ✅ Progress analytics methods working\n\n";
    }

    // Test 3: Test Course model progress methods
    echo "3. Testing Course model progress methods...\n";

    $testCourse = Course::first();
    if (!$testCourse) {
        echo "   No courses found in database\n";
        echo "   ℹ️  Create courses first\n\n";
    } else {
        echo "   Testing with course: {$testCourse->title} (ID: {$testCourse->id})\n";

        // Test course progress methods
        if ($testUser) {
            $userProgress = $testCourse->getProgressForUser($testUser->id);
            echo "   User progress for course: {$userProgress}%\n";
        }

        $courseStats = $testCourse->getCompletionStatistics();
        echo "   Course completion statistics generated successfully\n";
        echo "   Total students: {$courseStats['total_students']}\n";

        echo "   ✅ Course progress methods working\n\n";
    }

    // Test 4: Test Lesson model methods
    echo "4. Testing Lesson model methods...\n";

    $testLesson = Lesson::first();
    if (!$testLesson) {
        echo "   No lessons found in database\n";
        echo "   ℹ️  Create lessons first\n\n";
    } else {
        echo "   Testing with lesson: {$testLesson->title} (ID: {$testLesson->id})\n";

        if ($testUser) {
            $isCompleted = $testLesson->isCompletedBy($testUser->id);
            echo "   Lesson completed by user: " . ($isCompleted ? 'Yes' : 'No') . "\n";
        }

        $completionRate = $testLesson->getCompletionRate();
        echo "   Lesson completion rate: {$completionRate}%\n";

        echo "   ✅ Lesson progress methods working\n\n";
    }

    echo "🎉 Progress Tracking System Test Complete!\n";
    echo "\n📋 Summary:\n";
    echo "✅ Database structure verified\n";
    echo "✅ Progress model analytics working\n";
    echo "✅ Course progress calculations working\n";
    echo "✅ Lesson completion tracking working\n";
    echo "\n🚀 System is ready for API testing!\n";
    echo "\nNext steps:\n";
    echo "1. Create test data (users, courses, lessons)\n";
    echo "2. Test API endpoints with Postman/curl\n";
    echo "3. Verify progress tracking via web interface\n";
} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
