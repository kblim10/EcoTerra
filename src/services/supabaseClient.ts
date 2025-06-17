import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ganti dengan URL dan anon key Supabase Anda
const supabaseUrl = 'https://pyoildxefdvwohyykvfg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5b2lsZHhlZmR2d29oeXlrdmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDgzNzMsImV4cCI6MjA2NTYyNDM3M30.DB_bc2nnVxIeSyJmnue3kjpBsK7_gINgNSRorZ97KhM';

// Buat klien Supabase dengan AsyncStorage sebagai penyimpanan
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tipe untuk data pengguna
export type UserData = {
  id: string;
  email: string;
  role: 'super_admin' | 'teacher' | 'student' | 'public';
  full_name: string;
  avatar_url?: string;
  school_id?: string;
  created_at: string;
};

// Tipe untuk data kelas
export type ClassData = {
  id: string;
  name: string;
  description: string;
  code: string; // Kode unik 8 karakter
  teacher_id: string;
  created_at: string;
};

// Tipe untuk data materi
export type MaterialData = {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'image' | 'video' | 'embed';
  content_url: string;
  class_id: string;
  created_at: string;
};

// Tipe untuk data kuis
export type QuizData = {
  id: string;
  title: string;
  description: string;
  class_id: string;
  duration: number; // dalam menit
  created_at: string;
};

// Tipe untuk data pertanyaan kuis
export type QuizQuestionData = {
  id: string;
  quiz_id: string;
  question: string;
  type: 'multiple_choice' | 'essay';
  options?: string[]; // untuk pilihan ganda
  correct_answer?: string; // untuk pilihan ganda
  points: number;
};

// Tipe untuk data jawaban kuis
export type QuizAnswerData = {
  id: string;
  student_id: string;
  quiz_id: string;
  question_id: string;
  answer: string;
  is_correct?: boolean;
  score?: number;
  submitted_at: string;
};

// Tipe untuk data forum
export type ForumPostData = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  class_id?: string; // null untuk forum umum
  created_at: string;
};

// Tipe untuk data komentar forum
export type ForumCommentData = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

// Tipe untuk data notifikasi
export type NotificationData = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'system' | 'class' | 'quiz' | 'forum';
  reference_id?: string;
  is_read: boolean;
  created_at: string;
}; 