'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { debugSupabaseConfig, debugAuthAttempt } from '@/lib/debug-auth';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, options?: { name?: string }) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.email);
    console.log('Full session data:', session);
    
    setSession(session);
    setUser(session?.user ?? null);
    setIsLoading(false);

    // Handle different auth events
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      setSession(null);
      setUser(null);
      // Force a router refresh to update middleware
      router.refresh();
    } else if (event === 'SIGNED_IN' && session) {
      console.log('User signed in successfully:', session.user.email);
      console.log('Calling router.refresh() to update middleware');
      // Force a router refresh to update middleware
      router.refresh();
    } else if (event === 'TOKEN_REFRESHED' && session) {
      console.log('Token refreshed for:', session.user.email);
      // Session was refreshed, update state
      setSession(session);
      setUser(session.user);
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        debugSupabaseConfig();
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Initial session result:', { session, error });
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting initial session:', error.message);
          // Clear any invalid session data
          setSession(null);
          setUser(null);
        } else {
          console.log('Initial session user:', session?.user?.email || 'No user');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  const signUp = async (email: string, password: string, options?: { name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options?.name || '',
          },
        },
      });

      return { data, error };
    } catch (error) {
      console.error('SignUp error:', error);
      return { data: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign in with:', email);
      
      const result = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      debugAuthAttempt(email, result);
      
      if (result.error) {
        console.error('SignIn error:', result.error);
        return { data: result.data, error: result.error };
      }

      if (result.data?.session) {
        console.log('Sign in successful, session:', result.data.session.user.email);
      }

      // The auth state change will be handled by the listener
      return { data: result.data, error: null };
    } catch (error) {
      console.error('SignIn error:', error);
      return { data: null, error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('SignOut error:', error);
      }
      // The auth state change will be handled by the listener
    } catch (error) {
      console.error('SignOut error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}