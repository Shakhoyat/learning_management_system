<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendEnrollmentConfirmationEmail;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class EnrollmentController extends Controller
{
    /**
     * Enroll a student in a course with payment processing
     */
    public function enrollInCourse(Request $request, Course $course)
    {
        $user = Auth::user();

        // Check if already enrolled
        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existingEnrollment) {
            return response()->json([
                'message' => 'You are already enrolled in this course',
                'enrollment' => $existingEnrollment
            ], 409);
        }

        // Check course capacity
        if ($course->max_students && $course->enrollments()->count() >= $course->max_students) {
            return response()->json([
                'message' => 'Course is full. Maximum students reached.'
            ], 409);
        }

        // Validate payment data if course is not free
        if (!$course->isFree()) {
            $validator = Validator::make($request->all(), [
                'payment_method' => 'required|string|in:card,paypal,bank_transfer',
                'payment_details' => 'required|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Payment validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
        }

        // Use database transaction to ensure data consistency
        try {
            DB::beginTransaction();

            $effectivePrice = $course->getEffectivePrice();

            // Create enrollment record
            $enrollment = Enrollment::create([
                'user_id' => $user->id,
                'course_id' => $course->id,
                'status' => Enrollment::STATUS_ACTIVE,
                'amount_paid' => $effectivePrice,
                'payment_status' => $course->isFree() ? Enrollment::PAYMENT_PAID : Enrollment::PAYMENT_PENDING,
                'enrolled_at' => now(),
            ]);

            // Create transaction record
            $transaction = Transaction::create([
                'transaction_id' => 'TXN_' . strtoupper(Str::random(12)),
                'user_id' => $user->id,
                'course_id' => $course->id,
                'enrollment_id' => $enrollment->id,
                'amount' => $effectivePrice,
                'currency' => 'USD',
                'status' => $course->isFree() ? Transaction::STATUS_COMPLETED : Transaction::STATUS_PENDING,
                'payment_method' => $request->payment_method ?? 'free',
                'payment_gateway' => $request->payment_method === 'card' ? 'stripe_simulation' : $request->payment_method,
            ]);

            // Simulate payment processing for non-free courses
            if (!$course->isFree()) {
                $paymentResult = $this->simulatePaymentProcessing($transaction, $request->payment_details);

                if ($paymentResult['success']) {
                    $transaction->markAsCompleted(
                        'sim_' . strtoupper(Str::random(10)),
                        $paymentResult
                    );

                    $enrollment->update(['payment_status' => Enrollment::PAYMENT_PAID]);
                } else {
                    $transaction->markAsFailed(
                        $paymentResult['error'] ?? 'Payment failed',
                        $paymentResult
                    );

                    throw new \Exception('Payment processing failed: ' . $paymentResult['error']);
                }
            } else {
                // For free courses, mark as completed immediately
                $transaction->markAsCompleted('free_course', ['message' => 'Free course enrollment']);
            }

            DB::commit();

            // Queue enrollment confirmation email (to be implemented)

            $enrollment->load(['course', 'user']);

            return response()->json([
                'message' => 'Successfully enrolled in course',
                'enrollment' => $enrollment,
                'transaction' => $transaction
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Enrollment failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's enrollments
     */
    public function getUserEnrollments(Request $request)
    {
        $user = Auth::user();

        $query = Enrollment::with(['course.instructor', 'course.category'])
            ->where('user_id', $user->id);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->orderBy('enrolled_at', 'desc')->paginate(12);

        return response()->json([
            'data' => $enrollments->items(),
            'pagination' => [
                'current_page' => $enrollments->currentPage(),
                'last_page' => $enrollments->lastPage(),
                'per_page' => $enrollments->perPage(),
                'total' => $enrollments->total(),
            ]
        ]);
    }

    /**
     * Simulate payment processing
     */
    private function simulatePaymentProcessing($transaction, $paymentDetails)
    {
        // Simulate different payment scenarios
        $scenarios = [
            ['success' => true, 'probability' => 0.85],
            ['success' => false, 'error' => 'Insufficient funds', 'probability' => 0.05],
            ['success' => false, 'error' => 'Card declined', 'probability' => 0.05],
            ['success' => false, 'error' => 'Network timeout', 'probability' => 0.05],
        ];

        $random = mt_rand(1, 100) / 100;
        $cumulative = 0;

        foreach ($scenarios as $scenario) {
            $cumulative += $scenario['probability'];
            if ($random <= $cumulative) {
                return [
                    'success' => $scenario['success'],
                    'error' => $scenario['error'] ?? null,
                    'gateway_response' => [
                        'payment_method' => $transaction->payment_method,
                        'amount' => $transaction->amount,
                        'currency' => $transaction->currency,
                        'simulation_timestamp' => now()->toISOString(),
                        'details' => $paymentDetails
                    ]
                ];
            }
        }

        return ['success' => true];
    }
}
