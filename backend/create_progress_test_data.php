<?php

// Quick data seeder for progress tracking demo

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

echo "🌱 Creating test data for Progress Tracking System\n\n";

try {
    // Create category if none exists
    $category = Category::first();
    if (!$category) {
        $category = Category::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
            'description' => 'Learn modern web development',
            'is_active' => true,
        ]);
        echo "✅ Created category: {$category->name}\n";
    }

    // Get instructor user
    $instructor = User::where('role', 'instructor')->first() ?? User::where('role', 'admin')->first();
    if (!$instructor) {
        echo "❌ No instructor found. Please create an instructor user first.\n";
        return;
    }

    // Create a test course
    $course = Course::create([
        'title' => 'JavaScript Fundamentals',
        'slug' => 'javascript-fundamentals',
        'description' => 'Learn the basics of JavaScript programming',
        'short_description' => 'Master JavaScript from scratch',
        'price' => 99.99,
        'duration_hours' => 40,
        'level' => 'beginner',
        'language' => 'English',
        'is_published' => true,
        'is_featured' => true,
        'category_id' => $category->id,
        'instructor_id' => $instructor->id,
        'max_students' => 100,
        'requirements' => ['Basic computer skills', 'Internet connection'],
        'what_you_learn' => ['JavaScript syntax', 'DOM manipulation', 'Async programming'],
    ]);
    echo "✅ Created course: {$course->title}\n";

    // Create modules
    $modules = [
        ['title' => 'Introduction to JavaScript', 'description' => 'Getting started with JS', 'order' => 1],
        ['title' => 'Variables and Data Types', 'description' => 'Understanding JS data types', 'order' => 2],
        ['title' => 'Functions and Scope', 'description' => 'Master JavaScript functions', 'order' => 3],
    ];

    foreach ($modules as $moduleData) {
        $module = Module::create([
            'title' => $moduleData['title'],
            'description' => $moduleData['description'],
            'order' => $moduleData['order'],
            'course_id' => $course->id,
            'is_published' => true,
        ]);
        echo "✅ Created module: {$module->title}\n";

        // Create lessons for each module
        $lessonTitles = [
            1 => ['What is JavaScript?', 'Setting up your environment', 'Your first JavaScript program'],
            2 => ['Numbers and strings', 'Boolean and null values', 'Arrays and objects'],
            3 => ['Function basics', 'Arrow functions', 'Scope and closures'],
        ];

        foreach ($lessonTitles[$moduleData['order']] as $index => $lessonTitle) {
            $lesson = Lesson::create([
                'module_id' => $module->id,
                'title' => $lessonTitle,
                'content' => "Content for lesson: {$lessonTitle}",
                'duration_minutes' => rand(15, 45),
                'order_index' => $index + 1,
                'is_published' => true,
            ]);
            echo "  ✅ Created lesson: {$lesson->title}\n";
        }
    }

    // Get student user
    $student = User::where('role', 'student')->first();
    if ($student) {
        // Enroll student in course
        $enrollment = Enrollment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'active',
            'amount_paid' => $course->price,
            'payment_status' => 'paid',
            'enrolled_at' => now(),
        ]);
        echo "✅ Enrolled student: {$student->name} in course\n";

        // Complete some lessons to create progress data
        $lessons = $course->lessons()->take(5)->get();
        foreach ($lessons as $index => $lesson) {
            Progress::create([
                'user_id' => $student->id,
                'lesson_id' => $lesson->id,
                'completed_at' => now()->subDays(rand(0, 7)),
                'time_spent' => rand(900, 2700), // 15-45 minutes in seconds
            ]);
            echo "  ✅ Completed lesson: {$lesson->title}\n";
        }
    }

    echo "\n🎉 Test data creation complete!\n";
    echo "\n📊 Created:\n";
    echo "• 1 Category\n";
    echo "• 1 Course\n";
    echo "• 3 Modules\n";
    echo "• 9 Lessons\n";
    if ($student) {
        echo "• 1 Enrollment\n";
        echo "• 5 Progress records\n";
    }
    echo "\n🚀 Ready to test the Progress Tracking API!\n";

} catch (Exception $e) {
    echo "❌ Error creating test data: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}