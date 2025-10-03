# LMS Backend API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All API responses follow this general structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

Error responses:
```json
{
  "message": "Error message",
  "errors": {...}
}
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "student" // admin, instructor, student
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "email_verified_at": null,
    "created_at": "2025-01-01T00:00:00.000000Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer"
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register response

### Get Current User
```http
GET /auth/user
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "email_verified_at": null,
  "created_at": "2025-01-01T00:00:00.000000Z"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

### Password Reset
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Email Verification
```http
POST /auth/email/verification-notification
Authorization: Bearer <token>
```

---

## 📚 Course Management

### Get All Courses (Public)
```http
GET /courses
GET /courses?search=javascript
GET /courses?category_id=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "description": "Learn the basics of JavaScript",
      "category_id": 1,
      "instructor_id": 2,
      "level": "beginner",
      "duration": 40,
      "price": 99.99,
      "status": "published",
      "image_url": "https://example.com/image.jpg",
      "created_at": "2025-01-01T00:00:00.000000Z",
      "category": {
        "id": 1,
        "name": "Programming",
        "description": "Programming courses"
      },
      "instructor": {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "modules": [
        {
          "id": 1,
          "title": "Introduction",
          "description": "Getting started",
          "order_position": 1,
          "lessons": [
            {
              "id": 1,
              "title": "What is JavaScript?",
              "content": "JavaScript is...",
              "duration": 10,
              "order_position": 1
            }
          ]
        }
      ]
    }
  ]
}
```

### Get Course Details (Public)
```http
GET /courses/{courseId}
```

### Get Categories (Public)
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Programming",
      "description": "Programming courses",
      "created_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

