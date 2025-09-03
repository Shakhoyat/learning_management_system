<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');

        // Create essential users with roles
        $this->createEssentialUsers();

        // Run other seeders in order
        $this->call([
            CategorySeeder::class,
            CourseSeeder::class,
            QuizSeeder::class,
            EnrollmentSeeder::class,
            QuizAttemptSeeder::class,
        ]);

        $this->command->info('✅ Database seeding completed successfully!');
    }

    private function createEssentialUsers(): void
    {
        $this->command->info('👥 Creating essential users...');

        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@lms.com'],
            [
                'name' => 'System Administrator',
                'email' => 'admin@lms.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create Instructor User
        User::updateOrCreate(
            ['email' => 'instructor@lms.com'],
            [
                'name' => 'John Instructor',
                'email' => 'instructor@lms.com',
                'password' => Hash::make('password'),
                'role' => 'instructor',
                'email_verified_at' => now(),
            ]
        );

        // Create Student Users
        for ($i = 1; $i <= 5; $i++) {
            User::updateOrCreate(
                ['email' => "student{$i}@lms.com"],
                [
                    'name' => "Student {$i}",
                    'email' => "student{$i}@lms.com",
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'email_verified_at' => now(),
                ]
            );
        }

        $this->command->info("✅ Created users: 1 admin, 1 instructor, 5 students");
    }
}
