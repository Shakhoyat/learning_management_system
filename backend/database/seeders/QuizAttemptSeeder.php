<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizAnswer;
use App\Models\Enrollment;
use Illuminate\Database\Seeder;

class QuizAttemptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🎯 Creating sample quiz attempts and answers...');

        $students = User::where('role', 'student')->get();
        $quizzes = Quiz::where('is_published', true)->with('questions')->get();

        if ($students->isEmpty() || $quizzes->isEmpty()) {
            $this->command->warn('⚠️ No students or quizzes found. Skipping quiz attempts.');
            return;
        }

        $attemptCount = 0;
        $answerCount = 0;

        foreach ($students as $student) {
            // Get courses the student is enrolled in
            $enrolledCourses = Enrollment::where('user_id', $student->id)
                ->where('status', Enrollment::STATUS_ACTIVE)
                ->with('course.modules.lessons.quizzes')
                ->get()
                ->pluck('course')
                ->flatMap(function ($course) {
                    return $course->modules->flatMap(function ($module) {
                        return $module->lessons->flatMap(function ($lesson) {
                            return $lesson->quizzes ?? collect();
                        });
                    });
                });

            if ($enrolledCourses->isEmpty()) {
                continue;
            }

            // Each student attempts 1-2 quizzes
            $quizzesToAttempt = $enrolledCourses->intersect($quizzes)->take(rand(1, 2));

            foreach ($quizzesToAttempt as $quiz) {
                if ($quiz->questions->isEmpty()) {
                    continue;
                }

                // Create quiz attempt
                $attempt = QuizAttempt::create([
                    'quiz_id' => $quiz->id,
                    'user_id' => $student->id,
                    'attempt_number' => 1,
                    'started_at' => now()->subDays(rand(1, 15)),
                    'completed_at' => now()->subDays(rand(1, 15))->addMinutes(rand(10, 45)),
                    'status' => 'completed',
                    'time_spent_seconds' => rand(600, 2700), // 10-45 minutes
                ]);

                $attemptCount++;

                $totalPoints = 0;
                $earnedPoints = 0;

                // Create answers for each question
                foreach ($quiz->questions as $question) {
                    $isCorrect = rand(1, 100) <= 75; // 75% chance of correct answer
                    $pointsEarned = $isCorrect ? $question->points : 0;

                    $answer = $this->generateAnswer($question, $isCorrect);

                    QuizAnswer::create([
                        'quiz_attempt_id' => $attempt->id,
                        'quiz_question_id' => $question->id,
                        'answer' => $answer,
                        'is_correct' => $isCorrect,
                        'points_earned' => $pointsEarned,
                        'points_possible' => $question->points,
                        'feedback' => $isCorrect ? 'Correct!' : $question->explanation,
                    ]);

                    $totalPoints += $question->points;
                    $earnedPoints += $pointsEarned;
                    $answerCount++;
                }

                // Update attempt with final scores
                $score = $totalPoints > 0 ? ($earnedPoints / $totalPoints) * 100 : 0;
                $isPassed = $score >= $quiz->passing_score;

                $attempt->update([
                    'total_points' => $totalPoints,
                    'earned_points' => $earnedPoints,
                    'score' => round($score, 2),
                    'is_passed' => $isPassed,
                ]);
            }
        }

        $this->command->info("✅ Created {$attemptCount} quiz attempts with {$answerCount} answers");
    }

    private function generateAnswer($question, $isCorrect)
    {
        switch ($question->type) {
            case 'multiple_choice':
                if ($isCorrect) {
                    return $question->correct_answers;
                } else {
                    // Return random wrong answers
                    $optionCount = count($question->options);
                    $wrongAnswers = [];
                    for ($i = 0; $i < $optionCount; $i++) {
                        if (!in_array($i, $question->correct_answers)) {
                            $wrongAnswers[] = $i;
                        }
                    }
                    return $wrongAnswers ? [array_rand(array_flip($wrongAnswers))] : [0];
                }

            case 'true_false':
                if ($isCorrect) {
                    return $question->correct_answers;
                } else {
                    return [!$question->correct_answers[0]];
                }

            case 'short_answer':
                if ($isCorrect) {
                    return [$question->correct_answers[0]];
                } else {
                    return ['Wrong answer'];
                }

            default:
                return [];
        }
    }
}
