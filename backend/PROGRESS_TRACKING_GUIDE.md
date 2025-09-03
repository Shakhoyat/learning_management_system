# Progress Tracking System Test Guide

This guide demonstrates the comprehensive progress tracking system with PostgreSQL window functions and analytics.

## Features Implemented

### 1. Progress Model
- Tracks lesson completion with timestamps and time spent
- PostgreSQL window functions for complex analytics
- Learning streak calculations
- Course progress aggregations

### 2. Analytics Endpoints

#### Student Endpoints:
- `GET /api/student/analytics` - Personal learning analytics
- `GET /api/student/courses/{course}/progress` - Course-specific progress
- `POST /api/student/lessons/{lesson}/complete` - Mark lesson complete

#### Instructor Endpoints:
- `GET /api/instructor/analytics` - Course performance overview
- `GET /api/instructor/courses/{course}/students/progress` - Detailed student progress

### 3. Advanced SQL Features

The system uses sophisticated PostgreSQL queries including:
- Window functions for progress calculations
- CTEs (Common Table Expressions) for complex aggregations
- JSON aggregation for structured data
- Streak calculations using date arithmetic

## Testing the System

### Step 1: Create Test Data

```bash
# Login as a student
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'

# Save the token from response
export STUDENT_TOKEN="your_student_token_here"
```

### Step 2: Complete Some Lessons

```bash
# Complete first lesson (assuming lesson ID 1 exists)
curl -X POST http://localhost:8000/api/student/lessons/1/complete \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"time_spent": 1800}'

# Complete second lesson  
curl -X POST http://localhost:8000/api/student/lessons/2/complete \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"time_spent": 2400}'
```

### Step 3: View Student Analytics

```bash
# Get comprehensive student analytics
curl -X GET http://localhost:8000/api/student/analytics \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# Expected response includes:
# - Course progress with completion percentages
# - Learning streak information
# - Recent activity
# - Total statistics
```

### Step 4: View Course Progress

```bash
# Get progress for specific course (assuming course ID 1)
curl -X GET http://localhost:8000/api/student/courses/1/progress \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### Step 5: Instructor Analytics

```bash
# Login as instructor
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"instructor@test.com","password":"password123"}'

export INSTRUCTOR_TOKEN="your_instructor_token_here"

# View instructor analytics dashboard
curl -X GET http://localhost:8000/api/instructor/analytics \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN"

# View detailed student progress for a course
curl -X GET http://localhost:8000/api/instructor/courses/1/students/progress \
  -H "Authorization: Bearer $INSTRUCTOR_TOKEN"
```

## Key SQL Queries Demonstrated

### 1. Student Progress Analytics
```sql
WITH lesson_progress AS (
    SELECT 
        l.id as lesson_id,
        l.title as lesson_title,
        l.module_id,
        m.title as module_title,
        m.course_id,
        c.title as course_title,
        CASE WHEN p.completed_at IS NOT NULL THEN 1 ELSE 0 END as is_completed,
        p.time_spent,
        p.completed_at,
        e.enrolled_at
    FROM lessons l
    JOIN modules m ON l.module_id = m.id
    JOIN courses c ON m.course_id = c.id
    LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ?
    LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ?
    WHERE e.id IS NOT NULL
),
course_progress AS (
    SELECT 
        course_id,
        course_title,
        enrolled_at,
        COUNT(*) as total_lessons,
        SUM(is_completed) as completed_lessons,
        SUM(time_spent) as total_time_spent,
        ROUND((SUM(is_completed)::float / COUNT(*) * 100)::numeric, 2) as completion_percentage,
        MAX(completed_at) as last_activity
    FROM lesson_progress
    GROUP BY course_id, course_title, enrolled_at
)
SELECT 
    *,
    CASE 
        WHEN completion_percentage = 100 THEN 'completed'
        WHEN completion_percentage > 0 THEN 'in_progress'
        ELSE 'not_started'
    END as status
