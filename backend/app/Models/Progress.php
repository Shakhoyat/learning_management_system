<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Progress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'completed_at',
        'time_spent',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'time_spent' => 'integer',
    ];

    /**
     * Get the user that owns the progress.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the lesson that the progress belongs to.
     */
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    /**
     * Mark lesson as completed
     */
    public function markAsCompleted($timeSpent = 0)
    {
        $this->update([
            'completed_at' => now(),
            'time_spent' => $timeSpent,
        ]);
    }

    /**
     * Check if lesson is completed
     */
    public function isCompleted()
    {
        return !is_null($this->completed_at);
    }

    /**
     * Get course progress for a user
     */
    public static function getCourseProgress($userId, $courseId)
    {
        return DB::select("
            WITH lesson_progress AS (
                SELECT 
                    l.id as lesson_id,
                    l.module_id,
                    m.course_id,
                    CASE WHEN p.completed_at IS NOT NULL THEN 1 ELSE 0 END as is_completed,
                    p.time_spent,
                    p.completed_at
                FROM lessons l
                JOIN modules m ON l.module_id = m.id
                LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ?
                WHERE m.course_id = ?
            ),
            module_stats AS (
                SELECT 
                    module_id,
                    COUNT(*) as total_lessons,
                    SUM(is_completed) as completed_lessons,
                    SUM(time_spent) as total_time_spent,
                    ROUND(
                        (SUM(is_completed)::float / COUNT(*) * 100)::numeric, 2
                    ) as completion_percentage
                FROM lesson_progress
                GROUP BY module_id
            ),
            course_stats AS (
                SELECT 
                    course_id,
                    COUNT(*) as total_lessons,
                    SUM(is_completed) as completed_lessons,
                    SUM(time_spent) as total_time_spent,
                    ROUND(
                        (SUM(is_completed)::float / COUNT(*) * 100)::numeric, 2
                    ) as completion_percentage
                FROM lesson_progress
                GROUP BY course_id
            )
            SELECT 
                cs.*,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'module_id', ms.module_id,
                        'total_lessons', ms.total_lessons,
                        'completed_lessons', ms.completed_lessons,
                        'completion_percentage', ms.completion_percentage,
                        'total_time_spent', ms.total_time_spent
                    ) ORDER BY ms.module_id
                ) as modules
            FROM course_stats cs
            LEFT JOIN module_stats ms ON cs.course_id = ms.module_id -- This should be a modules table join
            GROUP BY cs.course_id, cs.total_lessons, cs.completed_lessons, cs.total_time_spent, cs.completion_percentage
        ", [$userId, $courseId]);
    }

    /**
     * Get detailed progress analytics for a user
     */
    public static function getUserProgressAnalytics($userId)
    {
        return DB::select("
            WITH lesson_progress AS (
                SELECT 
                    l.id as lesson_id,
                    l.title as lesson_title,
                    l.module_id,
                    m.title as module_title,
                    m.course_id,
                    c.title as course_title,
                    CASE WHEN p.completed_at IS NOT NULL THEN 1 ELSE 0 END as is_completed,
                    p.time_spent,
                    p.completed_at,
                    e.enrolled_at,
                    CASE WHEN e.id IS NOT NULL THEN 1 ELSE 0 END as is_enrolled
                FROM lessons l
                JOIN modules m ON l.module_id = m.id
                JOIN courses c ON m.course_id = c.id
                LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ?
                LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ?
                WHERE e.id IS NOT NULL
            ),
            course_progress AS (
                SELECT 
                    course_id,
                    course_title,
                    enrolled_at,
                    COUNT(*) as total_lessons,
                    SUM(is_completed) as completed_lessons,
                    SUM(time_spent) as total_time_spent,
                    ROUND(
                        (SUM(is_completed)::float / COUNT(*) * 100)::numeric, 2
                    ) as completion_percentage,
                    MAX(completed_at) as last_activity
                FROM lesson_progress
                GROUP BY course_id, course_title, enrolled_at
            )
            SELECT 
                *,
                CASE 
                    WHEN completion_percentage = 100 THEN 'completed'
                    WHEN completion_percentage > 0 THEN 'in_progress'
                    ELSE 'not_started'
                END as status
            FROM course_progress
            ORDER BY last_activity DESC NULLS LAST, enrolled_at DESC
        ", [$userId, $userId]);
    }

    /**
     * Get learning streak for a user
     */
    public static function getLearningStreak($userId)
    {
        return DB::select("
            WITH daily_progress AS (
                SELECT 
                    DATE(completed_at) as completion_date,
                    COUNT(*) as lessons_completed
                FROM progress 
                WHERE user_id = ? 
                AND completed_at IS NOT NULL
                AND completed_at >= CURRENT_DATE - INTERVAL '60 days'
                GROUP BY DATE(completed_at)
                ORDER BY DATE(completed_at) DESC
            ),
            streak_calculation AS (
                SELECT 
                    completion_date,
                    lessons_completed,
                    ROW_NUMBER() OVER (ORDER BY completion_date DESC) as row_num,
                    completion_date - (ROW_NUMBER() OVER (ORDER BY completion_date DESC) - 1) * INTERVAL '1 day' as streak_group
                FROM daily_progress
            )
            SELECT 
                COUNT(*) as current_streak,
                MIN(completion_date) as streak_start,
                MAX(completion_date) as streak_end,
                SUM(lessons_completed) as total_lessons_in_streak
            FROM streak_calculation
            WHERE streak_group = (
                SELECT streak_group 
                FROM streak_calculation 
                WHERE row_num = 1
            )
        ", [$userId]);
    }
}
