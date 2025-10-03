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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Filter,
  Flame,
  Target,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { coursesApi, Course, Category } from "@/lib/api/courses";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [enrolledResponse, coursesResponse, categoriesResponse] = await Promise.all([
        coursesApi.student.getEnrolledCourses(),
        coursesApi.getCourses(),
        coursesApi.getCategories(),
      ]);

      if (enrolledResponse.success) {
        setEnrolledCourses(enrolledResponse.data);
      }
      if (coursesResponse.success) {
        setAllCourses(coursesResponse.data);
      }
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category_id.toString() === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    const notEnrolled = !enrolledCourses.some(enrolled => enrolled.id === course.id);
    
    return matchesSearch && matchesCategory && matchesLevel && notEnrolled;
  });

  // Student stats
  const studentStats = {
    totalCourses: enrolledCourses.length,
    completedCourses: enrolledCourses.filter(c => c.progress?.progress_percentage === 100).length,
    totalHoursLearned: enrolledCourses.reduce((acc, course) => acc + (course.progress?.time_spent_minutes || 0), 0) / 60,
    streak: 5,
  };

  // Recent activity (mock data - replace with real API)
  const recentActivity = [
    {
      type: "lesson_completed",
      message: "Completed lesson: React Hooks Deep Dive",
      time: "2 hours ago",
      course: "Introduction to React",
    },
    {
      type: "quiz_passed",
      message: "Passed quiz with 85% score",
      time: "1 day ago",
      course: "JavaScript Fundamentals",
    },
    {
      type: "course_enrolled",
      message: "Enrolled in new course",
      time: "3 days ago",
      course: "UI/UX Design Fundamentals",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["student"]}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100 mt-1">Continue your learning journey</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-blue-100">
                <Flame className="h-5 w-5" />
                <span className="text-sm">Streak: {studentStats.streak} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                  <p className="text-2xl font-bold">{studentStats.totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{studentStats.completedCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Hours Learned</p>
                  <p className="text-2xl font-bold">{Math.round(studentStats.totalHoursLearned)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Daily Goal</p>
                  <p className="text-2xl font-bold">75%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="learning" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="learning">Continue Learning</TabsTrigger>
            <TabsTrigger value="discover">Discover Courses</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Continue Learning Tab */}
          <TabsContent value="learning" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <Button variant="outline" size="sm">
                View All Courses
              </Button>
            </div>

            {enrolledCourses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Enrolled Courses</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Button onClick={() => {
                    const discoverTab = document.querySelector('[value="discover"]') as HTMLElement;
                    discoverTab?.click();
                  }}>
                    Discover Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-md mb-2 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <CardDescription className="text-sm">
                        by {course.instructor?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress?.progress_percentage || 0}%</span>
                        </div>
                        <Progress value={course.progress?.progress_percentage || 0} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{course.progress?.completed_lessons || 0} / {course.progress?.total_lessons || 0} lessons</span>
                          <span>{Math.round((course.progress?.time_spent_minutes || 0) / 60)}h studied</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button asChild className="w-full">
                        <Link href={`/student/courses/${course.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Continue Learning
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Discover Courses Tab */}
          <TabsContent value="discover" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Discover New Courses</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-2 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <Badge variant={course.level === "beginner" ? "secondary" : course.level === "intermediate" ? "default" : "destructive"}>
                        {course.level}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">
                      by {course.instructor?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold">${course.price}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {course.duration}h
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.id}`}>
                        View Course
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Courses Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or explore different categories
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="outline" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.course} • {activity.time}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {recentActivity.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                  <p className="text-muted-foreground">
                    Start learning to see your activity here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
