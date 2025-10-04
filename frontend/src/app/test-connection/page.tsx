"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/lib/hooks/use-toast";

export default function ConnectionTestPage() {
  const [status, setStatus] = useState<string>("Not tested");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000/api" + "/categories"
      );
      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Connected! Found ${data.data?.length || 0} categories`);
        toast({
          title: "Connection Successful",
          description: "Backend API is responding correctly",
        });
      } else {
        setStatus(
          `❌ Connection failed: ${response.status} ${response.statusText}`
        );
        toast({
          title: "Connection Failed",
          description: `HTTP ${response.status}: ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setStatus(`❌ Connection error: ${error.message}`);
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8000/api" + "/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: "Test Student",
            email: "student@test.com",
            password: "password123",
            password_confirmation: "password123",
            role: "student",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus(
          `✅ Auth test successful! Token: ${data.token?.substring(0, 20)}...`
        );
        toast({
          title: "Auth Test Successful",
          description: "Registration endpoint is working",
        });
      } else {
        setStatus(`ℹ️ Auth response: ${data.message || JSON.stringify(data)}`);
        toast({
          title: "Auth Response",
          description: data.message || "Check console for details",
        });
      }
    } catch (error: any) {
      setStatus(`❌ Auth error: ${error.message}`);
      toast({
        title: "Auth Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Backend Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              API URL:{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}
            </p>
            <p className="text-sm font-mono bg-muted p-2 rounded">
              Status: {status}
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={testConnection}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Testing..." : "Test Backend Connection"}
            </Button>

            <Button
              onClick={testAuth}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? "Testing..." : "Test Auth Endpoint"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
