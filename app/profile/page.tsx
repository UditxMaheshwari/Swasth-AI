'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/protected-route';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-6 sm:py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl font-bold text-center">Profile</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Email</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            {user?.user_metadata?.full_name && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Name</h3>
                <p className="text-sm text-muted-foreground">{user.user_metadata.full_name}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing out...' : 'Sign out'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}