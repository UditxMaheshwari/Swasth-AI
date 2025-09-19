"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Mail, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const messageParam = searchParams.get('message');
    const emailParam = searchParams.get('email');
    const registered = searchParams.get('registered');

    if (messageParam === 'check-email' && emailParam) {
      setMessage(`Please check your email (${emailParam}) and click the confirmation link before signing in.`);
      setEmail(emailParam);
    } else if (registered === 'true') {
      setMessage('Account created successfully! You can now sign in.');
    }
  }, [searchParams]);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          return;
        }
        
        if (session) {
          // Get redirect URL from query params or default to dashboard
          const urlParams = new URLSearchParams(window.location.search);
          let redirectTo = urlParams.get('redirectTo') || '/dashboard';
          
          // Prevent redirect loops
          if (redirectTo === '/login' || redirectTo.startsWith('/auth/login')) {
            redirectTo = '/dashboard';
          }
          
          console.log('Session exists, redirecting to:', redirectTo);
          window.location.href = redirectTo;
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkSession();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Sign in using the auth context
      const { error } = await signIn(email, password);
      
      if (error) {
        // Map common Supabase auth errors to user-friendly messages
        const anyErr: any = error as any;
        const code = anyErr?.code as string | undefined;
        let errorMessage = 'Failed to login. Please try again.';
        
        if (code === 'invalid_credentials' || code === 'invalid_grant') {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (code === 'email_not_confirmed') {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (code === 'too_many_requests') {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else if (anyErr?.message) {
          errorMessage = anyErr.message;
        }
        
        setError(errorMessage);
        console.error('Login error:', { code, message: anyErr?.message });
      } else {
        // Show success message
        setMessage("Login successful! Redirecting...");
        
        // The auth context will handle the redirect
        // No need to redirect here to prevent loops
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again.");
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2 sm:mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <div className="p-2 sm:p-3 text-xs sm:text-sm bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-md flex items-start gap-2">
                {message.includes('email') ? (
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="p-2 sm:p-3 text-xs sm:text-sm bg-destructive/10 text-destructive rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 sm:h-10 text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full h-9 sm:h-10 text-sm sm:text-base" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:space-y-4">
          <div className="text-xs sm:text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}