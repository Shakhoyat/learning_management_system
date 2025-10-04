"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { coursesApi, Course } from "@/lib/api/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Lock,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useToast } from "@/lib/hooks/use-toast";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await coursesApi.getCourse(Number(id));
      if (response.success) {
        setCourse(response.data);

        // Check if user is enrolled (if authenticated)
        if (isAuthenticated) {
          try {
            const enrollmentsResponse =
              await coursesApi.student.getEnrollments();
            if (enrollmentsResponse.success) {
              const isUserEnrolled = enrollmentsResponse.data.some(
                (enrollment) =>
                  enrollment.course_id === Number(id) &&
                  enrollment.status === "active"
              );
              setIsEnrolled(isUserEnrolled);
            }
          } catch (error) {
            console.error("Error checking enrollment:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error loading course:", error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setEnrolling(true);

      // For free courses, enroll directly
      if (course?.price === 0) {
        const response = await coursesApi.student.enrollCourse(Number(id));
        if (response.success) {
          setIsEnrolled(true);
          toast({
            title: "Enrollment Successful!",
            description: "You have been enrolled in this course.",
          });
        }
      } else {
        // For paid courses, redirect to payment (mock implementation)
        const paymentDetails = {
          payment_method: "card",
          payment_details: {
            card_number: "4111111111111111",
            expiry_month: "12",
            expiry_year: "2025",
            cvv: "123",
          },
        };

        const response = await coursesApi.student.enrollCourse(
          Number(id),
          paymentDetails
        );
        if (response.success) {
          setIsEnrolled(true);
          toast({
            title: "Enrollment Successful!",
            description:
              "Payment processed and you've been enrolled in the course.",
          });
        }
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description:
          error.response?.data?.message || "Failed to enroll in course",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    router.push(`/student/courses/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading course details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/student">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        course.level === "beginner"
                          ? "secondary"
                          : course.level === "intermediate"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {course.level}
                    </Badge>
                    <Badge variant="outline">{course.category?.name}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-base">
                    {course.description}
                  </CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarFallback>
                          {course.instructor?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {course.instructor?.name}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {course.duration} hours
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4" />
                      {course.modules?.reduce(
                        (acc, module) => acc + (module.lessons?.length || 0),
                        0
                      )}{" "}
                      lessons
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Course Content */}
          <Tabs defaultValue="curriculum" className="space-y-4">
            <TabsList>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>
                    {course.modules?.length} modules •{" "}
                    {course.modules?.reduce(
                      (acc, module) => acc + (module.lessons?.length || 0),
                      0
                    )}{" "}
                    lessons
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.modules?.map((module, moduleIndex) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {module.description}
                        </p>
                      )}
                      <div className="space-y-2">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded"
                          >
                            <div className="flex items-center space-x-2">
                              {lesson.is_free || isEnrolled ? (
                                <Play className="h-4 w-4 text-green-600" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                              {lesson.is_free && !isEnrolled && (
                                <Badge variant="secondary" className="text-xs">
                                  Free
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {lesson.duration}min
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {course.instructor?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">
                        {course.instructor?.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {course.instructor?.email}
                      </p>
                      <p className="mt-2 text-sm">
                        Experienced instructor with expertise in{" "}
                        {course.category?.name.toLowerCase()}.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review this course!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Preview */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-t-lg flex items-center justify-center">
                <Play className="h-12 w-12 text-blue-600" />
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </div>
                  {course.price > 0 && (
                    <p className="text-sm text-muted-foreground">
                      One-time payment
                    </p>
                  )}
                </div>

                {isEnrolled ? (
                  <Button
                    onClick={handleStartLearning}
                    className="w-full"
                    size="lg"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full"
                    size="lg"
                  >
                    {enrolling ? (
                      "Enrolling..."
                    ) : (
                      <>
                        {course.price === 0 ? (
                          <>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Enroll for Free
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Enroll Now
                          </>
                        )}
                      </>
                    )}
                  </Button>
                )}

                <div className="text-xs text-center text-muted-foreground">
                  30-day money-back guarantee
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Level</span>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-sm font-medium">
                  {course.duration} hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lessons</span>
                <span className="text-sm font-medium">
                  {course.modules?.reduce(
                    (acc, module) => acc + (module.lessons?.length || 0),
                    0
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="text-sm font-medium">
                  {course.category?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Language</span>
                <span className="text-sm font-medium">English</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
