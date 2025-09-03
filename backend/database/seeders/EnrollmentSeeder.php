<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Progress;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('📝 Creating sample enrollments and progress...');

        $students = User::where('role', 'student')->get();
        $courses = Course::where('is_published', true)->get();

        if ($students->isEmpty() || $courses->isEmpty()) {
            $this->command->error('❌ No students or courses found. Run users and courses seeders first.');
            return;
        }

        $enrollmentCount = 0;
        $progressCount = 0;

        foreach ($students as $student) {
            // Each student enrolls in 1-3 random courses
            $coursesToEnroll = $courses->random(rand(1, 3));

            foreach ($coursesToEnroll as $course) {
                // Create enrollment
                $enrollment = Enrollment::updateOrCreate(
                    [
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                    ],
                    [
                        'status' => Enrollment::STATUS_ACTIVE,
                        'enrolled_at' => now()->subDays(rand(1, 30)),
                        'progress_percentage' => 0,
                    ]
                );

                // Create transaction for paid courses
                if (!$course->isFree()) {
                    Transaction::updateOrCreate(
                        [
                            'enrollment_id' => $enrollment->id,
                        ],
                        [
                            'user_id' => $student->id,
                            'course_id' => $course->id,
                            'amount' => $course->getEffectivePrice(),
                            'currency' => 'USD',
                            'payment_method' => ['card', 'paypal', 'bank_transfer'][rand(0, 2)],
                            'status' => 'completed',
                            'transaction_id' => 'txn_' . Str::random(12),
                            'gateway_response' => json_encode([
                                'status' => 'success',
                                'transaction_id' => 'gateway_' . Str::random(10),
                                'timestamp' => now()->toISOString(),
                            ]),
                        ]
                    );
                }

                $enrollmentCount++;

                // Create random progress for some lessons
                $lessons = $course->modules()->with('lessons')->get()->pluck('lessons')->flatten();
                $completedLessons = $lessons->random(rand(0, min(3, $lessons->count())));

                foreach ($completedLessons as $lesson) {
                    Progress::updateOrCreate(
                        [
                            'user_id' => $student->id,
                            'lesson_id' => $lesson->id,
                        ],
                        [
                            'completed_at' => now()->subDays(rand(1, 20)),
                            'time_spent' => rand(300, 1800), // 5-30 minutes
                        ]
                    );
                    $progressCount++;
                }

                // Update enrollment progress percentage
                $totalLessons = $lessons->count();
                $completedCount = $completedLessons->count();
                $progressPercentage = $totalLessons > 0 ? ($completedCount / $totalLessons) * 100 : 0;

                $enrollment->update(['progress_percentage' => round($progressPercentage)]);
            }
        }

        $this->command->info("✅ Created {$enrollmentCount} enrollments with {$progressCount} progress records");
    }
}
