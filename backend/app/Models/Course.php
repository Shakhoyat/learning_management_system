<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'thumbnail',
        'price',
        'discount_price',
        'duration_hours',
        'level',
        'language',
        'is_published',
        'is_featured',
        'category_id',
        'instructor_id',
        'max_students',
        'requirements',
        'what_you_learn',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'requirements' => 'array',
        'what_you_learn' => 'array',
    ];

    /**
     * Get the instructor that owns the course.
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the category that owns the course.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the modules for the course.
     */
    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    /**
     * Get the enrollments for the course.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the students enrolled in the course.
     */
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('enrolled_at', 'completed_at', 'progress_percentage')
            ->withTimestamps();
    }

    /**
     * Get all lessons through modules.
     */
    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Module::class);
    }

    /**
     * Check if the course is free.
     */
    public function isFree()
    {
        return $this->price == 0;
    }

    /**
     * Get the effective price (with discount if available).
     */
    public function getEffectivePrice()
    {
        return $this->discount_price ?: $this->price;
    }

    /**
     * Get the total number of lessons.
     */
    public function getTotalLessonsAttribute()
    {
        return $this->lessons()->count();
    }

    /**
     * Get the total number of enrolled students.
     */
    public function getTotalStudentsAttribute()
    {
        return $this->enrollments()->count();
    }

    /**
     * Get progress for a specific user
     */
    public function getProgressForUser($userId)
    {
        $totalLessons = $this->lessons()->count();
        
        if ($totalLessons === 0) {
            return 0;
        }

        $completedLessons = Progress::whereIn('lesson_id', $this->lessons()->pluck('id'))
                                  ->where('user_id', $userId)
                                  ->whereNotNull('completed_at')
                                  ->count();

        return round(($completedLessons / $totalLessons) * 100, 2);
    }

    /**
     * Get overall course completion statistics
     */
    public function getCompletionStatistics()
    {
        $totalStudents = $this->enrollments()->count();
        
        if ($totalStudents === 0) {
            return [
                'total_students' => 0,
                'completed_students' => 0,
                'in_progress_students' => 0,
                'not_started_students' => 0,
                'average_completion' => 0,
            ];
        }

        $lessonIds = $this->lessons()->pluck('id');
        $totalLessons = $lessonIds->count();

        $studentProgress = DB::select("
            SELECT 
                e.user_id,
                COUNT(p.lesson_id) as completed_lessons,
                ROUND((COUNT(p.lesson_id)::float / ? * 100)::numeric, 2) as completion_percentage
            FROM enrollments e
            LEFT JOIN progress p ON p.user_id = e.user_id 
                AND p.lesson_id = ANY(?)
                AND p.completed_at IS NOT NULL
            WHERE e.course_id = ?
            GROUP BY e.user_id
        ", [$totalLessons, '{' . $lessonIds->implode(',') . '}', $this->id]);

        $completed = 0;
        $inProgress = 0;
        $notStarted = 0;
        $totalCompletion = 0;

        foreach ($studentProgress as $progress) {
            $percentage = $progress->completion_percentage;
            $totalCompletion += $percentage;
            
            if ($percentage == 100) {
                $completed++;
            } elseif ($percentage > 0) {
                $inProgress++;
            } else {
                $notStarted++;
            }
        }

        return [
            'total_students' => $totalStudents,
            'completed_students' => $completed,
            'in_progress_students' => $inProgress,
            'not_started_students' => $notStarted,
            'average_completion' => $totalStudents > 0 ? round($totalCompletion / $totalStudents, 2) : 0,
        ];
    }
}
