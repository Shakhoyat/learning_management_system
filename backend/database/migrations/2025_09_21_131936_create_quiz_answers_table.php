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
        Schema::create('quiz_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_attempt_id')->constrained('quiz_attempts')->onDelete('cascade');
            $table->foreignId('quiz_question_id')->constrained('quiz_questions')->onDelete('cascade');
            $table->json('answer'); // Student's answer(s): [0,2] for MCQ, [true] for T/F, ["text answer"] for short
            $table->boolean('is_correct')->nullable();
            $table->decimal('points_earned', 8, 2)->nullable();
            $table->decimal('points_possible', 8, 2);
            $table->text('feedback')->nullable(); // Automatic or manual feedback
            $table->timestamps();

            $table->index(['quiz_attempt_id']);
            $table->index(['quiz_question_id']);
            $table->index(['is_correct']);
            $table->unique(['quiz_attempt_id', 'quiz_question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_answers');
    }
};
