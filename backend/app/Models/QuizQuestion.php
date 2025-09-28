<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable = [
        'quiz_id',
        'type',
        'question',
        'options',
        'correct_answers',
        'explanation',
        'points',
        'order_position',
        'case_sensitive'
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answers' => 'array',
        'points' => 'decimal:2',
        'case_sensitive' => 'boolean',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
