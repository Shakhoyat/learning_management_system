<?php

namespace App\Jobs;

use App\Models\Enrollment;
use App\Mail\EnrollmentConfirmationMail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendEnrollmentConfirmationEmail implements ShouldQueue
{
    use Queueable;

    public $enrollment;

    /**
     * Create a new job instance.
     */
    public function __construct(Enrollment $enrollment)
    {
        $this->enrollment = $enrollment;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Load necessary relationships
            $this->enrollment->load(['user', 'course.instructor']);

            // Send enrollment confirmation email
            Mail::to($this->enrollment->user->email)
                ->send(new EnrollmentConfirmationMail($this->enrollment));

            Log::info('Enrollment confirmation email sent', [
                'enrollment_id' => $this->enrollment->id,
                'user_email' => $this->enrollment->user->email,
                'course_title' => $this->enrollment->course->title
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send enrollment confirmation email', [
                'enrollment_id' => $this->enrollment->id,
                'error' => $e->getMessage()
            ]);

            // Re-throw the exception to mark the job as failed
            throw $e;
        }
    }
}
