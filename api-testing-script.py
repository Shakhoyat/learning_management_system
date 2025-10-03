#!/usr/bin/env python3
"""
Comprehensive API Testing Script for LMS Backend (Python Version)
This script tests all available endpoints for your Laravel backend
Use this to understand the API structure while building your Next.js frontend
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

class LMSApiTester:
    def __init__(self, base_url: str = "http://localhost:8000/api"):
        self.base_url = base_url
        self.tokens = {
            'admin': None,
            'instructor': None,
            'student': None
        }
        self.test_data = {
            'users': {},
            'courses': {},
            'enrollments': {},
            'quizzes': {}
        }
        self.session = requests.Session()

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    token: Optional[str] = None) -> Dict[str, Any]:
        """Make HTTP request to API endpoint"""
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers)
            elif method.upper() == 'POST':
                response = self.session.post(url, headers=headers, json=data)
            elif method.upper() == 'PUT':
                response = self.session.put(url, headers=headers, json=data)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            print(f"\n📡 {method.upper()} {endpoint}")
            print(f"Status: {response.status_code}")
            
            try:
                result = response.json()
                print("Response:", json.dumps(result, indent=2))
            except json.JSONDecodeError:
                result = {"message": response.text}
                print("Response:", response.text)

            return {
                'success': response.ok,
                'status': response.status_code,
                'data': result
            }

        except requests.exceptions.RequestException as e:
            print(f"❌ Error in {method.upper()} {endpoint}: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    def test_authentication(self):
        """Test authentication endpoints"""
        print('\n🔐 TESTING AUTHENTICATION ENDPOINTS')
        print('=' * 50)

        # Test user registration
        users = [
            {
                'name': 'Admin User',
                'email': 'admin@test.com',
                'password': 'password123',
                'password_confirmation': 'password123',
                'role': 'admin'
            },
            {
                'name': 'Instructor User',
                'email': 'instructor@test.com',
                'password': 'password123',
                'password_confirmation': 'password123',
                'role': 'instructor'
            },
            {
                'name': 'Student User',
                'email': 'student@test.com',
                'password': 'password123',
                'password_confirmation': 'password123',
                'role': 'student'
            }
        ]

        # Register users
        for user in users:
            response = self.make_request('POST', '/auth/register', user)
            if response['success']:
                self.test_data['users'][user['role']] = user
                self.tokens[user['role']] = response['data'].get('token')

        # Test login
        for role in ['admin', 'instructor', 'student']:
            if role in self.test_data['users']:
                login_data = {
                    'email': self.test_data['users'][role]['email'],
                    'password': self.test_data['users'][role]['password']
                }
                response = self.make_request('POST', '/auth/login', login_data)
                if response['success']:
                    self.tokens[role] = response['data'].get('token')

        # Test get user profile
        for role in ['admin', 'instructor', 'student']:
            if self.tokens[role]:
                self.make_request('GET', '/auth/user', token=self.tokens[role])

        # Test password reset
        self.make_request('POST', '/auth/forgot-password', {'email': 'student@test.com'})

    def test_course_management(self):
        """Test course management endpoints"""
        print('\n📚 TESTING COURSE MANAGEMENT ENDPOINTS')
        print('=' * 50)

        # Test get categories (public)
        self.make_request('GET', '/categories')

        # Test get all courses (public)
        self.make_request('GET', '/courses')

        # Test course search
        self.make_request('GET', '/courses?search=javascript')

        # Test filter by category
        self.make_request('GET', '/courses?category_id=1')

        # Test create course (instructor only)
        if self.tokens['instructor']:
            course_data = {
                'title': 'Python Fundamentals',
                'description': 'Learn the basics of Python programming',
                'category_id': 1,
                'level': 'beginner',
                'duration': 40,
                'price': 99.99,
                'image_url': 'https://example.com/python-course.jpg'
            }

            response = self.make_request('POST', '/instructor/courses', course_data, 
                                       self.tokens['instructor'])
            if response['success']:
                self.test_data['courses']['python'] = response['data']['data']

        # Test get course details (public)
        if 'python' in self.test_data['courses']:
            course_id = self.test_data['courses']['python']['id']
            self.make_request('GET', f'/courses/{course_id}')

        # Test update course (instructor only)
        if self.tokens['instructor'] and 'python' in self.test_data['courses']:
            course_id = self.test_data['courses']['python']['id']
            update_data = {
                'title': 'Advanced Python Fundamentals',
                'description': 'Learn advanced Python programming concepts',
                'level': 'intermediate',
                'price': 149.99
            }
            self.make_request('PUT', f'/instructor/courses/{course_id}', 
                            update_data, self.tokens['instructor'])

    def test_enrollments(self):
        """Test enrollment endpoints"""
        print('\n🎓 TESTING ENROLLMENT ENDPOINTS')
        print('=' * 50)

        if self.tokens['student'] and 'python' in self.test_data['courses']:
            course_id = self.test_data['courses']['python']['id']
            
            # Test course enrollment
            enrollment_data = {
                'payment_method': 'card',
                'payment_details': {
                    'card_number': '4111111111111111',
                    'expiry_month': '12',
                    'expiry_year': '2025',
                    'cvv': '123'
                }
            }

            response = self.make_request('POST', f'/student/courses/{course_id}/enroll', 
                                       enrollment_data, self.tokens['student'])
            if response['success']:
                self.test_data['enrollments']['python'] = response['data']

            # Test get user enrollments
            self.make_request('GET', '/student/enrollments', token=self.tokens['student'])

    def test_progress_tracking(self):
        """Test progress tracking endpoints"""
        print('\n📈 TESTING PROGRESS TRACKING ENDPOINTS')
        print('=' * 50)

        if self.tokens['student'] and 'python' in self.test_data['courses']:
            course_id = self.test_data['courses']['python']['id']
            
            # Test get course progress
            self.make_request('GET', f'/student/courses/{course_id}/progress', 
                            token=self.tokens['student'])

            # Test complete lesson (assuming lesson ID 1 exists)
            self.make_request('POST', '/student/lessons/1/complete', {}, 
                            self.tokens['student'])

            # Test get user analytics
            self.make_request('GET', '/student/analytics', token=self.tokens['student'])

        if self.tokens['instructor'] and 'python' in self.test_data['courses']:
            course_id = self.test_data['courses']['python']['id']
            
            # Test instructor analytics
            self.make_request('GET', '/instructor/analytics', token=self.tokens['instructor'])

            # Test course student progress
            self.make_request('GET', f'/instructor/courses/{course_id}/students/progress', 
                            token=self.tokens['instructor'])

    def test_quiz_system(self):
        """Test quiz system endpoints"""
        print('\n🧩 TESTING QUIZ SYSTEM ENDPOINTS')
        print('=' * 50)

        lesson_id = 1  # Assuming lesson ID 1 exists

        # Test get quizzes for lesson (public)
        self.make_request('GET', f'/test/lessons/{lesson_id}/quizzes')

        if self.tokens['instructor']:
            # Test create quiz (instructor only)
            quiz_data = {
                'title': 'Python Basics Quiz',
                'description': 'Test your knowledge of Python fundamentals',
                'instructions': 'Answer all questions to the best of your ability',
                'time_limit_minutes': 30,
                'max_attempts': 3,
                'passing_score': 70,
                'shuffle_questions': True,
                'show_results_immediately': True,
                'allow_review': True,
                'questions': [
                    {
                        'type': 'multiple_choice',
                        'question': 'What is the correct way to create a list in Python?',
                        'options': ['list = []', 'list = {}', 'list = ()', 'list = ""'],
                        'correct_answers': ['list = []'],
                        'explanation': 'Lists in Python are created using square brackets.',
                        'points': 10,
                        'case_sensitive': False
                    },
                    {
                        'type': 'true_false',
                        'question': 'Python is an interpreted language.',
                        'options': ['True', 'False'],
                        'correct_answers': ['True'],
                        'explanation': 'Python is indeed an interpreted language.',
                        'points': 5,
                        'case_sensitive': False
                    }
                ]
            }

            response = self.make_request('POST', f'/instructor/lessons/{lesson_id}/quizzes', 
                                       quiz_data, self.tokens['instructor'])
            if response['success']:
                self.test_data['quizzes']['python'] = response['data']['data']

        if self.tokens['student'] and 'python' in self.test_data['quizzes']:
            quiz_id = self.test_data['quizzes']['python']['id']

            # Test get quiz details
            self.make_request('GET', f'/student/lessons/{lesson_id}/quizzes/{quiz_id}', 
                            token=self.tokens['student'])

            # Test start quiz attempt
            attempt_response = self.make_request('POST', 
                f'/student/lessons/{lesson_id}/quizzes/{quiz_id}/attempts', 
                {}, self.tokens['student'])

            if attempt_response['success']:
                attempt_id = attempt_response['data']['data']['id']

                # Test submit answer
                self.make_request('POST', f'/student/quiz-attempts/{attempt_id}/answers', 
                                {
                                    'question_id': 1,
                                    'answer': 'list = []'
                                }, self.tokens['student'])

                # Test submit quiz
                self.make_request('POST', f'/student/quiz-attempts/{attempt_id}/submit', 
                                {}, self.tokens['student'])

    def test_admin_dashboard(self):
        """Test admin dashboard endpoints"""
        print('\n👑 TESTING ADMIN DASHBOARD ENDPOINTS')
        print('=' * 50)

        if self.tokens['admin']:
            # Test admin dashboard
            self.make_request('GET', '/admin/dashboard', token=self.tokens['admin'])

            # Test get all users
            self.make_request('GET', '/admin/users', token=self.tokens['admin'])

            # Test promote user
            self.make_request('POST', '/admin/users/3/promote', {}, self.tokens['admin'])

    def test_instructor_dashboard(self):
        """Test instructor dashboard endpoints"""
        print('\n👨‍🏫 TESTING INSTRUCTOR DASHBOARD ENDPOINTS')
        print('=' * 50)

        if self.tokens['instructor']:
            # Test instructor dashboard
            self.make_request('GET', '/instructor/dashboard', token=self.tokens['instructor'])

            # Test get instructor courses
            self.make_request('GET', '/instructor/courses', token=self.tokens['instructor'])

            # Test get students
            self.make_request('GET', '/instructor/students', token=self.tokens['instructor'])

            if 'python' in self.test_data['quizzes']:
                quiz_id = self.test_data['quizzes']['python']['id']
                # Test quiz analytics
                self.make_request('GET', f'/instructor/lessons/1/quizzes/{quiz_id}/analytics', 
                                token=self.tokens['instructor'])

    def test_student_dashboard(self):
        """Test student dashboard endpoints"""
        print('\n🎒 TESTING STUDENT DASHBOARD ENDPOINTS')
        print('=' * 50)

        if self.tokens['student']:
            # Test student dashboard
            self.make_request('GET', '/student/dashboard', token=self.tokens['student'])

            # Test get enrolled courses
            self.make_request('GET', '/student/courses', token=self.tokens['student'])

    def test_email_verification(self):
        """Test email verification endpoints"""
        print('\n📧 TESTING EMAIL VERIFICATION ENDPOINTS')
        print('=' * 50)

        if self.tokens['student']:
            # Test send verification email
            self.make_request('POST', '/auth/email/verification-notification', 
                            {}, self.tokens['student'])

            # Test verified-only route
            self.make_request('GET', '/verified-only', token=self.tokens['student'])

    def test_logout(self):
        """Test logout endpoints"""
        print('\n🚪 TESTING LOGOUT ENDPOINTS')
        print('=' * 50)

        # Test logout for each user type
        for role in ['admin', 'instructor', 'student']:
            if self.tokens[role]:
                self.make_request('POST', '/auth/logout', {}, self.tokens[role])

    def run_all_tests(self):
        """Run all API tests"""
        print('🚀 Starting Comprehensive LMS API Testing')
        print('=' * 60)
        print(f'Base URL: {self.base_url}')
        print('=' * 60)

        try:
            self.test_authentication()
            self.test_course_management()
            self.test_enrollments()
            self.test_progress_tracking()
            self.test_quiz_system()
            self.test_admin_dashboard()
            self.test_instructor_dashboard()
            self.test_student_dashboard()
            self.test_email_verification()
            self.test_logout()

            print('\n✅ All tests completed!')
            print('\n📊 TEST SUMMARY')
            print('=' * 30)
            tokens_count = len([t for t in self.tokens.values() if t])
            test_data_count = sum(len(v) for v in self.test_data.values())
            print(f'Tokens obtained: {tokens_count}')
            print(f'Test data created: {test_data_count}')

        except Exception as e:
            print(f'❌ Test execution failed: {str(e)}')

def main():
    """Main function"""
    print("""
📋 USAGE INSTRUCTIONS:
1. Make sure your Laravel backend is running on http://localhost:8000
2. Run: python api-testing-script.py
3. Check the console output for API responses
4. Use the response formats to build your Next.js frontend

🔧 SETUP:
- Install dependencies: pip install requests
- Make sure your backend database is seeded with at least one category
- Ensure all migrations are run

💡 FRONTEND INTEGRATION TIPS:
- Use the response structures shown in console output
- Copy the request formats for your API calls
- Implement error handling based on the status codes shown
- Use the authentication token format: "Bearer <token>"
""")

    # Get base URL from command line argument if provided
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/api"
    
    # Run the tests
    tester = LMSApiTester(base_url)
    tester.run_all_tests()

if __name__ == "__main__":
    main()