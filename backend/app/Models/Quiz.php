<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'title', 'description', 'instructions', 'lesson_id',
        'time_limit_minutes', 'max_attempts', 'passing_score',
        'shuffle_questions', 'show_results_immediately', 'allow_review',
        'is_published', 'available_from', 'available_until'
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

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('order_position');
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }
}
