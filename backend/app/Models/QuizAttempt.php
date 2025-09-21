<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'user_id',
        'attempt_number',
        'started_at',
        'completed_at',
        'score',
        'total_points',
        'earned_points',
        'is_passed',
        'answers',
        'time_spent_seconds',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'score' => 'decimal:2',
        'total_points' => 'decimal:2',
        'earned_points' => 'decimal:2',
        'is_passed' => 'boolean',
        'answers' => 'array',
    ];

    /**
     * Get the quiz that owns the attempt.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    /**
     * Get the user that owns the attempt.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the answers for the attempt.
     */
    public function quizAnswers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }

    /**
     * Calculate and update the score for this attempt.
     */
    public function calculateScore(): void
    {
        $totalPoints = 0;
        $earnedPoints = 0;

        foreach ($this->quizAnswers as $answer) {
            $totalPoints += $answer->points_possible;
            $earnedPoints += $answer->points_earned ?? 0;
        }

        $score = $totalPoints > 0 ? ($earnedPoints / $totalPoints) * 100 : 0;
        $isPassed = $score >= $this->quiz->passing_score;

        $this->update([
            'total_points' => $totalPoints,
            'earned_points' => $earnedPoints,
            'score' => $score,
            'is_passed' => $isPassed,
        ]);
    }

    /**
     * Mark the attempt as completed.
     */
    public function complete(): void
    {
        $this->update([
            'completed_at' => now(),
            'status' => 'completed',
            'time_spent_seconds' => now()->diffInSeconds($this->started_at),
        ]);

        $this->calculateScore();
    }

    /**
     * Check if the attempt is still in progress.
     */
    public function isInProgress(): bool
    {
        return $this->status === 'in_progress';
    }

    /**
     * Check if the attempt has exceeded time limit.
     */
    public function hasExceededTimeLimit(): bool
    {
        if (!$this->quiz->time_limit_minutes) {
            return false;
        }

        $timeLimit = $this->quiz->time_limit_minutes * 60; // Convert to seconds
        $elapsed = now()->diffInSeconds($this->started_at);

        return $elapsed > $timeLimit;
    }

    /**
     * Get remaining time in seconds.
     */
    public function getRemainingTimeSeconds(): ?int
    {
        if (!$this->quiz->time_limit_minutes || !$this->isInProgress()) {
            return null;
        }

        $timeLimit = $this->quiz->time_limit_minutes * 60;
        $elapsed = now()->diffInSeconds($this->started_at);

        return max(0, $timeLimit - $elapsed);
    }
}space App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    //
}
