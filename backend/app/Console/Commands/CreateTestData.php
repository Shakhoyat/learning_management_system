<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Console\Command;

class CreateTestData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:create-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test data for the LMS system';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating test data...');

        // Create instructor if not exists
        $instructor = User::where('role', 'instructor')->first();
        if (!$instructor) {
            $instructor = User::create([
                'name' => 'Test Instructor',
                'email' => 'instructor@example.com',
                'password' => bcrypt('password'),
                'role' => 'instructor',
                'email_verified_at' => now()
            ]);
            $this->info('Created instructor: ' . $instructor->email);
        } else {
            $this->info('Using existing instructor: ' . $instructor->email);
        }

        // Create student if not exists  
        $student = User::where('role', 'student')->first();
        if (!$student) {
            $student = User::create([
                'name' => 'Test Student',
                'email' => 'student@example.com',
                'password' => bcrypt('password'),
                'role' => 'student',
                'email_verified_at' => now()
            ]);
            $this->info('Created student: ' . $student->email);
        } else {
            $this->info('Using existing student: ' . $student->email);
        }

        // Create category
        $category = Category::firstOrCreate(
            ['slug' => 'programming'],
            [
                'name' => 'Programming',
                'description' => 'Learn programming languages',
                'is_active' => true
            ]
        );
        $this->info('Category: ' . $category->name);

        // Create a free course
        $freeCourse = Course::create([
            'title' => 'Free PHP Fundamentals',
            'slug' => 'free-php-fundamentals',
            'short_description' => 'Learn PHP programming for free',
            'description' => 'Complete PHP course covering all fundamentals',
            'price' => 0.00,
            'instructor_id' => $instructor->id,
            'category_id' => $category->id,
            'level' => 'beginner',
            'duration_hours' => 10,
            'is_active' => true,
            'is_featured' => false
        ]);

        // Create a paid course
        $paidCourse = Course::create([
            'title' => 'Advanced Laravel Mastery',
            'slug' => 'advanced-laravel-mastery',
            'short_description' => 'Master the Laravel framework',
            'description' => 'Complete Laravel course for professional developers',
            'price' => 99.99,
            'discount_price' => 79.99,
            'instructor_id' => $instructor->id,
            'category_id' => $category->id,
            'level' => 'advanced',
            'duration_hours' => 25,
            'max_students' => 100,
            'is_active' => true,
            'is_featured' => true
        ]);

        $this->info('Created courses:');
        $this->info('- Free course: ' . $freeCourse->title . ' (ID: ' . $freeCourse->id . ')');
        $this->info('- Paid course: ' . $paidCourse->title . ' (ID: ' . $paidCourse->id . ')');
        
        $this->info('Test data created successfully!');
        $this->info('');
        $this->info('You can now test enrollment with these courses:');
        $this->info('Login as student: student@example.com / password');
        $this->info('Free course ID: ' . $freeCourse->id);
        $this->info('Paid course ID: ' . $paidCourse->id);

        return 0;
    }
}
