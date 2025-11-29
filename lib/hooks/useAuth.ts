import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import type { User, Session, Provider } from '@supabase/supabase-js';

/**
 * Authentication Hook
 *
 * Complete Supabase authentication integration with:
 * - Email/password authentication
 * - Social authentication (Google, Apple)
 * - Password reset
 * - Session management
 * - User profile updates
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'your-app-scheme://reset-password',
    });
    if (error) throw error;
  };

  /**
   * Update user password
   */
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  };

  /**
   * Update user profile metadata
   */
  const updateProfile = async (updates: { email?: string; data?: Record<string, any> }) => {
    const { error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
  };

  /**
   * Sign in with social provider (Google, Apple, etc.)
   * Requires proper OAuth configuration in Supabase
   */
  const signInWithProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'your-app-scheme://auth/callback',
      },
    });
    if (error) throw error;
  };

  /**
   * Refresh the current session
   */
  const refreshSession = async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    signInWithProvider,
    refreshSession,
  };
}
