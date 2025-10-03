/**
 * Comprehensive API Testing Script for LMS Backend
 * This script tests all available endpoints for your Laravel backend
 * Use this to understand the API structure while building your Next.js frontend
 */

const BASE_URL = "http://localhost:8000/api";

class LMSApiTester {
  constructor() {
    this.tokens = {
      admin: null,
      instructor: null,
      student: null,
    };
    this.testData = {
      users: {},
      courses: {},
      enrollments: {},
      quizzes: {},
    };
  }

  // Utility method to make HTTP requests
  async makeRequest(method, endpoint, data = null, token = null) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      console.log(`\n📡 ${method} ${endpoint}`);
      console.log(`Status: ${response.status}`);
      console.log("Response:", JSON.stringify(result, null, 2));

      return {
        success: response.ok,
        status: response.status,
        data: result,
      };
    } catch (error) {
      console.error(`❌ Error in ${method} ${endpoint}:`, error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 1. Authentication Tests
  async testAuthentication() {
    console.log("\n🔐 TESTING AUTHENTICATION ENDPOINTS");
    console.log("=".repeat(50));

    // Test user registration
    const users = [
      {
        name: "Admin User",
        email: "admin@test.com",
        password: "password123",
        password_confirmation: "password123",
        role: "admin",
      },
      {
        name: "Instructor User",
        email: "instructor@test.com",
        password: "password123",
        password_confirmation: "password123",
        role: "instructor",
      },
      {
        name: "Student User",
        email: "student@test.com",
        password: "password123",
        password_confirmation: "password123",
        role: "student",
      },
    ];

    // Register users
    for (const user of users) {
      const response = await this.makeRequest("POST", "/auth/register", user);
      if (response.success) {
        this.testData.users[user.role] = user;
        this.tokens[user.role] = response.data.token;
      }
    }

    // Test login
    for (const role of ["admin", "instructor", "student"]) {
      if (this.testData.users[role]) {
        const loginData = {
          email: this.testData.users[role].email,
          password: this.testData.users[role].password,
        };
        const response = await this.makeRequest(
          "POST",
          "/auth/login",
          loginData
        );
        if (response.success) {
          this.tokens[role] = response.data.token;
        }
      }
    }

    // Test get user profile
    for (const role of ["admin", "instructor", "student"]) {
      if (this.tokens[role]) {
        await this.makeRequest("GET", "/auth/user", null, this.tokens[role]);
      }
    }

    // Test password reset (without actually sending email)
    await this.makeRequest("POST", "/auth/forgot-password", {
      email: "student@test.com",
    });
  }

  // 2. Course Management Tests
  async testCourseManagement() {
    console.log("\n📚 TESTING COURSE MANAGEMENT ENDPOINTS");
    console.log("=".repeat(50));

    // Test get categories (public)
    await this.makeRequest("GET", "/categories");

    // Test get all courses (public)
    await this.makeRequest("GET", "/courses");

    // Test course search
    await this.makeRequest("GET", "/courses?search=javascript");

    // Test filter by category
    await this.makeRequest("GET", "/courses?category_id=1");

    // Test create course (instructor only)
    if (this.tokens.instructor) {
      const courseData = {
        title: "JavaScript Fundamentals",
        description: "Learn the basics of JavaScript programming",
        category_id: 1,
        level: "beginner",
        duration: 40,
        price: 99.99,
        image_url: "https://example.com/js-course.jpg",
      };

      const response = await this.makeRequest(
        "POST",
        "/instructor/courses",
        courseData,
        this.tokens.instructor
      );
      if (response.success) {
        this.testData.courses.javascript = response.data.data;
      }
    }

    // Test get course details (public)
    if (this.testData.courses.javascript) {
      await this.makeRequest(
        "GET",
        `/courses/${this.testData.courses.javascript.id}`
      );
    }

    // Test update course (instructor only)
    if (this.tokens.instructor && this.testData.courses.javascript) {
      const updateData = {
        title: "Advanced JavaScript Fundamentals",
        description: "Learn advanced JavaScript programming concepts",
        level: "intermediate",
        price: 149.99,
      };
      await this.makeRequest(
        "PUT",
        `/instructor/courses/${this.testData.courses.javascript.id}`,
        updateData,
        this.tokens.instructor
      );
    }
  }

  // 3. Enrollment Tests
  async testEnrollments() {
    console.log("\n🎓 TESTING ENROLLMENT ENDPOINTS");
    console.log("=".repeat(50));

    if (this.tokens.student && this.testData.courses.javascript) {
      // Test course enrollment
      const enrollmentData = {
        payment_method: "card",
        payment_details: {
          card_number: "4111111111111111",
          expiry_month: "12",
          expiry_year: "2025",
          cvv: "123",
        },
      };

      const response = await this.makeRequest(
        "POST",
        `/student/courses/${this.testData.courses.javascript.id}/enroll`,
        enrollmentData,
        this.tokens.student
      );
      if (response.success) {
        this.testData.enrollments.javascript = response.data;
      }

      // Test get user enrollments
      await this.makeRequest(
        "GET",
        "/student/enrollments",
        null,
        this.tokens.student
      );
    }
  }

  // 4. Progress Tracking Tests
  async testProgressTracking() {
    console.log("\n📈 TESTING PROGRESS TRACKING ENDPOINTS");
    console.log("=".repeat(50));

    if (this.tokens.student && this.testData.courses.javascript) {
      // Test get course progress
      await this.makeRequest(
        "GET",
        `/student/courses/${this.testData.courses.javascript.id}/progress`,
        null,
        this.tokens.student
      );

      // Test complete lesson (assuming lesson ID 1 exists)
      await this.makeRequest(
        "POST",
        "/student/lessons/1/complete",
        {},
        this.tokens.student
      );

      // Test get user analytics
      await this.makeRequest(
        "GET",
        "/student/analytics",
        null,
        this.tokens.student
      );
    }

    if (this.tokens.instructor && this.testData.courses.javascript) {
      // Test instructor analytics
      await this.makeRequest(
        "GET",
        "/instructor/analytics",
        null,
        this.tokens.instructor
      );

      // Test course student progress
      await this.makeRequest(
        "GET",
        `/instructor/courses/${this.testData.courses.javascript.id}/students/progress`,
        null,
        this.tokens.instructor
      );
    }
  }

  // 5. Quiz System Tests
  async testQuizSystem() {
    console.log("\n🧩 TESTING QUIZ SYSTEM ENDPOINTS");
    console.log("=".repeat(50));

    const lessonId = 1; // Assuming lesson ID 1 exists

    // Test get quizzes for lesson (public)
    await this.makeRequest("GET", `/test/lessons/${lessonId}/quizzes`);

    if (this.tokens.instructor) {
      // Test create quiz (instructor only)
      const quizData = {
        title: "JavaScript Basics Quiz",
        description: "Test your knowledge of JavaScript fundamentals",
        instructions: "Answer all questions to the best of your ability",
        time_limit_minutes: 30,
        max_attempts: 3,
        passing_score: 70,
        shuffle_questions: true,
        show_results_immediately: true,
        allow_review: true,
        questions: [
          {
            type: "multiple_choice",
            question:
              "What is the correct way to declare a variable in JavaScript?",
            options: [
              "var x = 5;",
              "variable x = 5;",
              "v x = 5;",
              "declare x = 5;",
            ],
            correct_answers: ["var x = 5;"],
            explanation:
              "Variables in JavaScript are declared using var, let, or const keywords.",
            points: 10,
            case_sensitive: false,
          },
          {
            type: "true_false",
            question: "JavaScript is a case-sensitive language.",
            options: ["True", "False"],
            correct_answers: ["True"],
            explanation: "JavaScript is indeed case-sensitive.",
            points: 5,
            case_sensitive: false,
          },
        ],
      };

      const response = await this.makeRequest(
        "POST",
        `/instructor/lessons/${lessonId}/quizzes`,
        quizData,
        this.tokens.instructor
      );
      if (response.success) {
        this.testData.quizzes.javascript = response.data.data;
      }
    }

    if (this.tokens.student && this.testData.quizzes.javascript) {
      const quizId = this.testData.quizzes.javascript.id;

      // Test get quiz details
      await this.makeRequest(
        "GET",
        `/student/lessons/${lessonId}/quizzes/${quizId}`,
        null,
        this.tokens.student
      );

      // Test start quiz attempt
      const attemptResponse = await this.makeRequest(
        "POST",
        `/student/lessons/${lessonId}/quizzes/${quizId}/attempts`,
        {},
        this.tokens.student
      );

      if (attemptResponse.success) {
        const attemptId = attemptResponse.data.data.id;

        // Test submit answer
        await this.makeRequest(
          "POST",
          `/student/quiz-attempts/${attemptId}/answers`,
          {
            question_id: 1,
            answer: "var x = 5;",
          },
          this.tokens.student
        );

        // Test submit quiz
        await this.makeRequest(
          "POST",
          `/student/quiz-attempts/${attemptId}/submit`,
          {},
          this.tokens.student
        );
      }
    }
  }

  // 6. Admin Dashboard Tests
  async testAdminDashboard() {
    console.log("\n👑 TESTING ADMIN DASHBOARD ENDPOINTS");
    console.log("=".repeat(50));

    if (this.tokens.admin) {
      // Test admin dashboard
      await this.makeRequest(
        "GET",
        "/admin/dashboard",
        null,
        this.tokens.admin
      );

      // Test get all users
      await this.makeRequest("GET", "/admin/users", null, this.tokens.admin);

      // Test promote user (if we have a student user)
      if (this.testData.users.student) {
        await this.makeRequest(
          "POST",
          "/admin/users/3/promote",
          {},
          this.tokens.admin
        );
      }
    }
  }

  // 7. Instructor Dashboard Tests
  async testInstructorDashboard() {
    console.log("\n👨‍🏫 TESTING INSTRUCTOR DASHBOARD ENDPOINTS");
    console.log("=".repeat(50));

    if (this.tokens.instructor) {
      // Test instructor dashboard
      await this.makeRequest(
        "GET",
        "/instructor/dashboard",
        null,
        this.tokens.instructor
      );

      // Test get instructor courses
      await this.makeRequest(
        "GET",
        "/instructor/courses",
        null,
        this.tokens.instructor
      );

      // Test get students
      await this.makeRequest(
        "GET",
        "/instructor/students",
        null,
        this.tokens.instructor
      );

      if (this.testData.quizzes.javascript) {
        // Test quiz analytics
        await this.makeRequest(
          "GET",
          `/instructor/lessons/1/quizzes/${this.testData.quizzes.javascript.id}/analytics`,
          null,
          this.tokens.instructor
        );
      }
    }
  }

  // 8. Student Dashboard Tests
  async testStudentDashboard() {
    console.log("\n🎒 TESTING STUDENT DASHBOARD ENDPOINTS");
    console.log("=".repeat(50));

    if (this.tokens.student) {
      // Test student dashboard
      await this.makeRequest(
        "GET",
        "/student/dashboard",
        null,
        this.tokens.student
      );

      // Test get enrolled courses
      await this.makeRequest(
        "GET",
        "/student/courses",
        null,
        this.tokens.student
      );
    }
  }

  // 9. Email Verification Tests
  async testEmailVerification() {
    console.log("\n📧 TESTING EMAIL VERIFICATION ENDPOINTS");
    console.log("=".repeat(50));

    if (this.tokens.student) {
      // Test send verification email
      await this.makeRequest(
        "POST",
        "/auth/email/verification-notification",
        {},
        this.tokens.student
      );

      // Test verified-only route (will fail until email is verified)
      await this.makeRequest(
        "GET",
        "/verified-only",
        null,
        this.tokens.student
      );
    }
  }

  // 10. Logout Tests
  async testLogout() {
    console.log("\n🚪 TESTING LOGOUT ENDPOINTS");
    console.log("=".repeat(50));

    // Test logout for each user type
    for (const role of ["admin", "instructor", "student"]) {
      if (this.tokens[role]) {
        await this.makeRequest("POST", "/auth/logout", {}, this.tokens[role]);
      }
    }
  }

  // Run all tests
  async runAllTests() {
    console.log("🚀 Starting Comprehensive LMS API Testing");
    console.log("=".repeat(60));
    console.log("Base URL:", BASE_URL);
    console.log("=".repeat(60));

    try {
      await this.testAuthentication();
      await this.testCourseManagement();
      await this.testEnrollments();
      await this.testProgressTracking();
      await this.testQuizSystem();
      await this.testAdminDashboard();
      await this.testInstructorDashboard();
      await this.testStudentDashboard();
      await this.testEmailVerification();
      await this.testLogout();

      console.log("\n✅ All tests completed!");
      console.log("\n📊 TEST SUMMARY");
      console.log("=".repeat(30));
      console.log(
        "Tokens obtained:",
        Object.keys(this.tokens).filter((k) => this.tokens[k]).length
      );
      console.log(
        "Test data created:",
        Object.keys(this.testData).reduce(
          (acc, key) => acc + Object.keys(this.testData[key]).length,
          0
        )
      );
    } catch (error) {
      console.error("❌ Test execution failed:", error);
    }
  }
}

// Usage instructions
console.log(`
📋 USAGE INSTRUCTIONS:
1. Make sure your Laravel backend is running on http://localhost:8000
2. Run: node api-testing-script.js
3. Check the console output for API responses
4. Use the response formats to build your Next.js frontend

🔧 SETUP:
- Install dependencies: npm install node-fetch (if using Node.js < 18)
- Make sure your backend database is seeded with at least one category
- Ensure all migrations are run

💡 FRONTEND INTEGRATION TIPS:
- Use the response structures shown in console output
- Copy the request formats for your API calls
- Implement error handling based on the status codes shown
- Use the authentication token format: "Bearer <token>"
`);

// Run the tests
const tester = new LMSApiTester();
tester.runAllTests();
