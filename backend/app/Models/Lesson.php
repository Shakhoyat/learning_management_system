<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'title',
        'content',
        'video_url',
        'duration_minutes',
        'order_index',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'order_index' => 'integer',
        'duration_minutes' => 'integer',
    ];

    /**
     * Get the module that owns the lesson.
     */
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    /**
     * Get the course through the module.
     */
    public function course()
    {
        return $this->hasOneThrough(Course::class, Module::class, 'id', 'id', 'module_id', 'course_id');
    }

    /**
     * Get the progress records for this lesson.
     */
    public function progress()
    {
        return $this->hasMany(Progress::class);
    }

    /**
     * Check if lesson is completed by a specific user
     */
    public function isCompletedBy($userId)
    {
        return $this->progress()
                   ->where('user_id', $userId)
                   ->whereNotNull('completed_at')
                   ->exists();
    }

    /**
     * Get completion percentage for this lesson across all enrolled students
     */
    public function getCompletionRate()
    {
        $totalEnrolled = $this->module->course->enrollments()->count();
        
        if ($totalEnrolled === 0) {
            return 0;
        }

        $completedCount = $this->progress()
                             ->whereNotNull('completed_at')
                             ->count();

        return round(($completedCount / $totalEnrolled) * 100, 2);
    }
}
