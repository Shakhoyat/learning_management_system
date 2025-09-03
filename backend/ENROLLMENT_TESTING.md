# Test Enrollment System

## Test Data Setup

First, let's create some test data through the API:

### 1. Create Test Users
```bash
# Create an instructor
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Instructor",
    "email": "instructor@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "instructor"
  }'

# Create a student
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Student", 
    "email": "student@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "student"
  }'
```

### 2. Login as Student
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Test Course Enrollment

#### Enroll in a Free Course
```bash
curl -X POST http://localhost:8000/api/student/courses/1/enroll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

#### Enroll in a Paid Course (with payment simulation)
```bash
curl -X POST http://localhost:8000/api/student/courses/2/enroll \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "card",
    "payment_details": {
      "card_number": "4242424242424242",
      "exp_month": "12",
      "exp_year": "2025",
      "cvc": "123"
    }
  }'
```

### 4. Check User Enrollments
```bash
curl -X GET http://localhost:8000/api/student/enrollments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Behavior

1. **Free Course Enrollment:**
   - Should succeed immediately
   - Payment status: "paid"
   - Transaction status: "completed"
   - Email job queued

2. **Paid Course Enrollment:**
   - 85% chance of success
   - 15% chance of various failure scenarios
   - Database transaction ensures consistency
   - Email job queued only on success

3. **Database Consistency:**
   - All enrollment data saved atomically
   - Transaction records created for audit trail
   - Payment status properly tracked

4. **Email Notifications:**
   - Job queued for background processing
   - Professional HTML email sent
   - Includes course details and enrollment info

## Queue Processing

To process queued email jobs in development:

```bash
docker-compose exec app php artisan queue:work
```

## Monitoring

Check the jobs table to see queued emails:
```sql
SELECT * FROM jobs;
```

Check the failed_jobs table for any failures:
```sql 
SELECT * FROM failed_jobs;
```