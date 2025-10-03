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
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/80 to-white pt-16 md:pt-24 lg:pt-32">
        <div className="container relative z-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              Learn{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Anything
              </span>
              ,
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Anywhere
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-muted-foreground">
              Join thousands of learners on our modern Learning Management
              System. Access high-quality courses, track your progress, and
              achieve your learning goals.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-8 shadow-lg transition-all hover:shadow-blue-200/50"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute left-0 top-24 -z-10 h-64 w-64 rounded-full bg-blue-100 blur-3xl"></div>
        <div className="absolute right-0 top-48 -z-10 h-72 w-72 rounded-full bg-indigo-100 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="container py-24">
        <div className="mx-auto mb-16 flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Our LMS?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience modern learning with features designed for both students
            and instructors
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="border-0 shadow-md transition-all hover:shadow-xl">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                >
                  <path
                    d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl">Rich Course Content</CardTitle>
              <CardDescription>
                Interactive lessons with videos, quizzes, and downloadable
                resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Engage with multimedia content designed to enhance your learning
                experience
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md transition-all hover:shadow-xl">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                >
                  <path
                    d="M18 20V10M12 20V4M6 20V14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl">Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your learning journey with detailed analytics and
                insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get real-time feedback on your progress and identify areas for
                improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md transition-all hover:shadow-xl">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                >
                  <path
                    d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88M19.5 9C19.5 9.62 19.4 10.19 19.21 10.72C18.7514 10.9068 18.2866 11.0784 17.81 11.23C16.94 11.5 16.01 11.68 15.04 11.68C14.07 11.68 13.13 11.5 12.27 11.23C11.0053 10.7522 9.80949 10.0796 8.73 9.23C8.73 9.23 8.73 9.23 8.72 9.22C8.43 8.97 8.15 8.71 7.89 8.43C6.8297 7.26528 6.14617 7.35101 5.53 7.44L5.5 7.44L5.5 7.45C5.3433 7.46866 5.18916 7.50313 5.04 7.55C5.01427 7.36417 5.00075 7.17713 5 6.99C5 3.69 9.47 1 15.04 1C20.61 1 25.08 3.69 25.08 6.99C25.08 10.29 20.61 13 15.04 13C13.1084 13.0233 11.1916 12.6909 9.38 12.02"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <CardTitle className="text-xl">Certificates</CardTitle>
              <CardDescription>
                Earn verified certificates upon successful course completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Showcase your achievements with industry-recognized
                certifications
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 py-24">
        <div className="container relative z-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join our community of learners and unlock your potential today
            </p>
            <Link href="/register" className="mt-8">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 font-medium shadow-lg"
              >
                Create Your Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      </section>
    </div>
  );
}
