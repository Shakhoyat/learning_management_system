<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'thumbnail',
        'price',
        'discount_price',
        'duration_hours',
        'level',
        'language',
        'is_published',
        'is_featured',
        'category_id',
        'instructor_id',
        'max_students',
        'requirements',
        'what_you_learn',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'requirements' => 'array',
        'what_you_learn' => 'array',
    ];

    /**
     * Get the instructor that owns the course.
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the category that owns the course.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the modules for the course.
     */
    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    /**
     * Get the enrollments for the course.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get the students enrolled in the course.
     */
    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('enrolled_at', 'completed_at', 'progress_percentage')
            ->withTimestamps();
    }

    /**
     * Get all lessons through modules.
     */
    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Module::class);
    }

    /**
     * Check if the course is free.
     */
    public function isFree()
    {
        return $this->price == 0;
    }

    /**
     * Get the effective price (with discount if available).
     */
    public function getEffectivePrice()
    {
        return $this->discount_price ?: $this->price;
    }

    /**
     * Get the total number of lessons.
     */
    public function getTotalLessonsAttribute()
    {
        return $this->lessons()->count();
    }

    /**
     * Get the total number of enrolled students.
     */
    public function getTotalStudentsAttribute()
    {
        return $this->enrollments()->count();
    }
}
