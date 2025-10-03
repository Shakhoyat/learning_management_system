"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navigation } from "@/components/features/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      switch (user.role) {
        case "student":
          router.push("/student");
          break;
        case "instructor":
          router.push("/instructor");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/student");
      }
    }
  }, [user, loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Anything,
            <span className="text-blue-600"> Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of learners on our modern Learning Management System.
            Access high-quality courses, track your progress, and achieve your
            learning goals.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our LMS?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience modern learning with features designed for both students
            and instructors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📚 Rich Course Content</CardTitle>
              <CardDescription>
                Interactive lessons with videos, quizzes, and downloadable
                resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Engage with multimedia content designed to enhance your learning
                experience
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📊 Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your learning journey with detailed analytics and
                insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get real-time feedback on your progress and identify areas for
                improvement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">🏆 Certificates</CardTitle>
              <CardDescription>
                Earn verified certificates upon successful course completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Showcase your achievements with industry-recognized
                certifications
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community of learners and unlock your potential today
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
