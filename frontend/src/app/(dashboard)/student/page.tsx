"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { DashboardLayout } from "@/components/features/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Play,
  Calendar,
  Users,
  Star
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to React",
      instructor: "John Doe",
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: "React Hooks Deep Dive",
      thumbnail: "/course-thumbnails/react.jpg",
      estimatedTime: "2h 30m remaining"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      instructor: "Jane Smith",
      progress: 30,
      totalLessons: 18,
      completedLessons: 5,
      nextLesson: "Async/Await Patterns",
      thumbnail: "/course-thumbnails/js.jpg",
      estimatedTime: "6h 45m remaining"
    },
    {
      id: 3,
      title: "Database Design",
      instructor: "Mike Johnson",
      progress: 85,
      totalLessons: 15,
      completedLessons: 13,
      nextLesson: "Performance Optimization",
      thumbnail: "/course-thumbnails/db.jpg",
      estimatedTime: "1h 15m remaining"
    }
  ];

  const recentActivity = [
    {
      type: "lesson_completed",
      title: "React State Management",
      course: "Introduction to React",
      timestamp: "2 hours ago"
    },
    {
      type: "quiz_completed",
      title: "JavaScript Fundamentals Quiz",
      course: "Advanced JavaScript",
      score: 85,
      timestamp: "1 day ago"
    },
    {
      type: "course_enrolled",
      title: "Database Design",
      timestamp: "3 days ago"
    }
  ];

  const stats = {
    totalCourses: enrolledCourses.length,
    completedCourses: 2,
    totalHours: 45.5,
    averageProgress: Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / enrolledCourses.length)
  };

  return (
    <DashboardLayout allowedRoles={["student"]}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Continue your learning journey and achieve your goals.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                  <p className="text-2xl font-bold">{stats.totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{stats.completedCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                  <p className="text-2xl font-bold">{stats.totalHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                  <p className="text-2xl font-bold">{stats.averageProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.instructor}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {course.progress}%
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <Progress value={course.progress} className="w-full" />
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span>{course.estimatedTime}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Next lesson:</p>
                      <p className="text-sm text-gray-600">{course.nextLesson}</p>
                    </div>
                    
                    <Button className="w-full" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your learning activity from the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === "lesson_completed" && (
                          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                        {activity.type === "quiz_completed" && (
                          <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Star className="h-4 w-4 text-yellow-600" />
                          </div>
                        )}
                        {activity.type === "course_enrolled" && (
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.course && `in ${activity.course}`}
                          {activity.score && ` • Score: ${activity.score}%`}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {activity.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* My Courses Card */}
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                View and continue your enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
              <p className="text-sm text-gray-600 mb-4">Enrolled courses</p>
              <Button className="w-full">Browse Courses</Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Track your overall learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">0%</div>
              <p className="text-sm text-gray-600 mb-4">Completion rate</p>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>

          {/* Certificates Card */}
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>View your earned certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
              <p className="text-sm text-gray-600 mb-4">Certificates earned</p>
              <Button variant="outline" className="w-full">
                View All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest learning activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No recent activity to display. Start learning to see your
                progress here!
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
