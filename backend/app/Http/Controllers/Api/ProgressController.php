<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Progress;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProgressController extends Controller
{
    /**
     * Mark a lesson as completed
     */
    public function completeLesson(Request $request, Lesson $lesson)
    {
        $user = Auth::user();

        // Check if user is enrolled in the course
        $enrollment = Enrollment::where('user_id', $user->id)
                               ->where('course_id', $lesson->module->course_id)
                               ->where('status', Enrollment::STATUS_ACTIVE)
                               ->first();

        if (!$enrollment) {
            return response()->json([
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'time_spent' => 'nullable|integer|min:0|max:86400', // Max 24 hours in seconds
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Create or update progress record
            $progress = Progress::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'lesson_id' => $lesson->id,
                ],
                [
                    'completed_at' => now(),
                    'time_spent' => $request->input('time_spent', 0),
                ]
            );

            // Update enrollment progress
            $this->updateEnrollmentProgress($enrollment);

            DB::commit();

            return response()->json([
                'message' => 'Lesson marked as completed',
                'progress' => $progress,
                'course_progress' => $this->getCourseProgressSummary($user->id, $lesson->module->course_id)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Failed to mark lesson as completed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's progress for a specific course
     */
    public function getCourseProgress(Request $request, Course $course)
    {
        $user = Auth::user();

        // Check if user is enrolled
        $enrollment = Enrollment::where('user_id', $user->id)
                               ->where('course_id', $course->id)
                               ->first();

        if (!$enrollment) {
            return response()->json([
                'message' => 'You are not enrolled in this course'
            ], 403);
        }

        $progressData = Progress::getCourseProgress($user->id, $course->id);

        return response()->json([
            'course' => $course->only(['id', 'title', 'slug']),
            'enrollment' => $enrollment,
            'progress' => $progressData[0] ?? null,
        ]);
    }

    /**
     * Get user's overall progress analytics
     */
    public function getUserAnalytics(Request $request)
    {
        $user = Auth::user();

        $analytics = Progress::getUserProgressAnalytics($user->id);
        $streak = Progress::getLearningStreak($user->id);

        // Get recent activity (last 10 completed lessons)
        $recentActivity = Progress::with(['lesson.module.course'])
                                ->where('user_id', $user->id)
                                ->whereNotNull('completed_at')
                                ->orderBy('completed_at', 'desc')
                                ->limit(10)
                                ->get();

        // Calculate total statistics
        $totalStats = DB::select("
            SELECT 
                COUNT(DISTINCT e.course_id) as total_courses_enrolled,
                COUNT(DISTINCT p.lesson_id) as total_lessons_completed,
                SUM(p.time_spent) as total_time_spent,
                COUNT(DISTINCT DATE(p.completed_at)) as active_days
            FROM enrollments e
            LEFT JOIN lessons l ON l.course_id = e.course_id
            LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = e.user_id
            WHERE e.user_id = ?
        ", [$user->id]);

        return response()->json([
            'user' => $user->only(['id', 'name', 'email']),
            'course_progress' => $analytics,
            'learning_streak' => $streak[0] ?? null,
            'recent_activity' => $recentActivity,
            'total_statistics' => $totalStats[0] ?? null,
        ]);
    }

    /**
     * Get instructor analytics for their courses
     */
    public function getInstructorAnalytics(Request $request)
    {
        $user = Auth::user();

        if (!$user->isInstructor() && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Access denied. Instructor role required.'
            ], 403);
        }

        // Get courses taught by this instructor
        $courseQuery = Course::where('instructor_id', $user->id);
        
        if ($user->isAdmin()) {
            // Admins can see all courses
            $courseQuery = Course::query();
        }

        $courses = $courseQuery->with(['category', 'instructor'])->get();

        $analytics = [];

        foreach ($courses as $course) {
            $courseAnalytics = DB::select("
                WITH course_lessons AS (
                    SELECT l.id as lesson_id
                    FROM lessons l
                    JOIN modules m ON l.module_id = m.id
                    WHERE m.course_id = ?
                ),
                enrollment_progress AS (
                    SELECT 
                        e.user_id,
                        e.enrolled_at,
                        u.name as student_name,
                        COUNT(cl.lesson_id) as total_lessons,
                        COUNT(p.lesson_id) as completed_lessons,
                        ROUND(
                            (COUNT(p.lesson_id)::float / COUNT(cl.lesson_id) * 100)::numeric, 2
                        ) as completion_percentage,
                        SUM(p.time_spent) as total_time_spent,
                        MAX(p.completed_at) as last_activity
                    FROM enrollments e
                    JOIN users u ON e.user_id = u.id
                    CROSS JOIN course_lessons cl
                    LEFT JOIN progress p ON p.lesson_id = cl.lesson_id AND p.user_id = e.user_id
                    WHERE e.course_id = ?
                    GROUP BY e.user_id, e.enrolled_at, u.name
                )
                SELECT 
                    COUNT(*) as total_students,
                    AVG(completion_percentage) as avg_completion_percentage,
                    COUNT(CASE WHEN completion_percentage = 100 THEN 1 END) as completed_students,
                    COUNT(CASE WHEN completion_percentage > 0 AND completion_percentage < 100 THEN 1 END) as in_progress_students,
                    COUNT(CASE WHEN completion_percentage = 0 THEN 1 END) as not_started_students,
                    SUM(total_time_spent) as total_course_time,
                    MAX(last_activity) as most_recent_activity
                FROM enrollment_progress
            ", [$course->id, $course->id]);

            $analytics[] = [
                'course' => $course,
                'statistics' => $courseAnalytics[0] ?? null,
            ];
        }

        return response()->json([
            'instructor' => $user->only(['id', 'name', 'email']),
            'course_analytics' => $analytics,
        ]);
    }

    /**
     * Get detailed student progress for a specific course (instructor only)
     */
    public function getCourseStudentProgress(Request $request, Course $course)
    {
        $user = Auth::user();

        if (!$user->isInstructor() && !$user->isAdmin()) {
            return response()->json([
                'message' => 'Access denied. Instructor role required.'
            ], 403);
        }

        if (!$user->isAdmin() && $course->instructor_id !== $user->id) {
            return response()->json([
                'message' => 'Access denied. You can only view your own courses.'
            ], 403);
        }

        $studentProgress = DB::select("
            WITH course_lessons AS (
                SELECT l.id as lesson_id, l.title as lesson_title, m.title as module_title
                FROM lessons l
                JOIN modules m ON l.module_id = m.id
                WHERE m.course_id = ?
                ORDER BY m.order_index, l.order_index
            ),
            student_progress AS (
                SELECT 
                    e.user_id,
                    u.name as student_name,
                    u.email as student_email,
                    e.enrolled_at,
                    cl.lesson_id,
                    cl.lesson_title,
                    cl.module_title,
                    p.completed_at,
                    p.time_spent,
                    CASE WHEN p.completed_at IS NOT NULL THEN 1 ELSE 0 END as is_completed
                FROM enrollments e
                JOIN users u ON e.user_id = u.id
                CROSS JOIN course_lessons cl
                LEFT JOIN progress p ON p.lesson_id = cl.lesson_id AND p.user_id = e.user_id
                WHERE e.course_id = ?
            )
            SELECT 
                user_id,
                student_name,
                student_email,
                enrolled_at,
                COUNT(*) as total_lessons,
                SUM(is_completed) as completed_lessons,
                ROUND(
                    (SUM(is_completed)::float / COUNT(*) * 100)::numeric, 2
                ) as completion_percentage,
                SUM(time_spent) as total_time_spent,
                MAX(completed_at) as last_activity,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'lesson_title', lesson_title,
                        'module_title', module_title,
                        'completed_at', completed_at,
                        'time_spent', time_spent,
                        'is_completed', is_completed::boolean
                    ) ORDER BY lesson_id
                ) as lesson_details
            FROM student_progress
            GROUP BY user_id, student_name, student_email, enrolled_at
            ORDER BY completion_percentage DESC, last_activity DESC
        ", [$course->id, $course->id]);

        return response()->json([
            'course' => $course->only(['id', 'title', 'slug']),
            'student_progress' => $studentProgress,
        ]);
    }

    /**
     * Update enrollment progress percentage
     */
    private function updateEnrollmentProgress(Enrollment $enrollment)
    {
        $progressData = Progress::getCourseProgress($enrollment->user_id, $enrollment->course_id);
        
        if (!empty($progressData)) {
            $completionPercentage = $progressData[0]->completion_percentage ?? 0;
            
            $enrollment->updateProgress($completionPercentage);
        }
    }

    /**
     * Get course progress summary
     */
    private function getCourseProgressSummary($userId, $courseId)
    {
        $progressData = Progress::getCourseProgress($userId, $courseId);
        return $progressData[0] ?? null;
    }
}
