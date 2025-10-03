"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, User } from "@/lib/api/auth";

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
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem("token", response.token);
      setUser(response.user);
    } catch (error) {
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
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if the API call fails, we should still clear local state
    } finally {
      localStorage.removeItem("token");
      setUser(null);
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
