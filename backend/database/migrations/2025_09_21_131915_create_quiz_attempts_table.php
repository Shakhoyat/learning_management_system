<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('attempt_number');
            $table->datetime('started_at');
            $table->datetime('completed_at')->nullable();
            $table->decimal('score', 5, 2)->nullable(); // Percentage score
            $table->decimal('total_points', 8, 2)->nullable();
            $table->decimal('earned_points', 8, 2)->nullable();
            $table->boolean('is_passed')->nullable();
            $table->json('answers')->nullable(); // Store all answers for review
            $table->integer('time_spent_seconds')->nullable();
            $table->enum('status', ['in_progress', 'completed', 'abandoned'])->default('in_progress');
            $table->timestamps();

            $table->index(['quiz_id', 'user_id']);
            $table->index(['user_id']);
            $table->index(['status']);
            $table->index(['is_passed']);
            $table->unique(['quiz_id', 'user_id', 'attempt_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};
