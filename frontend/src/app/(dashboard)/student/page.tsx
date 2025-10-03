"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { DashboardLayout } from "@/components/features/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Users,
  Star,
  Calendar,
  Search,
  Bell,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

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
      estimatedTime: "2h 30m remaining",
      category: "Development",
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
      estimatedTime: "6h 45m remaining",
      category: "Development",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Sarah Johnson",
      progress: 80,
      totalLessons: 15,
      completedLessons: 12,
      nextLesson: "User Research Methods",
      thumbnail: "/course-thumbnails/uiux.jpg",
      estimatedTime: "1h 15m remaining",
      category: "Design",
    },
  ];

  const recommendedCourses = [
    {
      id: 4,
      title: "Complete Python Bootcamp",
      instructor: "Michael Roberts",
      rating: 4.8,
      students: 12453,
      price: "$39.99",
      thumbnail: "/course-thumbnails/python.jpg",
      category: "Development",
    },
    {
      id: 5,
      title: "Data Science Masterclass",
      instructor: "Lisa Wong",
      rating: 4.9,
      students: 8734,
      price: "$49.99",
      thumbnail: "/course-thumbnails/datascience.jpg",
      category: "Data Science",
    },
    {
      id: 6,
      title: "Digital Marketing Essentials",
      instructor: "Robert Green",
      rating: 4.7,
      students: 5621,
      price: "$29.99",
      thumbnail: "/course-thumbnails/marketing.jpg",
      category: "Marketing",
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "React Final Project",
      course: "Introduction to React",
      dueDate: "Oct 10, 2025",
      daysLeft: 7,
    },
    {
      id: 2,
      title: "Quiz: JavaScript Fundamentals",
      course: "Advanced JavaScript",
      dueDate: "Oct 5, 2025",
      daysLeft: 2,
    },
    {
      id: 3,
      title: "Design Case Study",
      course: "UI/UX Design Fundamentals",
      dueDate: "Oct 15, 2025",
      daysLeft: 12,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8 p-6 md:p-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || "Student"}</h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your learning journey
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-3 md:mt-0">
            <Button variant="outline" size="sm" className="h-9">
              <Search className="mr-2 h-4 w-4" />
              Find courses
            </Button>
            <Button size="sm" className="h-9">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">58%</div>
              <Progress value={58} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                +2.5% from last week
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-2">
                Out of 6 enrolled courses
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42h</div>
              <p className="text-xs text-muted-foreground mt-2">
                +5h from last week
              </p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Certificates</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-2">
                1 certificate pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="my-courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="my-courses" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-video w-full bg-gradient-to-br from-blue-100 to-indigo-100 relative">
                    {course.thumbnail && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg">
                          <Play className="h-5 w-5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {course.category}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <Avatar className="mr-1 h-4 w-4">
                        <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span>{course.estimatedTime}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full">Continue Learning</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">View All Courses</Button>
            </div>
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendedCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-video w-full bg-gradient-to-br from-blue-100 to-indigo-100"></div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                        {course.category}
                      </span>
                      <div className="flex items-center">
                        <Star className="mr-1 h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <Avatar className="mr-1 h-4 w-4">
                        <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {course.instructor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                      <div className="text-sm font-medium">{course.price}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full">Enroll Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline">Browse All Courses</Button>
            </div>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Manage your assignments and quiz deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          deadline.daysLeft <= 2 
                            ? "bg-red-100 text-red-700" 
                            : deadline.daysLeft <= 7 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{deadline.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {deadline.course} • Due {deadline.dueDate}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant={deadline.daysLeft <= 2 ? "default" : "outline"}
                        size="sm"
                      >
                        {deadline.daysLeft <= 2 ? "Submit now" : "View details"}
                      </Button>
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