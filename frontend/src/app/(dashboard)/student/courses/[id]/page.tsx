"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { coursesApi, Course, Lesson } from "@/lib/api/courses";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useToast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LessonPlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Keyboard navigation hook
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && !e.ctrlKey && !e.metaKey) {
        navigateToNext();
      }
      if (e.key === "ArrowLeft" && !e.ctrlKey && !e.metaKey) {
        navigateToPrevious();
      }
      if (e.key === "Escape") {
        setSidebarOpen(!sidebarOpen);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentLessonIndex, allLessons.length, sidebarOpen]);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const [courseResponse, progressResponse] = await Promise.all([
        coursesApi.getCourse(Number(id)),
        coursesApi.student.getCourseProgress(Number(id)),
      ]);

      if (courseResponse.success) {
        const courseData = courseResponse.data;
        setCourse(courseData);

        // Flatten all lessons from all modules
        const lessons: Lesson[] = [];
        courseData.modules?.forEach((module) => {
          module.lessons?.forEach((lesson) => {
            lessons.push({
              ...lesson,
              moduleTitle: module.title,
            } as Lesson & { moduleTitle: string });
          });
        });

        setAllLessons(lessons);

        // Set first lesson as current if available
        if (lessons.length > 0) {
          setCurrentLesson(lessons[0]);
          setCurrentLessonIndex(0);
        }
      }

      if (progressResponse.success) {
        // Extract completed lesson IDs from progress data
        const completed =
          progressResponse.data.module_progress?.flatMap(
            (moduleProgress) => moduleProgress.completed_lessons || []
          ) || [];
        setCompletedLessons(completed);
      }
    } catch (error) {
      console.error("Error loading course:", error);
      toast({
        title: "Error",
        description: "Failed to load course content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(nextIndex);
      setCurrentLesson(allLessons[nextIndex]);
    }
  };

  const navigateToPrevious = () => {
    if (currentLessonIndex > 0) {
      const prevIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(prevIndex);
      setCurrentLesson(allLessons[prevIndex]);
    }
  };

  const markLessonComplete = async () => {
    if (!currentLesson) return;

    try {
      const response = await coursesApi.student.completeLesson(
        currentLesson.id
      );
      if (response.success) {
        setCompletedLessons((prev) => [...prev, currentLesson.id]);
        toast({
          title: "Lesson Completed!",
          description: "Great job! Keep up the learning momentum.",
        });

        // Auto-navigate to next lesson
        setTimeout(() => {
          navigateToNext();
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to mark lesson as complete",
        variant: "destructive",
      });
    }
  };

  const selectLesson = (lesson: Lesson, index: number) => {
    setCurrentLesson(lesson);
    setCurrentLessonIndex(index);
  };

  const courseProgress = course?.progress?.progress_percentage || 0;
  const completedCount = completedLessons.length;
  const totalLessons = allLessons.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading course content...
          </p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button asChild>
            <Link href="/student">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-card border-r transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-80" : "w-0"
        )}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold truncate">{course.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>
                {completedCount}/{totalLessons} lessons
              </span>
            </div>
            <Progress value={courseProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(courseProgress)}% complete
            </p>
          </div>
        </div>

        {/* Lesson List */}
        <div className="overflow-y-auto flex-1">
          <Accordion type="multiple" className="w-full">
            {course.modules?.map((module, moduleIndex) => (
              <AccordionItem key={module.id} value={`module-${module.id}`}>
                <AccordionTrigger className="px-4 py-3 text-left hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-2">
                    <span className="font-medium text-sm">
                      {moduleIndex + 1}. {module.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {module.lessons?.length} lessons
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="space-y-1">
                    {module.lessons?.map((lesson) => {
                      const lessonIndex = allLessons.findIndex(
                        (l) => l.id === lesson.id
                      );
                      const isActive = currentLesson?.id === lesson.id;
                      const isCompleted = completedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => selectLesson(lesson, lessonIndex)}
                          className={cn(
                            "w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-l-2 flex items-center justify-between",
                            isActive
                              ? "border-l-primary bg-muted"
                              : "border-l-transparent"
                          )}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {isCompleted ? (
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Play className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="text-sm truncate">
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {lesson.duration}min
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/student")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Lesson {currentLessonIndex + 1} of {totalLessons}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToPrevious}
                disabled={currentLessonIndex === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToNext}
                disabled={currentLessonIndex === allLessons.length - 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6">
              {/* Lesson Header */}
              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                  <span>{(currentLesson as any).moduleTitle}</span>
                  <span>•</span>
                  <span>Lesson {currentLessonIndex + 1}</span>
                </div>
                <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
              </div>

              {/* Video Player Placeholder */}
              {currentLesson.video_url && (
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-75" />
                        <p className="text-lg">Video Player</p>
                        <p className="text-sm opacity-75">
                          Duration: {currentLesson.duration} minutes
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lesson Content */}
              {currentLesson.content && (
                <Card>
                  <CardHeader>
                    <CardTitle>Lesson Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {/* This would normally render markdown */}
                      <div className="whitespace-pre-wrap">
                        {currentLesson.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lesson Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {completedLessons.includes(currentLesson.id) ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Lesson Completed
                    </div>
                  ) : (
                    <Button onClick={markLessonComplete}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={navigateToPrevious}
                    disabled={currentLessonIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={navigateToNext}
                    disabled={currentLessonIndex === allLessons.length - 1}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Navigation Hint */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground text-center">
                    💡 <strong>Tip:</strong> Use arrow keys (← →) to navigate
                    between lessons, or press Escape to toggle the sidebar
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
