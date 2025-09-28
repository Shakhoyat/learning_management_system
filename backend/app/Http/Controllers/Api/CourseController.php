<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Course::with(['category', 'instructor', 'modules.lessons']);

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ILIKE', "%{$search}%")
                    ->orWhere('description', 'ILIKE', "%{$search}%");
            });
        }

        $courses = $query->get();

        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    /**
     * Display all categories.
     */
    public function categories(): JsonResponse
    {
        $categories = Category::all();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'level' => 'required|in:beginner,intermediate,advanced',
            'duration' => 'nullable|integer',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url'
        ]);

        $validated['instructor_id'] = Auth::id();
        $validated['status'] = 'draft';

        $course = Course::create($validated);
        $course->load(['category', 'instructor']);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    /**
     * Display the specified course.
     */
    public function show(Course $course): JsonResponse
    {
        $course->load([
            'category',
            'instructor',
            'modules.lessons.quizzes',
            'reviews.user'
        ]);

        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    /**
     * Update the specified course.
     */
    public function update(Request $request, Course $course): JsonResponse
    {
        // Check if user owns the course
        if ($course->instructor_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'level' => 'sometimes|in:beginner,intermediate,advanced',
            'duration' => 'nullable|integer',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:draft,published,archived',
            'image_url' => 'nullable|url'
        ]);

        $course->update($validated);
        $course->load(['category', 'instructor']);

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    /**
     * Remove the specified course.
     */
    public function destroy(Course $course): JsonResponse
    {
        // Check if user owns the course
        if ($course->instructor_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }
}
