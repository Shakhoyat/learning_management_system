<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create an instructor
        $instructor = User::where('email', 'instructor@example.com')->first();

        if (!$instructor) {
            $instructor = User::create([
                'name' => 'John Instructor',
                'email' => 'instructor@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $instructor->assignRole('instructor');
        }

        // Create a comprehensive course
        $course = Course::updateOrCreate(
            ['title' => 'Complete Web Development Course'],
            [
                'description' => 'Learn web development from basics to advanced concepts',
                'short_description' => 'Master web development skills',
                'slug' => 'complete-web-development-course',
                'price' => 199.99,
                'instructor_id' => $instructor->id,
                'level' => 'beginner',
                'duration_hours' => 40,
                'status' => 'published',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Create modules with lessons
        $modules = [
            [
                'title' => 'HTML & CSS Fundamentals',
                'description' => 'Learn the building blocks of web development',
                'lessons' => [
                    ['title' => 'Introduction to HTML', 'content' => 'Learn HTML basics and structure', 'duration_minutes' => 45],
                    ['title' => 'CSS Styling', 'content' => 'Style your HTML with CSS', 'duration_minutes' => 60],
                    ['title' => 'Responsive Design', 'content' => 'Make your sites responsive', 'duration_minutes' => 50],
                ]
            ],
            [
                'title' => 'JavaScript Programming',
                'description' => 'Master JavaScript programming language',
                'lessons' => [
                    ['title' => 'JavaScript Basics', 'content' => 'Variables, functions, and control flow', 'duration_minutes' => 75],
                    ['title' => 'DOM Manipulation', 'content' => 'Interact with HTML elements', 'duration_minutes' => 55],
                    ['title' => 'Async Programming', 'content' => 'Promises, async/await, and APIs', 'duration_minutes' => 80],
                ]
            ],
            [
                'title' => 'Backend Development',
                'description' => 'Server-side programming and databases',
                'lessons' => [
                    ['title' => 'PHP Fundamentals', 'content' => 'Learn PHP programming basics', 'duration_minutes' => 70],
                    ['title' => 'Laravel Framework', 'content' => 'Build web applications with Laravel', 'duration_minutes' => 90],
                    ['title' => 'Database Design', 'content' => 'Design and work with databases', 'duration_minutes' => 65],
                ]
            ]
        ];

        foreach ($modules as $index => $moduleData) {
            $module = $course->modules()->updateOrCreate(
                ['title' => $moduleData['title']],
                [
                    'description' => $moduleData['description'],
                    'order_index' => $index + 1,
                ]
            );

            foreach ($moduleData['lessons'] as $lessonIndex => $lessonData) {
                $module->lessons()->updateOrCreate(
                    ['title' => $lessonData['title']],
                    [
                        'content' => $lessonData['content'],
                        'duration_minutes' => $lessonData['duration_minutes'],
                        'order_index' => $lessonIndex + 1,
                        'is_published' => true,
                    ]
                );
            }
        }

        $this->command->info('Course structure created successfully!');
        $this->command->info('Course: ' . $course->title);
        $this->command->info('Modules: ' . $course->modules()->count());
        $this->command->info('Total Lessons: ' . Lesson::count());
    }
}
