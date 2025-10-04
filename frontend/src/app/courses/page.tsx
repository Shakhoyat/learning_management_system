"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { coursesApi, Course, Category } from "@/lib/api/courses";
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
import { Input } from "@/components/ui/input";
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
  Users,
  Star,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  Grid,
  List,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";

export default function CourseBrowsePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Reset and reload when filters change
    setCurrentPage(1);
    setCourses([]);
    setHasMore(true);
    loadCourses(1, true);
  }, [searchTerm, selectedCategory, selectedLevel]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, enrolledResponse] = await Promise.all([
        coursesApi.getCategories(),
        isAuthenticated
          ? coursesApi.student.getEnrolledCourses()
          : Promise.resolve({ success: true, data: [] }),
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }

      if (enrolledResponse.success) {
        setEnrolledCourses(enrolledResponse.data);
      }

      await loadCourses(1, true);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async (page: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoadingMore(true);
      }

      const response = await coursesApi.getCourses({
        search: searchTerm || undefined,
        category_id:
          selectedCategory !== "all" ? parseInt(selectedCategory) : undefined,
        level: selectedLevel !== "all" ? selectedLevel : undefined,
        page,
        per_page: 12,
      });

      if (response.success) {
        const newCourses = response.data;

        if (reset) {
          setCourses(newCourses);
        } else {
          setCourses((prev) => [...prev, ...newCourses]);
        }

        // Check if there are more pages
        const meta = response.meta;
        if (meta) {
          setHasMore(meta.current_page < meta.last_page);
        } else {
          setHasMore(newCourses.length === 12); // Assume there might be more if we got a full page
        }
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadCourses(nextPage, false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const notEnrolled = !enrolledCourses.some(
      (enrolled) => enrolled.id === course.id
    );
    return notEnrolled;
  });

  const isEnrolled = (courseId: number) => {
    return enrolledCourses.some((enrolled) => enrolled.id === courseId);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Browse Courses</h1>
            <p className="text-muted-foreground">
              Discover new skills and advance your career
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

      {/* Results Info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCourses.length} courses
        </p>
        {enrolledCourses.length > 0 && (
          <p className="text-sm text-muted-foreground">
            You're enrolled in {enrolledCourses.length} courses
          </p>
        )}
      </div>

      {/* Course Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-2 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base line-clamp-1">
                    {course.title}
                  </CardTitle>
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
                </div>
                <CardDescription className="text-sm">
                  by {course.instructor?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {course.duration}h
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                {isEnrolled(course.id) ? (
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/student/courses/${course.id}`}>
                      Continue Learning
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/courses/${course.id}`}>
                      View Course
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold">
                            {course.title}
                          </h3>
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
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {course.instructor?.name}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold mb-2">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Clock className="mr-1 h-3 w-3" />
                          {course.duration}h
                        </div>
                        {isEnrolled(course.id) ? (
                          <Button asChild variant="outline">
                            <Link href={`/student/courses/${course.id}`}>
                              Continue Learning
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild>
                            <Link href={`/courses/${course.id}`}>
                              View Course
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && filteredCourses.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? "Loading..." : "Load More Courses"}
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredCourses.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Courses Found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or explore different categories
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLevel("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
