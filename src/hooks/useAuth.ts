import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
    location?: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => {
    // If Supabase is not configured, skip loading entirely
    if (!isSupabaseConfigured) {
      return false;
    }
    // Check if there's a session in localStorage
    const hasSession = Object.keys(localStorage).some(key =>
      key.startsWith('sb-') && key.endsWith('-auth-token')
    );
    return hasSession;
  });

  useEffect(() => {
    // Check for demo user first
    const demoUserStr = localStorage.getItem('demo_user');
    if (demoUserStr) {
      setUser(JSON.parse(demoUserStr));
      setLoading(false);

      // Listen for demo login events
      const handleDemoLogin = () => {
        const demoUserStr = localStorage.getItem('demo_user');
        if (demoUserStr) {
          setUser(JSON.parse(demoUserStr));
        }
      };
      window.addEventListener('demo_login', handleDemoLogin);

      return () => {
        window.removeEventListener('demo_login', handleDemoLogin);
      };
    }

    // If Supabase is not configured, just listen for demo events
    if (!isSupabaseConfigured) {
      setLoading(false);

      // Still listen for demo login events
      const handleDemoLogin = () => {
        const demoUserStr = localStorage.getItem('demo_user');
        if (demoUserStr) {
          setUser(JSON.parse(demoUserStr));
        }
      };
      window.addEventListener('demo_login', handleDemoLogin);

      return () => {
        window.removeEventListener('demo_login', handleDemoLogin);
      };
    }

    // Get initial session ONLY if Supabase is configured
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at || new Date().toISOString(),
          user_metadata: session.user.user_metadata,
        });
      }
      setLoading(false);
    });

    // Listen for demo login events
    const handleDemoLogin = () => {
      const demoUserStr = localStorage.getItem('demo_user');
      if (demoUserStr) {
        setUser(JSON.parse(demoUserStr));
      } else {
        setUser(null);
      }
    };
    window.addEventListener('demo_login', handleDemoLogin);

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at || new Date().toISOString(),
          user_metadata: session.user.user_metadata,
        });
      } else {
        // Only clear user if not in demo mode
        if (!localStorage.getItem('demo_user')) {
          setUser(null);
        }
      }
    });

    return () => {
      window.removeEventListener('demo_login', handleDemoLogin);
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}