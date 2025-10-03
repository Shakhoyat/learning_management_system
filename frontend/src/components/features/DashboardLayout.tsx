"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Navigation } from "@/components/features/Navigation";
import { LoadingPage } from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function DashboardLayout({
  children,
  allowedRoles,
}: DashboardLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }

    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard if user doesn't have access
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
          router.push("/");
      }
    }
  }, [user, loading, isAuthenticated, router, allowedRoles]);

  if (loading) {
    return <LoadingPage message="Loading your dashboard..." />;
  }

  if (!isAuthenticated) {
    return <LoadingPage message="Redirecting to login..." />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <LoadingPage message="Redirecting to your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
