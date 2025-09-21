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
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained('quizzes')->onDelete('cascade');
            $table->enum('type', ['multiple_choice', 'true_false', 'short_answer']);
            $table->text('question');
            $table->json('options')->nullable(); // For MCQ options: ["Option A", "Option B", ...]
            $table->json('correct_answers'); // For MCQ: [0,2] for options A,C; For true/false: [true]; For short: ["answer1", "answer2"]
            $table->text('explanation')->nullable();
            $table->decimal('points', 8, 2)->default(1.00);
            $table->integer('order_position')->default(0);
            $table->boolean('case_sensitive')->default(false); // For short answer questions
            $table->timestamps();

            $table->index(['quiz_id']);
            $table->index(['type']);
            $table->index(['order_position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
