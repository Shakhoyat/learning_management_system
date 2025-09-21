<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'instructions',
        'lesson_id',
        'time_limit_minutes',
        'max_attempts',
        'passing_score',
        'shuffle_questions',
        'show_results_immediately',
        'allow_review',
        'is_published',
        'available_from',
        'available_until',
    ];

    protected $casts = [
        'passing_score' => 'decimal:2',
        'shuffle_questions' => 'boolean',
        'show_results_immediately' => 'boolean',
        'allow_review' => 'boolean',
        'is_published' => 'boolean',
        'available_from' => 'datetime',
        'available_until' => 'datetime',
    ];

    /**
     * Get the lesson that owns the quiz.
     */
    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Get the questions for the quiz.
     */
    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('order_position');
    }

    /**
     * Get the attempts for the quiz.
     */
    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    /**
     * Check if the quiz is available for taking.
     */
    public function isAvailable(): bool
    {
        if (!$this->is_published) {
            return false;
        }

        $now = now();

        if ($this->available_from && $now->lt($this->available_from)) {
            return false;
        }

        if ($this->available_until && $now->gt($this->available_until)) {
            return false;
        }

        return true;
    }

    /**
     * Get the total points for the quiz.
     */
    public function getTotalPointsAttribute(): float
    {
        return $this->questions()->sum('points');
    }

    /**
     * Get user's attempt count for this quiz.
     */
    public function getUserAttemptCount(int $userId): int
    {
        return $this->attempts()->where('user_id', $userId)->count();
    }

    /**
     * Check if user can take the quiz.
     */
    public function canUserTake(int $userId): bool
    {
        if (!$this->isAvailable()) {
            return false;
        }

        $attemptCount = $this->getUserAttemptCount($userId);
        return $attemptCount < $this->max_attempts;
    }
}space App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    //
}
