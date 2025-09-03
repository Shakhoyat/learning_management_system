<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Enrollment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border: 1px solid #e9ecef;
        }
        .footer {
            background: #343a40;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
        }
        .course-info {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .details-table th,
        .details-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        .details-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Enrollment Confirmed!</h1>
        <p>Welcome to your learning journey</p>
    </div>

    <div class="content">
        <h2>Hello {{ $user->name }},</h2>
        
        <p>Congratulations! You have successfully enrolled in <strong>{{ $course->title }}</strong>.</p>

        <div class="course-info">
            <h3>{{ $course->title }}</h3>
            <p><strong>Instructor:</strong> {{ $instructor->name }}</p>
            <p><strong>Description:</strong> {{ $course->short_description ?? 'Start your learning journey with this amazing course.' }}</p>
            
            @if($course->duration_hours)
                <p><strong>Duration:</strong> {{ $course->duration_hours }} hours</p>
            @endif
            
            @if($course->level)
                <p><strong>Level:</strong> {{ ucfirst($course->level) }}</p>
            @endif
        </div>

        <table class="details-table">
            <tr>
                <th>Enrollment Details</th>
                <th>Information</th>
            </tr>
            <tr>
                <td>Enrollment Date</td>
                <td>{{ $enrollment->enrolled_at->format('F j, Y \a\t g:i A') }}</td>
            </tr>
            <tr>
                <td>Payment Status</td>
                <td>
                    @if($enrollment->payment_status === 'paid')
                        <span style="color: #28a745; font-weight: bold;">✅ Paid</span>
                    @elseif($enrollment->payment_status === 'pending')
                        <span style="color: #ffc107; font-weight: bold;">⏳ Pending</span>
                    @else
                        <span style="color: #dc3545; font-weight: bold;">❌ {{ ucfirst($enrollment->payment_status) }}</span>
                    @endif
                </td>
            </tr>
            <tr>
                <td>Amount Paid</td>
                <td>
                    @if($enrollment->amount_paid > 0)
                        ${{ number_format($enrollment->amount_paid, 2) }}
                    @else
                        <span style="color: #28a745; font-weight: bold;">FREE</span>
                    @endif
                </td>
            </tr>
            <tr>
                <td>Status</td>
                <td>{{ ucfirst($enrollment->status) }}</td>
            </tr>
        </table>

        <div style="text-align: center;">
            <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/courses/{{ $course->slug }}" class="btn">
                Start Learning Now
            </a>
        </div>

        <h3>What's Next?</h3>
        <ul>
            <li>Access your course materials immediately</li>
            <li>Track your progress through the course dashboard</li>
            <li>Interact with your instructor and fellow students</li>
            <li>Earn a certificate upon completion</li>
        </ul>

        <p>If you have any questions about your enrollment or need help getting started, please don't hesitate to contact our support team.</p>

        <p>Happy learning!</p>
    </div>

    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name', 'LMS Platform') }}. All rights reserved.</p>
        <p>
            <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/support" style="color: #adb5bd;">Support</a> |
            <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/privacy" style="color: #adb5bd;">Privacy Policy</a> |
            <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}/terms" style="color: #adb5bd;">Terms of Service</a>
        </p>
    </div>
</body>
</html>