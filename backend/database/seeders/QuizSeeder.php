<?php

namespace Database\Seeders;

use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Lesson;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuizSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some lessons to attach quizzes to
        $lessons = Lesson::take(3)->get();

        if ($lessons->isEmpty()) {
            $this->command->warn('No lessons found. Please run CourseSeeder first.');
            return;
        }

        foreach ($lessons as $lesson) {
            // Create a quiz for each lesson
            $quiz = $lesson->quizzes()->create([
                'title' => "Quiz: {$lesson->title}",
                'description' => "Test your knowledge of {$lesson->title}",
                'instructions' => 'Please read each question carefully and select the best answer(s).',
                'time_limit_minutes' => 30,
                'max_attempts' => 3,
                'passing_score' => 70.0,
                'shuffle_questions' => true,
                'show_results_immediately' => true,
                'allow_review' => true,
                'is_published' => true,
                'available_from' => now(),
                'available_until' => now()->addMonths(6),
            ]);

            // Add sample questions
            $this->addSampleQuestions($quiz);
        }

        $this->command->info('Sample quizzes created successfully!');
    }

    private function addSampleQuestions(Quiz $quiz): void
    {
        // Multiple Choice Question
        $quiz->questions()->create([
            'type' => 'multiple_choice',
            'question' => 'Which of the following are primary colors? (Select all that apply)',
            'options' => ['Red', 'Green', 'Blue', 'Yellow', 'Purple'],
            'correct_answers' => [0, 2, 3], // Red, Blue, Yellow
            'explanation' => 'The primary colors are red, blue, and yellow. All other colors can be created by mixing these.',
            'points' => 2.0,
            'order_position' => 1,
        ]);

        // True/False Question
        $quiz->questions()->create([
            'type' => 'true_false',
            'question' => 'The Earth revolves around the Sun.',
            'options' => null,
            'correct_answers' => [true],
            'explanation' => 'True. The Earth orbits around the Sun in an elliptical path, completing one orbit approximately every 365.25 days.',
            'points' => 1.0,
            'order_position' => 2,
        ]);

        // Short Answer Question
        $quiz->questions()->create([
            'type' => 'short_answer',
            'question' => 'What is the capital of France?',
            'options' => null,
            'correct_answers' => ['Paris', 'paris'],
            'explanation' => 'Paris is the capital and largest city of France.',
            'points' => 1.0,
            'order_position' => 3,
            'case_sensitive' => false,
        ]);

        // Another Multiple Choice (single answer)
        $quiz->questions()->create([
            'type' => 'multiple_choice',
            'question' => 'What is 2 + 2?',
            'options' => ['3', '4', '5', '6'],
            'correct_answers' => [1], // 4
            'explanation' => '2 + 2 equals 4.',
            'points' => 1.0,
            'order_position' => 4,
        ]);

        // Complex Short Answer
        $quiz->questions()->create([
            'type' => 'short_answer',
            'question' => 'Name the largest ocean on Earth.',
            'options' => null,
            'correct_answers' => ['Pacific Ocean', 'Pacific', 'pacific ocean', 'pacific'],
            'explanation' => 'The Pacific Ocean is the largest and deepest ocean on Earth.',
            'points' => 1.5,
            'order_position' => 5,
            'case_sensitive' => false,
        ]);

        // Another True/False
        $quiz->questions()->create([
            'type' => 'true_false',
            'question' => 'HTML stands for HyperText Markup Language.',
            'options' => null,
            'correct_answers' => [true],
            'explanation' => 'True. HTML (HyperText Markup Language) is the standard markup language for creating web pages.',
            'points' => 1.0,
            'order_position' => 6,
        ]);
    }
}
