<?php

require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';
$app->boot();

// Create instructor if not exists
$user = App\Models\User::where('role', 'instructor')->first();
if (!$user) {
    $user = App\Models\User::create([
        'name' => 'Test Instructor',
        'email' => 'instructor@example.com',
        'password' => bcrypt('password'),
        'role' => 'instructor',
        'email_verified_at' => now()
    ]);
}

// Create category if not exists
$category = App\Models\Category::firstOrCreate(
    ['slug' => 'programming'],
    [
        'name' => 'Programming',
        'description' => 'Learn programming',
        'is_active' => true
    ]
);

// Create a free course
$freeCourse = App\Models\Course::create([
    'title' => 'Free PHP Course',
    'slug' => 'free-php-course',
    'short_description' => 'Learn PHP for free',
    'description' => 'Complete PHP course for beginners',
    'price' => 0.00,
    'instructor_id' => $user->id,
    'category_id' => $category->id,
    'level' => 'beginner',
    'duration_hours' => 10,
    'is_active' => true,
    'is_featured' => false
]);

// Create a paid course
$paidCourse = App\Models\Course::create([
    'title' => 'Advanced Laravel Course',
    'slug' => 'advanced-laravel-course',
    'short_description' => 'Master Laravel framework',
    'description' => 'Complete Laravel course for advanced developers',
    'price' => 99.99,
    'instructor_id' => $user->id,
    'category_id' => $category->id,
    'level' => 'advanced',
    'duration_hours' => 25,
    'is_active' => true,
    'is_featured' => true
]);

echo "Test courses created successfully!\n";
echo "Free course ID: " . $freeCourse->id . "\n";
echo "Paid course ID: " . $paidCourse->id . "\n";
echo "Instructor: " . $user->name . " (" . $user->email . ")\n";