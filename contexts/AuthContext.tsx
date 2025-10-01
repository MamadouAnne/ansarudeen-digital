import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Promise Timeout Helper ---
function promiseWithTimeout<T>(promise: Promise<T>, ms: number, timeoutError = new Error('Promise timed out')): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(timeoutError);
    }, ms);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  membership_id: string;
  member_since: string;
  total_donations: number;
  membership_status: 'Active' | 'Inactive' | 'Pending';
  membership_type: 'Full Member' | 'Associate Member' | 'Honorary Member';
  created_at: string;
  updated_at: string;
}

export interface User {
  supabaseUser: SupabaseUser;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isManuallyAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearInvalidSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManuallyAuthenticated, setIsManuallyAuthenticated] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session error during initialization:', error);
          // Clear invalid session data if refresh token is invalid
          if (error.message.includes('refresh_token_not_found') || error.message.includes('Invalid Refresh Token')) {
            console.log('Clearing invalid session data');
            await supabase.auth.signOut();
          }
        } else if (session) {
          setSession(session);
          setIsManuallyAuthenticated(true);
          // Create immediate fallback profile
          const fallbackProfile = createFallbackProfile(session.user);
          setUser({ supabaseUser: session.user, profile: fallbackProfile });

          // Try to load actual profile in background
          promiseWithTimeout(loadUserProfile(session.user), 3000, new Error('Profile loading timed out'))
            .catch((profileError) => {
              console.warn('Background profile loading failed during initialization:', profileError);
            });
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
        // Clear any invalid session data
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.warn('Error during signOut:', signOutError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event, 'session exists:', !!session);

      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        setIsManuallyAuthenticated(true);
        // Create immediate fallback profile for instant redirect
        const fallbackProfile = createFallbackProfile(session.user);
        setUser({ supabaseUser: session.user, profile: fallbackProfile });
        setIsLoading(false);

        // Try to load actual profile in background (don't await)
        promiseWithTimeout(loadUserProfile(session.user), 3000, new Error('Profile loading timed out'))
          .catch((e) => {
            console.warn("Background profile loading failed:", e);
          });
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state');
        setSession(null);
        setUser(null);
        setIsManuallyAuthenticated(false);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed, maintaining auth state');
        setSession(session);
        // Don't reset auth state or reload profile on token refresh
      } else if (event === 'INITIAL_SESSION') {
        console.log('Initial session event - no action needed');
        // This event is fired during initialization, handled by initialize() function
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Loading profile for user:', supabaseUser.id);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (profile && !error) {
        console.log('Profile loaded successfully');
        setUser({ supabaseUser, profile });
      } else if (error && error.code === 'PGRST116') {
        console.log('Profile not found, creating default profile');
        const newProfile = await createDefaultProfile(supabaseUser);
        setUser({ supabaseUser, profile: newProfile });
      } else if (error) {
        console.error('Database error loading profile:', error);
        // Create fallback profile from user metadata
        const fallbackProfile = createFallbackProfile(supabaseUser);
        setUser({ supabaseUser, profile: fallbackProfile });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Create fallback profile from user metadata
      const fallbackProfile = createFallbackProfile(supabaseUser);
      setUser({ supabaseUser, profile: fallbackProfile });
    }
  };

  const createFallbackProfile = (supabaseUser: SupabaseUser): UserProfile => {
    console.log('Creating fallback profile with user metadata:', supabaseUser.user_metadata);

    // Extract name from email since metadata is missing
    const emailParts = supabaseUser.email?.split('@')[0] || 'user';
    const membershipId = `AD${Date.now()}`;

    // Try to split email username into first/last name
    const nameParts = emailParts.split(/[._-]/);
    const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1).toLowerCase() || 'User';
    const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1).toLowerCase() || '';

    console.log(`Creating fallback profile: ${firstName} ${lastName} from email: ${supabaseUser.email}`);

    return {
      id: `fallback_${supabaseUser.id}`,
      user_id: supabaseUser.id,
      first_name: supabaseUser.user_metadata?.first_name ||
                 supabaseUser.user_metadata?.firstName ||
                 firstName,
      last_name: supabaseUser.user_metadata?.last_name ||
                supabaseUser.user_metadata?.lastName ||
                lastName,
      email: supabaseUser.email || '',
      phone: supabaseUser.user_metadata?.phone || supabaseUser.phone || '',
      membership_id: membershipId,
      member_since: new Date().toISOString().split('T')[0],
      total_donations: 0,
      membership_status: 'Active' as const,
      membership_type: 'Full Member' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  const createDefaultProfile = async (supabaseUser: SupabaseUser): Promise<UserProfile | undefined> => {
    try {
      console.log('Creating default profile for user:', supabaseUser.id);
      
      const membershipId = `AD${Date.now()}`;
      const defaultProfile = {
        user_id: supabaseUser.id,
        first_name: supabaseUser.user_metadata?.first_name || 'User',
        last_name: supabaseUser.user_metadata?.last_name || '',
        email: supabaseUser.email || '',
        phone: supabaseUser.user_metadata?.phone || '',
        membership_id: membershipId,
        member_since: new Date().toISOString().split('T')[0],
        total_donations: 0,
        membership_status: 'Active' as const,
        membership_type: 'Full Member' as const,
      };

      console.log('Inserting default profile into database');
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert([defaultProfile])
        .select()
        .single();

      if (error) {
        console.error('Failed to create default profile:', error);
        return undefined;
      }
      
      console.log('Default profile created successfully');
      return newProfile;
    } catch (error) {
      console.error('Error creating default profile:', error);
      return undefined;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { firstName: string; lastName: string; email: string; phone?: string; password: string; }) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      if (error.message.includes('Database error')) {
        throw new Error('A server-side error occurred. Please try again.');
      }
      throw new Error(error.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (userData: Partial<UserProfile>) => {
    if (!user?.supabaseUser) return;
    try {
      const { error } = await supabase.from('profiles').update(userData).eq('user_id', user.supabaseUser.id);
      if (error) throw error;
      await loadUserProfile(user.supabaseUser);
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      await loadUserProfile(session.user);
    }
  };

  const clearInvalidSession = async () => {
    try {
      console.log('Clearing invalid session data');
      // Clear AsyncStorage session data
      await AsyncStorage.removeItem('supabase.auth.token');
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsManuallyAuthenticated(false);
      setIsLoading(false);
    } catch (error) {
      console.warn('Error clearing invalid session:', error);
      // Force clear state even if signOut fails
      setSession(null);
      setUser(null);
      setIsManuallyAuthenticated(false);
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!session && isManuallyAuthenticated;

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated,
    isLoading,
    isManuallyAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    clearInvalidSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};