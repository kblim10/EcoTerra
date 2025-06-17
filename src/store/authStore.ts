import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';
import { UserData } from '../services/supabaseClient';

// Interface untuk state autentikasi
interface AuthState {
  user: UserData | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: 'teacher' | 'student' | 'public') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserData>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Store untuk autentikasi
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: false,
  error: null,
  
  // Login dengan email dan password
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Dapatkan data pengguna dari tabel profiles
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();
        
      if (userError) throw userError;
      
      set({ 
        user: userData as UserData, 
        session: data.session,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal login', 
        isLoading: false 
      });
    }
  },
  
  // Register dengan email dan password
  register: async (email: string, password: string, fullName: string, role: 'teacher' | 'student' | 'public') => {
    set({ isLoading: true, error: null });
    try {
      // Validasi domain email untuk guru
      if (role === 'teacher') {
        const domain = email.split('@')[1];
        const { data: domainData, error: domainError } = await supabase
          .from('school_domains')
          .select('*')
          .eq('domain', domain)
          .single();
          
        if (domainError || !domainData) {
          throw new Error('Domain email tidak diizinkan untuk pendaftaran guru');
        }
      }
      
      // Buat akun
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Buat profil pengguna
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            created_at: new Date().toISOString(),
          });
          
        if (profileError) throw profileError;
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mendaftar', 
        isLoading: false 
      });
    }
  },
  
  // Logout
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null, 
        session: null, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal logout', 
        isLoading: false 
      });
    }
  },
  
  // Reset password
  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal reset password', 
        isLoading: false 
      });
    }
  },
  
  // Update profil
  updateProfile: async (data: Partial<UserData>) => {
    set({ isLoading: true, error: null });
    try {
      const user = get().user;
      if (!user) throw new Error('User tidak ditemukan');
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) throw error;
      
      set({ 
        user: { ...user, ...data },
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal update profil', 
        isLoading: false 
      });
    }
  },
  
  // Refresh data user
  refreshUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session) {
        // Dapatkan data pengguna dari tabel profiles
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (userError) throw userError;
        
        set({ 
          user: userData as UserData, 
          session: data.session,
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          session: null, 
          isLoading: false 
        });
      }
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal refresh user', 
        isLoading: false 
      });
    }
  },
})); 