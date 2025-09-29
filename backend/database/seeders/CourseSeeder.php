<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🎓 Creating courses with modules and lessons...');

        // Get instructor user
        $instructor = User::where('email', 'instructor@lms.com')->first();
        $webCategory = \App\Models\Category::where('slug', 'web-development')->first();
        $dataCategory = \App\Models\Category::where('slug', 'data-science')->first();
        $mobileCategory = \App\Models\Category::where('slug', 'mobile-development')->first();

        if (!$instructor) {
            $this->command->error('❌ Instructor not found. Run users seeder first.');
            return;
        }

        // Create courses
        $this->createWebDevCourse($instructor, $webCategory);
        $this->createDataScienceCourse($instructor, $dataCategory);
        $this->createMobileDevCourse($instructor, $mobileCategory);

        $this->command->info('✅ Created courses with modules and lessons');
    }

    private function createWebDevCourse($instructor, $category)
    {
        $course = Course::updateOrCreate(
            ['title' => 'Complete Web Development Course'],
            [
                'description' => 'Learn web development from basics to advanced concepts including HTML, CSS, JavaScript, and modern frameworks',
                'short_description' => 'Master web development skills from scratch',
                'slug' => 'complete-web-development-course',
                'price' => 199.99,
                'instructor_id' => $instructor->id,
                'level' => 'beginner',
                'duration_hours' => 40,
                'category_id' => $category->id,
                'is_published' => true,
            ]
        );

        $modules = [
            [
                'title' => 'HTML & CSS Fundamentals',
                'lessons' => [
                    ['title' => 'Introduction to HTML', 'content' => 'Learn the basics of HTML markup language', 'duration_minutes' => 30],
                    ['title' => 'CSS Styling', 'content' => 'Master CSS for beautiful web pages', 'duration_minutes' => 45],
                    ['title' => 'Responsive Design', 'content' => 'Create responsive layouts with CSS Grid and Flexbox', 'duration_minutes' => 60],
                ]
            ],
            [
                'title' => 'JavaScript Essentials',
                'lessons' => [
                    ['title' => 'JavaScript Basics', 'content' => 'Variables, functions, and control structures', 'duration_minutes' => 50],
                    ['title' => 'DOM Manipulation', 'content' => 'Interact with HTML elements using JavaScript', 'duration_minutes' => 40],
                    ['title' => 'Events and Forms', 'content' => 'Handle user interactions and form validation', 'duration_minutes' => 35],
                ]
            ],
            [
                'title' => 'Modern Web Development',
                'lessons' => [
                    ['title' => 'Introduction to React', 'content' => 'Build dynamic user interfaces with React', 'duration_minutes' => 70],
                    ['title' => 'State Management', 'content' => 'Manage application state effectively', 'duration_minutes' => 55],
                    ['title' => 'Building a Complete App', 'content' => 'Create a full web application from scratch', 'duration_minutes' => 90],
                ]
            ],
        ];

        $this->createModulesAndLessons($course, $modules);
        $this->command->info('✅ Web Dev Course: ' . $course->title . ' with 3 modules');
    }

    private function createDataScienceCourse($instructor, $category)
    {
        $course = Course::updateOrCreate(
            ['title' => 'Data Science Fundamentals'],
            [
                'description' => 'Learn data analysis, visualization, and machine learning with Python',
                'short_description' => 'Master data science with Python',
                'slug' => 'data-science-fundamentals',
                'price' => 299.99,
                'instructor_id' => $instructor->id,
                'level' => 'intermediate',
                'duration_hours' => 60,
                'category_id' => $category->id,
                'is_published' => true,
            ]
        );

        $modules = [
            [
                'title' => 'Python for Data Science',
                'lessons' => [
                    ['title' => 'Python Basics for Data Science', 'content' => 'Python fundamentals and data structures', 'duration_minutes' => 45],
                    ['title' => 'NumPy and Pandas', 'content' => 'Data manipulation with NumPy and Pandas', 'duration_minutes' => 60],
                    ['title' => 'Data Cleaning', 'content' => 'Clean and prepare data for analysis', 'duration_minutes' => 50],
                ]
            ],
            [
                'title' => 'Data Visualization',
                'lessons' => [
                    ['title' => 'Matplotlib Basics', 'content' => 'Create basic plots and charts', 'duration_minutes' => 40],
                    ['title' => 'Advanced Visualization', 'content' => 'Advanced plotting techniques with Seaborn', 'duration_minutes' => 45],
                    ['title' => 'Interactive Plots', 'content' => 'Create interactive visualizations', 'duration_minutes' => 35],
                ]
            ],
            [
                'title' => 'Machine Learning Basics',
                'lessons' => [
                    ['title' => 'Introduction to ML', 'content' => 'Machine learning concepts and algorithms', 'duration_minutes' => 55],
                    ['title' => 'Supervised Learning', 'content' => 'Classification and regression techniques', 'duration_minutes' => 65],
                    ['title' => 'Model Evaluation', 'content' => 'Evaluate and improve model performance', 'duration_minutes' => 50],
                ]
            ],
        ];

        $this->createModulesAndLessons($course, $modules);
        $this->command->info('✅ Data Science Course: ' . $course->title . ' with 3 modules');
    }

    private function createMobileDevCourse($instructor, $category)
    {
        $course = Course::updateOrCreate(
            ['title' => 'React Native Mobile Development'],
            [
                'description' => 'Build cross-platform mobile apps with React Native',
                'short_description' => 'Create mobile apps with React Native',
                'slug' => 'react-native-mobile-development',
                'price' => 249.99,
                'instructor_id' => $instructor->id,
                'level' => 'intermediate',
                'duration_hours' => 35,
                'category_id' => $category->id,
                'is_published' => true,
            ]
        );

        $modules = [
            [
                'title' => 'React Native Fundamentals',
                'lessons' => [
                    ['title' => 'Setting up React Native', 'content' => 'Environment setup and project creation', 'duration_minutes' => 30],
                    ['title' => 'Core Components', 'content' => 'View, Text, ScrollView, and other core components', 'duration_minutes' => 45],
                    ['title' => 'Styling in React Native', 'content' => 'StyleSheet and Flexbox layout', 'duration_minutes' => 40],
                ]
            ],
            [
                'title' => 'Navigation and State',
                'lessons' => [
                    ['title' => 'React Navigation', 'content' => 'Stack, Tab, and Drawer navigation', 'duration_minutes' => 50],
                    ['title' => 'State Management', 'content' => 'useState, useEffect, and Context API', 'duration_minutes' => 45],
                    ['title' => 'API Integration', 'content' => 'Fetch data from REST APIs', 'duration_minutes' => 35],
                ]
            ],
            [
                'title' => 'Advanced Features',
                'lessons' => [
                    ['title' => 'Native Device Features', 'content' => 'Camera, GPS, and device sensors', 'duration_minutes' => 55],
                    ['title' => 'Performance Optimization', 'content' => 'Optimize app performance and memory usage', 'duration_minutes' => 40],
                    ['title' => 'Publishing Your App', 'content' => 'Deploy to App Store and Google Play', 'duration_minutes' => 35],
                ]
            ],
        ];

        $this->createModulesAndLessons($course, $modules);
        $this->command->info('✅ Mobile Dev Course: ' . $course->title . ' with 3 modules');
    }

    private function createModulesAndLessons($course, $modules)
    {
        foreach ($modules as $index => $moduleData) {
            $module = $course->modules()->updateOrCreate(
                ['title' => $moduleData['title']],
                [
                    'description' => 'Module description for ' . $moduleData['title'],
                    'order' => $index + 1,
                ]
            );

            foreach ($moduleData['lessons'] as $lessonIndex => $lessonData) {
                $module->lessons()->updateOrCreate(
                    ['title' => $lessonData['title']],
                    [
                        'content' => $lessonData['content'],
                        'duration_minutes' => $lessonData['duration_minutes'],
                        'order' => $lessonIndex + 1,
                        'type' => 'video',
                        'is_published' => true,
                    ]
                );
            }
        }
    }
}