FROM course_progress
ORDER BY last_activity DESC NULLS LAST, enrolled_at DESC
```

### 2. Learning Streak Calculation
```sql
WITH daily_progress AS (
    SELECT 
        DATE(completed_at) as completion_date,
        COUNT(*) as lessons_completed
    FROM progress 
    WHERE user_id = ? 
    AND completed_at IS NOT NULL
    AND completed_at >= CURRENT_DATE - INTERVAL '60 days'
    GROUP BY DATE(completed_at)
    ORDER BY DATE(completed_at) DESC
),
streak_calculation AS (
    SELECT 
        completion_date,
        lessons_completed,
        ROW_NUMBER() OVER (ORDER BY completion_date DESC) as row_num,
        completion_date - (ROW_NUMBER() OVER (ORDER BY completion_date DESC) - 1) * INTERVAL '1 day' as streak_group
    FROM daily_progress
)
SELECT 
    COUNT(*) as current_streak,
    MIN(completion_date) as streak_start,
    MAX(completion_date) as streak_end,
    SUM(lessons_completed) as total_lessons_in_streak
FROM streak_calculation
WHERE streak_group = (SELECT streak_group FROM streak_calculation WHERE row_num = 1)
```

### 3. Course Completion Statistics
```sql
WITH enrollment_progress AS (
    SELECT 
        e.user_id,
        e.enrolled_at,
        u.name as student_name,
        COUNT(cl.lesson_id) as total_lessons,
        COUNT(p.lesson_id) as completed_lessons,
        ROUND((COUNT(p.lesson_id)::float / COUNT(cl.lesson_id) * 100)::numeric, 2) as completion_percentage,
        SUM(p.time_spent) as total_time_spent,
        MAX(p.completed_at) as last_activity
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    CROSS JOIN course_lessons cl
    LEFT JOIN progress p ON p.lesson_id = cl.lesson_id AND p.user_id = e.user_id
    WHERE e.course_id = ?
    GROUP BY e.user_id, e.enrolled_at, u.name
)
SELECT 
    COUNT(*) as total_students,
    AVG(completion_percentage) as avg_completion_percentage,
    COUNT(CASE WHEN completion_percentage = 100 THEN 1 END) as completed_students,
    COUNT(CASE WHEN completion_percentage > 0 AND completion_percentage < 100 THEN 1 END) as in_progress_students,
    COUNT(CASE WHEN completion_percentage = 0 THEN 1 END) as not_started_students,
    SUM(total_time_spent) as total_course_time,
    MAX(last_activity) as most_recent_activity
FROM enrollment_progress
```

## Expected Data Structure

### Student Analytics Response:
```json
{
  "user": {"id": 1, "name": "Jane Student", "email": "student@test.com"},
  "course_progress": [
    {
      "course_id": 1,
      "course_title": "Web Development Basics",
      "total_lessons": 20,
      "completed_lessons": 8,
      "completion_percentage": 40.00,
      "total_time_spent": 14400,
      "last_activity": "2025-09-21T10:30:00Z",
      "status": "in_progress"
    }
  ],
  "learning_streak": {
    "current_streak": 5,
    "streak_start": "2025-09-17",
    "streak_end": "2025-09-21",
    "total_lessons_in_streak": 12
  },
  "recent_activity": [...],
  "total_statistics": {
    "total_courses_enrolled": 3,
    "total_lessons_completed": 25,
    "total_time_spent": 36000,
    "active_days": 15
  }
}
```

### Instructor Analytics Response:
```json
{
  "instructor": {"id": 2, "name": "John Instructor", "email": "instructor@test.com"},
  "course_analytics": [
    {
      "course": {...},
      "statistics": {
        "total_students": 150,
        "avg_completion_percentage": 72.5,
        "completed_students": 45,
        "in_progress_students": 89,
        "not_started_students": 16,
        "total_course_time": 540000,
        "most_recent_activity": "2025-09-21T15:45:00Z"
      }
    }
  ]
}
```

## Performance Considerations

1. **Indexes**: The progress table has indexes on `(lesson_id, user_id)` and `(user_id, lesson_id)`
2. **Window Functions**: Efficiently calculate running totals and percentages
3. **CTEs**: Break complex queries into readable, maintainable parts
4. **JSON Aggregation**: Return structured data in single queries

## Next Steps

- Test with large datasets to verify performance
- Add caching for frequently accessed analytics
- Implement real-time progress updates via WebSockets
- Add more sophisticated learning analytics (time patterns, difficulty analysis)