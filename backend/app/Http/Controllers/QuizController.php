<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class QuizController extends Controller
{
    /**
     * Get all quizzes for a lesson.
     */
    public function index(Request $request, Lesson $lesson): JsonResponse
    {
        $user = Auth::user();
        $isInstructor = $user && $user->hasRole('instructor');

        $quizzes = $lesson->quizzes()
            ->when(!$isInstructor, function ($query) {
                $query->where('is_published', true);
            })
            ->with(['questions' => function ($query) use ($isInstructor) {
                if (!$isInstructor) {
                    $query->select('id', 'quiz_id', 'type', 'question', 'options', 'points', 'order_position');
                    // Hide correct answers from non-instructors
                }
            }])
            ->withCount('questions')
            ->get();

        // Add attempt information for authenticated users who are not instructors
        if ($user && !$isInstructor) {
            $quizzes->load(['attempts' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $quizzes
        ]);
    }

    /**
     * Store a new quiz.
     */
    public function store(Request $request, Lesson $lesson): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'time_limit_minutes' => 'nullable|integer|min:1|max:480',
            'max_attempts' => 'integer|min:1|max:10',
            'passing_score' => 'numeric|min:0|max:100',
            'shuffle_questions' => 'boolean',
            'show_results_immediately' => 'boolean',
            'allow_review' => 'boolean',
            'available_from' => 'nullable|date',
            'available_until' => 'nullable|date|after:available_from',
            'questions' => 'required|array|min:1',
            'questions.*.type' => ['required', Rule::in(['multiple_choice', 'true_false', 'short_answer'])],
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required_if:questions.*.type,multiple_choice|array|min:2',
            'questions.*.correct_answers' => 'required|array|min:1',
            'questions.*.explanation' => 'nullable|string',
            'questions.*.points' => 'numeric|min:0.1|max:100',
            'questions.*.case_sensitive' => 'boolean',
        ]);

        try {
            DB::transaction(function () use ($validated, $lesson, &$quiz) {
                $quiz = $lesson->quizzes()->create($validated);

                foreach ($validated['questions'] as $index => $questionData) {
                    $questionData['order_position'] = $index + 1;
                    $quiz->questions()->create($questionData);
                }
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Quiz created successfully',
                'data' => $quiz->load('questions')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create quiz: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show a specific quiz.
     */
    public function show(Request $request, Quiz $quiz): JsonResponse
    {
        $user = Auth::user();

        // Check if user can access this quiz
        if (!$user->hasRole('instructor') && !$quiz->isAvailable()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Quiz is not available'
            ], 403);
        }

        $quiz->load(['questions' => function ($query) use ($user) {
            if (!$user->hasRole('instructor')) {
                $query->select('id', 'quiz_id', 'type', 'question', 'options', 'points', 'order_position');
            }
        }]);

        // Add user's attempt history for students
        if (!$user->hasRole('instructor')) {
            $quiz->load(['attempts' => function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orderBy('attempt_number', 'desc');
            }]);
        }

        return response()->json([
            'status' => 'success',
            'data' => $quiz
        ]);
    }

    /**
     * Start a quiz attempt.
     */
    public function startAttempt(Request $request, Quiz $quiz): JsonResponse
    {
        $user = Auth::user();

        // Check if user can take this quiz
        if (!$quiz->canUserTake($user->id)) {
            return response()->json([
                'status' => 'error',
                'message' => 'You cannot take this quiz at this time'
            ], 403);
        }

        // Check for existing in-progress attempt
        $existingAttempt = $quiz->attempts()
            ->where('user_id', $user->id)
            ->where('status', 'in_progress')
            ->first();

        if ($existingAttempt) {
            return response()->json([
                'status' => 'success',
                'message' => 'Continuing existing attempt',
                'data' => $existingAttempt->load('quiz.questions')
            ]);
        }

        $attemptNumber = $quiz->getUserAttemptCount($user->id) + 1;

        $attempt = $quiz->attempts()->create([
            'user_id' => $user->id,
            'attempt_number' => $attemptNumber,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Quiz attempt started',
            'data' => $attempt->load('quiz.questions')
        ], 201);
    }

    /**
     * Submit an answer for a question.
     */
    public function submitAnswer(Request $request, QuizAttempt $attempt): JsonResponse
    {
        $user = Auth::user();

        if ($attempt->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$attempt->isInProgress()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This attempt is no longer active'
            ], 400);
        }

        if ($attempt->hasExceededTimeLimit()) {
            $attempt->update(['status' => 'abandoned']);
            return response()->json([
                'status' => 'error',
                'message' => 'Time limit exceeded'
            ], 400);
        }

        $validated = $request->validate([
            'question_id' => 'required|exists:quiz_questions,id',
            'answer' => 'required|array|min:1',
        ]);

        $question = QuizQuestion::findOrFail($validated['question_id']);

        if ($question->quiz_id !== $attempt->quiz_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Question does not belong to this quiz'
            ], 400);
        }

        // Create or update the answer
        $answer = $attempt->quizAnswers()->updateOrCreate(
            ['quiz_question_id' => $question->id],
            [
                'answer' => $validated['answer'],
                'points_possible' => $question->points,
            ]
        );

        // Grade the answer automatically
        $answer->grade();

        return response()->json([
            'status' => 'success',
            'message' => 'Answer submitted successfully',
            'data' => [
                'is_correct' => $answer->is_correct,
                'points_earned' => $answer->points_earned,
                'feedback' => $attempt->quiz->show_results_immediately ? $answer->feedback : null,
                'remaining_time' => $attempt->getRemainingTimeSeconds(),
            ]
        ]);
    }

    /**
     * Submit and complete the quiz attempt.
     */
    public function submitQuiz(Request $request, QuizAttempt $attempt): JsonResponse
    {
        $user = Auth::user();

        if ($attempt->user_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        if (!$attempt->isInProgress()) {
            return response()->json([
                'status' => 'error',
                'message' => 'This attempt is not in progress'
            ], 400);
        }

        $attempt->complete();

        $attempt->load(['quizAnswers.quizQuestion', 'quiz']);

        return response()->json([
            'status' => 'success',
            'message' => 'Quiz completed successfully',
            'data' => [
                'attempt' => $attempt,
                'score' => $attempt->score,
                'is_passed' => $attempt->is_passed,
                'total_points' => $attempt->total_points,
                'earned_points' => $attempt->earned_points,
                'answers' => $attempt->quiz->allow_review ? $attempt->quizAnswers : null,
            ]
        ]);
    }

    /**
     * Get quiz analytics for instructors.
     */
    public function getAnalytics(Request $request, Quiz $quiz): JsonResponse
    {
        $analytics = DB::select("
            WITH attempt_stats AS (
                SELECT
                    qa.user_id,
                    qa.attempt_number,
                    qa.score,
                    qa.is_passed,
                    qa.time_spent_seconds,
                    qa.completed_at,
                    ROW_NUMBER() OVER (PARTITION BY qa.user_id ORDER BY qa.score DESC) as best_attempt_rank
                FROM quiz_attempts qa
                WHERE qa.quiz_id = ? AND qa.status = 'completed'
            ),
            question_stats AS (
                SELECT
                    qq.id as question_id,
                    qq.question,
                    qq.type,
                    qq.points as max_points,
                    COUNT(qan.id) as total_answers,
                    COUNT(CASE WHEN qan.is_correct THEN 1 END) as correct_answers,
                    AVG(qan.points_earned) as avg_points,
                    ROUND(
                        (COUNT(CASE WHEN qan.is_correct THEN 1 END)::DECIMAL / COUNT(qan.id)) * 100,
                        2
                    ) as success_rate
                FROM quiz_questions qq
                LEFT JOIN quiz_answers qan ON qq.id = qan.quiz_question_id
                LEFT JOIN quiz_attempts qa ON qan.quiz_attempt_id = qa.id
                WHERE qq.quiz_id = ? AND qa.status = 'completed'
                GROUP BY qq.id, qq.question, qq.type, qq.points
            )
            SELECT
                'overview' as type,
                COUNT(DISTINCT ats.user_id) as total_students,
                COUNT(ats.user_id) as total_attempts,
                AVG(ats.score) as average_score,
                COUNT(CASE WHEN ats.is_passed THEN 1 END) as passed_count,
                ROUND(
                    (COUNT(CASE WHEN ats.is_passed THEN 1 END)::DECIMAL / COUNT(ats.user_id)) * 100,
                    2
                ) as pass_rate,
                AVG(ats.time_spent_seconds) as avg_time_spent
            FROM attempt_stats ats
            WHERE ats.best_attempt_rank = 1

            UNION ALL

            SELECT
                'questions' as type,
                NULL, NULL, NULL, NULL, NULL, NULL
            FROM question_stats
            LIMIT 1
        ", [$quiz->id, $quiz->id]);

        $questionStats = DB::select("
            SELECT
                qq.id as question_id,
                qq.question,
                qq.type,
                qq.points as max_points,
                COUNT(qan.id) as total_answers,
                COUNT(CASE WHEN qan.is_correct THEN 1 END) as correct_answers,
                ROUND(AVG(qan.points_earned), 2) as avg_points,
                ROUND(
                    (COUNT(CASE WHEN qan.is_correct THEN 1 END)::DECIMAL / NULLIF(COUNT(qan.id), 0)) * 100,
                    2
                ) as success_rate
            FROM quiz_questions qq
            LEFT JOIN quiz_answers qan ON qq.id = qan.quiz_question_id
            LEFT JOIN quiz_attempts qa ON qan.quiz_attempt_id = qa.id
            WHERE qq.quiz_id = ? AND (qa.status = 'completed' OR qa.status IS NULL)
            GROUP BY qq.id, qq.question, qq.type, qq.points
            ORDER BY qq.order_position
        ", [$quiz->id]);

        $scoreDistribution = DB::select("
            SELECT
                CASE
                    WHEN score >= 90 THEN 'A (90-100%)'
                    WHEN score >= 80 THEN 'B (80-89%)'
                    WHEN score >= 70 THEN 'C (70-79%)'
                    WHEN score >= 60 THEN 'D (60-69%)'
                    ELSE 'F (0-59%)'
                END as grade_range,
                COUNT(*) as count
            FROM (
                SELECT DISTINCT ON (user_id) user_id, score
                FROM quiz_attempts
                WHERE quiz_id = ? AND status = 'completed'
                ORDER BY user_id, score DESC
            ) best_scores
            GROUP BY grade_range
            ORDER BY MIN(score) DESC
        ", [$quiz->id]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'overview' => $analytics[0] ?? null,
                'questions' => $questionStats,
                'score_distribution' => $scoreDistribution,
                'quiz' => $quiz->load('questions')
            ]
        ]);
    }

    /**
     * Update a quiz.
     */
    public function update(Request $request, Quiz $quiz): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'time_limit_minutes' => 'nullable|integer|min:1|max:480',
            'max_attempts' => 'integer|min:1|max:10',
            'passing_score' => 'numeric|min:0|max:100',
            'shuffle_questions' => 'boolean',
            'show_results_immediately' => 'boolean',
            'allow_review' => 'boolean',
            'is_published' => 'boolean',
            'available_from' => 'nullable|date',
            'available_until' => 'nullable|date|after:available_from',
        ]);

        $quiz->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Quiz updated successfully',
            'data' => $quiz
        ]);
    }

    /**
     * Delete a quiz.
     */
    public function destroy(Quiz $quiz): JsonResponse
    {
        $quiz->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Quiz deleted successfully'
        ]);
    }
}
