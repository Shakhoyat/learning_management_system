<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the courses for the category.
     */
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Get active courses for the category.
     */
    public function activeCourses()
    {
        return $this->hasMany(Course::class)->where('is_published', true);
    }
}