### Create Course (Instructor Only)
```http
POST /instructor/courses
Authorization: Bearer <instructor_token>
```

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "category_id": 1,
  "level": "beginner", // beginner, intermediate, advanced
  "duration": 40,
  "price": 99.99,
  "image_url": "https://example.com/js-course.jpg"
}
```

### Update Course (Instructor Only)
```http
PUT /instructor/courses/{courseId}
Authorization: Bearer <instructor_token>
```

### Delete Course (Instructor Only)
```http
DELETE /instructor/courses/{courseId}
Authorization: Bearer <instructor_token>
```

---

## 🎓 Enrollment Management

### Enroll in Course
```http
POST /student/courses/{courseId}/enroll
Authorization: Bearer <student_token>
```

**Request Body (for paid courses):**
```json
{
  "payment_method": "card", // card, paypal, bank_transfer
  "payment_details": {
    "card_number": "4111111111111111",
    "expiry_month": "12",
    "expiry_year": "2025",
    "cvv": "123"
  }
}
```

**Response:**
```json
{
  "message": "Enrollment successful",
  "enrollment": {
    "id": 1,
    "user_id": 1,
    "course_id": 1,
    "status": "active",
    "amount_paid": 99.99,
    "payment_status": "paid",
    "enrolled_at": "2025-01-01T00:00:00.000000Z"
  },
  "transaction": {
    "id": 1,
    "transaction_id": "TXN_ABC123DEF456",
    "amount": 99.99,
    "currency": "USD",
    "status": "completed",
    "payment_method": "card"
  }
}
```

### Get User Enrollments
```http
GET /student/enrollments
Authorization: Bearer <student_token>
```

---

## 📈 Progress Tracking

### Get Course Progress
```http
GET /student/courses/{courseId}/progress
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course_id": 1,
    "user_id": 1,
    "total_lessons": 10,
    "completed_lessons": 3,
    "progress_percentage": 30,
    "time_spent_minutes": 45,
    "last_accessed": "2025-01-01T00:00:00.000000Z",
    "module_progress": [
      {
        "module_id": 1,
        "module_title": "Introduction",
        "total_lessons": 5,
        "completed_lessons": 3,
        "progress_percentage": 60
      }
    ]
  }
}
```

### Complete Lesson
```http
POST /student/lessons/{lessonId}/complete
Authorization: Bearer <student_token>
```

### Get User Analytics
```http
GET /student/analytics
Authorization: Bearer <student_token>
```

### Get Instructor Analytics
```http
GET /instructor/analytics
Authorization: Bearer <instructor_token>
```

### Get Course Student Progress (Instructor)
```http
GET /instructor/courses/{courseId}/students/progress
Authorization: Bearer <instructor_token>
```

---

## 🧩 Quiz System

### Get Lesson Quizzes (Public/Student)
```http
GET /test/lessons/{lessonId}/quizzes
GET /student/lessons/{lessonId}/quizzes
Authorization: Bearer <student_token> (for student endpoint)
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "JavaScript Basics Quiz",
      "description": "Test your knowledge",
      "instructions": "Answer all questions",
      "time_limit_minutes": 30,
      "max_attempts": 3,
      "passing_score": 70,
      "questions_count": 5,
      "is_published": true,
      "questions": [
        {
          "id": 1,
          "type": "multiple_choice",
          "question": "What is the correct way to declare a variable?",
          "options": ["var x = 5;", "variable x = 5;"],
          "points": 10,
          "order_position": 1
        }
      ]
    }
  ]
}
```

### Get Quiz Details
```http
GET /student/lessons/{lessonId}/quizzes/{quizId}
Authorization: Bearer <student_token>
```

### Create Quiz (Instructor Only)
```http
POST /instructor/lessons/{lessonId}/quizzes
Authorization: Bearer <instructor_token>
```

**Request Body:**
```json
{
  "title": "JavaScript Basics Quiz",
  "description": "Test your knowledge of JavaScript fundamentals",
  "instructions": "Answer all questions to the best of your ability",
  "time_limit_minutes": 30,
  "max_attempts": 3,
  "passing_score": 70,
  "shuffle_questions": true,
  "show_results_immediately": true,
  "allow_review": true,
  "available_from": "2025-01-01T00:00:00Z",
  "available_until": "2025-12-31T23:59:59Z",
  "questions": [
    {
      "type": "multiple_choice",
      "question": "What is the correct way to declare a variable in JavaScript?",
      "options": ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
      "correct_answers": ["var x = 5;"],
      "explanation": "Variables in JavaScript are declared using var, let, or const keywords.",
      "points": 10,
      "case_sensitive": false
    },
    {
      "type": "true_false",
      "question": "JavaScript is a case-sensitive language.",
      "options": ["True", "False"],
      "correct_answers": ["True"],
      "explanation": "JavaScript is indeed case-sensitive.",
      "points": 5,
      "case_sensitive": false
    },
    {
      "type": "short_answer",
      "question": "What keyword is used to define a function in JavaScript?",
      "correct_answers": ["function"],
      "explanation": "The 'function' keyword is used to define functions.",
      "points": 5,
      "case_sensitive": false
    }
  ]
}
```

### Start Quiz Attempt
```http
POST /student/lessons/{lessonId}/quizzes/{quizId}/attempts
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "quiz_id": 1,
    "user_id": 1,
    "started_at": "2025-01-01T00:00:00.000000Z",
    "time_limit_expires_at": "2025-01-01T00:30:00.000000Z",
    "status": "in_progress"
  }
}
```

### Submit Answer
```http
POST /student/quiz-attempts/{attemptId}/answers
Authorization: Bearer <student_token>
```

**Request Body:**
```json
{
  "question_id": 1,
  "answer": "var x = 5;" // or ["var x = 5;"] for multiple choice
}
```

### Submit Quiz
```http
POST /student/quiz-attempts/{attemptId}/submit
Authorization: Bearer <student_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "attempt_id": 1,
    "score": 85,
    "total_points": 100,
    "percentage": 85,
    "passed": true,
    "completed_at": "2025-01-01T00:25:00.000000Z",
    "time_taken_minutes": 25,
    "answers": [
      {
        "question_id": 1,
        "user_answer": "var x = 5;",
        "correct_answer": ["var x = 5;"],
        "is_correct": true,
        "points_earned": 10
      }
    ]
  }
}
```

---

## 👑 Admin Endpoints

### Admin Dashboard
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

### Get All Users
```http
GET /admin/users
Authorization: Bearer <admin_token>
```

### Promote User
```http
POST /admin/users/{userId}/promote
Authorization: Bearer <admin_token>
```

### Delete User
```http
DELETE /admin/users/{userId}
Authorization: Bearer <admin_token>
```

---

## 👨‍🏫 Instructor Endpoints

### Instructor Dashboard
```http
GET /instructor/dashboard
Authorization: Bearer <instructor_token>
```

### Get Instructor Courses
```http
GET /instructor/courses
Authorization: Bearer <instructor_token>
```

### Get Students
```http
GET /instructor/students
Authorization: Bearer <instructor_token>
```

### Quiz Analytics
```http
GET /instructor/lessons/{lessonId}/quizzes/{quizId}/analytics
Authorization: Bearer <instructor_token>
```

---

## 🎒 Student Endpoints

### Student Dashboard
```http
GET /student/dashboard
Authorization: Bearer <student_token>
```

### Get Enrolled Courses
```http
GET /student/courses
Authorization: Bearer <student_token>
```

---

## 📧 Email Verification

### Send Verification Email
```http
POST /auth/email/verification-notification
Authorization: Bearer <token>
```

### Verified-Only Route (Example)
```http
GET /verified-only
Authorization: Bearer <token>
```

---

## 🚨 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 401 | Unauthorized (invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., already enrolled) |
| 422 | Validation Error |
| 500 | Server Error |

## 💡 Frontend Integration Tips

### 1. Authentication Flow
```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

// Authenticated request
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
};
```

### 2. Role-based Access Control
```javascript
const useAuth = () => {
  const [user, setUser] = useState(null);
  
  const hasRole = (role) => user?.role === role;
  const isAdmin = () => hasRole('admin');
  const isInstructor = () => hasRole('instructor') || hasRole('admin');
  const isStudent = () => hasRole('student') || hasRole('instructor') || hasRole('admin');
  
  return { user, hasRole, isAdmin, isInstructor, isStudent };
};
```

### 3. Error Handling
```javascript
const handleApiError = (response, data) => {
  if (response.status === 401) {
    // Token expired, redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  } else if (response.status === 422) {
    // Validation errors
    return data.errors;
  } else if (response.status === 403) {
    // Access denied
    throw new Error('Access denied');
  }
  throw new Error(data.message || 'An error occurred');
};
```

### 4. Quiz Implementation
```javascript
const startQuiz = async (lessonId, quizId) => {
  const response = await makeAuthenticatedRequest(
    `/student/lessons/${lessonId}/quizzes/${quizId}/attempts`,
    { method: 'POST' }
  );
  return response.json();
};

const submitAnswer = async (attemptId, questionId, answer) => {
  const response = await makeAuthenticatedRequest(
    `/student/quiz-attempts/${attemptId}/answers`,
    {
      method: 'POST',
      body: JSON.stringify({ question_id: questionId, answer })
    }
  );
  return response.json();
};
```

This documentation provides all the endpoints and their expected request/response formats. Use this as a reference while building your Next.js frontend!