<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'type',
        'question',
        'options',
        'correct_answers',
        'explanation',
        'points',
        'order_position',
        'case_sensitive',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answers' => 'array',
        'points' => 'decimal:2',
        'case_sensitive' => 'boolean',
    ];

    /**
     * Get the quiz that owns the question.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the answers for the question.
     */
    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    /**
     * Check if the given answer is correct.
     */
    public function isCorrectAnswer(array $userAnswer): bool
    {
        switch ($this->type) {
            case 'multiple_choice':
                return $this->checkMultipleChoiceAnswer($userAnswer);
            case 'true_false':
                return $this->checkTrueFalseAnswer($userAnswer);
            case 'short_answer':
                return $this->checkShortAnswer($userAnswer);
            default:
                return false;
        }
    }

    /**
     * Check multiple choice answer.
     */
    private function checkMultipleChoiceAnswer(array $userAnswer): bool
    {
        sort($userAnswer);
        $correctAnswers = $this->correct_answers;
        sort($correctAnswers);
        
        return $userAnswer === $correctAnswers;
    }

    /**
     * Check true/false answer.
     */
    private function checkTrueFalseAnswer(array $userAnswer): bool
    {
        return count($userAnswer) === 1 && $userAnswer[0] === $this->correct_answers[0];
    }

    /**
     * Check short answer.
     */
    private function checkShortAnswer(array $userAnswer): bool
    {
        if (count($userAnswer) !== 1) {
            return false;
        }

        $userAnswerText = $userAnswer[0];
        
        foreach ($this->correct_answers as $correctAnswer) {
            $comparison = $this->case_sensitive 
                ? $userAnswerText === $correctAnswer
                : strtolower($userAnswerText) === strtolower($correctAnswer);
                
            if ($comparison) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get formatted options for display.
     */
    public function getFormattedOptions(): array
    {
        if ($this->type !== 'multiple_choice') {
            return [];
        }

        return collect($this->options)->map(function ($option, $index) {
            return [
                'index' => $index,
                'text' => $option,
                'label' => chr(65 + $index), // A, B, C, D...
            ];
        })->toArray();
    }
}space App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    //
}
