"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Navigation } from "@/components/features/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please log in to access this page.</div>
      </div>
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
