<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('📚 Creating course categories...');

        $categories = [
            [
                'name' => 'Web Development',
                'description' => 'Learn modern web development technologies including HTML, CSS, JavaScript, and popular frameworks.',
                'slug' => 'web-development',
            ],
            [
                'name' => 'Data Science',
                'description' => 'Master data analysis, machine learning, and statistical modeling techniques.',
                'slug' => 'data-science',
            ],
            [
                'name' => 'Mobile Development',
                'description' => 'Build mobile applications for iOS and Android platforms.',
                'slug' => 'mobile-development',
            ],
            [
                'name' => 'DevOps & Cloud',
                'description' => 'Learn deployment, containerization, and cloud infrastructure management.',
                'slug' => 'devops-cloud',
            ],
            [
                'name' => 'Design & UX',
                'description' => 'Create beautiful and user-friendly digital experiences.',
                'slug' => 'design-ux',
            ],
            [
                'name' => 'Business & Marketing',
                'description' => 'Develop business skills and digital marketing strategies.',
                'slug' => 'business-marketing',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }

        $this->command->info('✅ Created ' . count($categories) . ' categories');
    }
}
