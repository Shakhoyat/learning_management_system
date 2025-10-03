"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, User } from "@/lib/api/auth";
import { useToast } from "@/lib/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    role?: "student" | "instructor"
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = await authApi.me();
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem("token");
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);
      setUser(response.user);

      toast({
        title: "Welcome back!",
        description: `Logged in successfully as ${response.user.name}`,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        "Login failed. Please try again.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    role: "student" | "instructor" = "student"
  ) => {
    try {
      const response = await authApi.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      localStorage.setItem("token", response.token);
      setUser(response.user);

      toast({
        title: "Account Created!",
        description: `Welcome to LMS Platform, ${response.user.name}!`,
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
