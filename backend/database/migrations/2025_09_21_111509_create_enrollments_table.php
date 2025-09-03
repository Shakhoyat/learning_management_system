<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEnrollmentsTable extends Migration
{
    public function up()
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');

            $table->enum('status', ['active', 'completed', 'cancelled', 'expired'])->default('active');
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->string('payment_status')->default('pending'); // pending, paid, refunded

            $table->unsignedInteger('progress_percentage')->default(0);
            $table->timestamp('enrolled_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at')->nullable(); // For time-limited access

            $table->timestamps();

            $table->unique(['user_id', 'course_id']);
            $table->index(['course_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index(['payment_status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('enrollments');
    }
}
