<?php

namespace App\Services;

use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\QuizAnswer;
use Illuminate\Support\Facades\DB;

class QuizGradingService
{
    /**
     * Grade a quiz attempt automatically.
     */
    public function gradeAttempt(QuizAttempt $attempt): array
    {
        $totalPoints = 0;
        $earnedPoints = 0;
        $results = [];

        foreach ($attempt->quizAnswers as $answer) {
            $questionResult = $this->gradeAnswer($answer);
            $results[] = $questionResult;
            
            $totalPoints += $questionResult['points_possible'];
            $earnedPoints += $questionResult['points_earned'];
        }

        $score = $totalPoints > 0 ? ($earnedPoints / $totalPoints) * 100 : 0;
        $isPassed = $score >= $attempt->quiz->passing_score;

        $attempt->update([
            'total_points' => $totalPoints,
            'earned_points' => $earnedPoints,
            'score' => round($score, 2),
            'is_passed' => $isPassed,
        ]);

        return [
            'score' => round($score, 2),
            'is_passed' => $isPassed,
            'total_points' => $totalPoints,
            'earned_points' => $earnedPoints,
            'results' => $results,
        ];
    }

    /**
     * Grade a single answer.
     */
    public function gradeAnswer(QuizAnswer $answer): array
    {
        $question = $answer->quizQuestion;
        $isCorrect = $this->checkAnswer($question, $answer->answer);
        
        $pointsEarned = $isCorrect ? $question->points : 0;
        $feedback = $this->generateFeedback($question, $isCorrect, $answer->answer);

        $answer->update([
            'is_correct' => $isCorrect,
            'points_earned' => $pointsEarned,
            'points_possible' => $question->points,
            'feedback' => $feedback,
        ]);

        return [
            'question_id' => $question->id,
            'is_correct' => $isCorrect,
            'points_earned' => $pointsEarned,
            'points_possible' => $question->points,
            'feedback' => $feedback,
        ];
    }

    /**
     * Check if an answer is correct.
     */
    private function checkAnswer(QuizQuestion $question, array $userAnswer): bool
    {
        switch ($question->type) {
            case 'multiple_choice':
                return $this->checkMultipleChoice($question, $userAnswer);
            case 'true_false':
                return $this->checkTrueFalse($question, $userAnswer);
            case 'short_answer':
                return $this->checkShortAnswer($question, $userAnswer);
            default:
                return false;
        }
    }

    /**
     * Check multiple choice answer.
     */
    private function checkMultipleChoice(QuizQuestion $question, array $userAnswer): bool
    {
        $correctAnswers = $question->correct_answers;
        
        // Sort both arrays for comparison
        sort($userAnswer);
        sort($correctAnswers);
        
        return $userAnswer === $correctAnswers;
    }

    /**
     * Check true/false answer.
     */
    private function checkTrueFalse(QuizQuestion $question, array $userAnswer): bool
    {
        if (count($userAnswer) !== 1) {
            return false;
        }

        $userChoice = $userAnswer[0];
        $correctAnswer = $question->correct_answers[0];

        // Handle both boolean and string representations
        if (is_bool($userChoice)) {
            return $userChoice === $correctAnswer;
        }

        // Convert string to boolean
        $userBool = filter_var($userChoice, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        return $userBool === $correctAnswer;
    }

    /**
     * Check short answer.
     */
    private function checkShortAnswer(QuizQuestion $question, array $userAnswer): bool
    {
        if (count($userAnswer) !== 1) {
            return false;
        }

        $userText = trim($userAnswer[0]);
        $correctAnswers = $question->correct_answers;

        foreach ($correctAnswers as $correctAnswer) {
            $correctText = trim($correctAnswer);
            
            $isMatch = $question->case_sensitive 
                ? $userText === $correctText
                : strcasecmp($userText, $correctText) === 0;
                
            if ($isMatch) {
                return true;
            }
        }

        return false;
    }

    /**
     * Generate feedback for the answer.
     */
    private function generateFeedback(QuizQuestion $question, bool $isCorrect, array $userAnswer): string
    {
        if ($isCorrect) {
            return 'Correct! ' . ($question->explanation ?? '');
        }

        $feedback = 'Incorrect. ';
        
        if ($question->explanation) {
            $feedback .= $question->explanation;
        } else {
            $feedback .= $this->getDefaultFeedback($question, $userAnswer);
        }

        return $feedback;
    }

    /**
     * Get default feedback when no explanation is provided.
     */
    private function getDefaultFeedback(QuizQuestion $question, array $userAnswer): string
    {
        switch ($question->type) {
            case 'multiple_choice':
                $correctOptions = [];
                foreach ($question->correct_answers as $index) {
                    if (isset($question->options[$index])) {
                        $correctOptions[] = chr(65 + $index) . '. ' . $question->options[$index];
                    }
                }
                return 'The correct answer(s): ' . implode(', ', $correctOptions);
                
            case 'true_false':
                $correctAnswer = $question->correct_answers[0] ? 'True' : 'False';
                return "The correct answer is: {$correctAnswer}";
                
            case 'short_answer':
                return 'Acceptable answers include: ' . implode(', ', $question->correct_answers);
                
            default:
                return 'Please review the material and try again.';
        }
    }

    /**
     * Calculate quiz statistics.
     */
    public function calculateQuizStatistics(int $quizId): array
    {
        $stats = DB::select("
            WITH attempt_stats AS (
                SELECT 
                    user_id,
                    MAX(score) as best_score,
                    COUNT(*) as attempt_count,
                    AVG(score) as avg_score,
                    MAX(CASE WHEN is_passed THEN 1 ELSE 0 END) as ever_passed
                FROM quiz_attempts 
                WHERE quiz_id = ? AND status = 'completed'
                GROUP BY user_id
            )
            SELECT 
                COUNT(*) as total_students,
                AVG(best_score) as average_best_score,
                AVG(attempt_count) as average_attempts,
                COUNT(CASE WHEN ever_passed = 1 THEN 1 END) as students_passed,
                ROUND(
                    (COUNT(CASE WHEN ever_passed = 1 THEN 1 END)::DECIMAL / COUNT(*)) * 100,
                    2
                ) as pass_rate
            FROM attempt_stats
        ", [$quizId]);

        $questionStats = DB::select("
            SELECT 
                qq.id,
                qq.question,
                qq.type,
                COUNT(qa.id) as total_answers,
                COUNT(CASE WHEN qa.is_correct THEN 1 END) as correct_answers,
                ROUND(
                    (COUNT(CASE WHEN qa.is_correct THEN 1 END)::DECIMAL / COUNT(qa.id)) * 100,
                    2
                ) as success_rate
            FROM quiz_questions qq
            LEFT JOIN quiz_answers qa ON qq.id = qa.quiz_question_id
            LEFT JOIN quiz_attempts qat ON qa.quiz_attempt_id = qat.id
            WHERE qq.quiz_id = ? AND qat.status = 'completed'
            GROUP BY qq.id, qq.question, qq.type
            ORDER BY qq.order_position
        ", [$quizId]);

        return [
            'overview' => $stats[0] ?? null,
            'questions' => $questionStats,
        ];
    }
}