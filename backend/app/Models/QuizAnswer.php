<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_attempt_id',
        'quiz_question_id',
        'answer',
        'is_correct',
        'points_earned',
        'points_possible',
        'feedback',
    ];

    protected $casts = [
        'answer' => 'array',
        'is_correct' => 'boolean',
        'points_earned' => 'decimal:2',
        'points_possible' => 'decimal:2',
    ];

    /**
     * Get the quiz attempt that owns the answer.
     */
    public function quizAttempt(): BelongsTo
    {
        return $this->belongsTo(QuizAttempt::class);
    }

    /**
     * Get the quiz question that owns the answer.
     */
    public function quizQuestion(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class);
    }

    /**
     * Grade this answer automatically.
     */
    public function grade(): void
    {
        $question = $this->quizQuestion;
        $isCorrect = $question->isCorrectAnswer($this->answer);
        
        $pointsEarned = $isCorrect ? $question->points : 0;
        
        $this->update([
            'is_correct' => $isCorrect,
            'points_earned' => $pointsEarned,
            'points_possible' => $question->points,
            'feedback' => $isCorrect ? 'Correct!' : $question->explanation,
        ]);
    }

    /**
     * Get formatted answer for display.
     */
    public function getFormattedAnswerAttribute(): string
    {
        $question = $this->quizQuestion;
        
        switch ($question->type) {
            case 'multiple_choice':
                return $this->formatMultipleChoiceAnswer();
            case 'true_false':
                return $this->answer[0] ? 'True' : 'False';
            case 'short_answer':
                return $this->answer[0] ?? '';
            default:
                return '';
        }
    }

    /**
     * Format multiple choice answer for display.
     */
    private function formatMultipleChoiceAnswer(): string
    {
        $question = $this->quizQuestion;
        $selectedOptions = [];
        
        foreach ($this->answer as $index) {
            if (isset($question->options[$index])) {
                $selectedOptions[] = chr(65 + $index) . '. ' . $question->options[$index];
            }
        }
        
        return implode(', ', $selectedOptions);
    }
}space App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizAnswer extends Model
{
    //
}
