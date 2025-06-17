import { create } from 'zustand';
import { supabase } from '../services/supabaseClient';
import { ClassData, MaterialData, QuizData } from '../services/supabaseClient';

// Interface untuk state kelas
interface ClassState {
  classes: ClassData[];
  currentClass: ClassData | null;
  materials: MaterialData[];
  quizzes: QuizData[];
  isLoading: boolean;
  error: string | null;
  
  // Actions untuk kelas
  fetchClasses: () => Promise<void>;
  fetchClassById: (id: string) => Promise<void>;
  createClass: (data: Partial<ClassData>) => Promise<string | null>;
  updateClass: (id: string, data: Partial<ClassData>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  joinClass: (code: string) => Promise<void>;
  
  // Actions untuk materi
  fetchMaterials: (classId: string) => Promise<void>;
  fetchMaterialById: (id: string) => Promise<MaterialData | null>;
  createMaterial: (data: Partial<MaterialData>) => Promise<string | null>;
  updateMaterial: (id: string, data: Partial<MaterialData>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  
  // Actions untuk kuis
  fetchQuizzes: (classId: string) => Promise<void>;
  fetchQuizById: (id: string) => Promise<QuizData | null>;
  createQuiz: (data: Partial<QuizData>) => Promise<string | null>;
  updateQuiz: (id: string, data: Partial<QuizData>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
}

// Fungsi untuk menghasilkan kode kelas unik 8 karakter
const generateClassCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Store untuk kelas
export const useClassStore = create<ClassState>((set, get) => ({
  classes: [],
  currentClass: null,
  materials: [],
  quizzes: [],
  isLoading: false,
  error: null,
  
  // Fetch semua kelas
  fetchClasses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*');
        
      if (error) throw error;
      
      set({ 
        classes: data as ClassData[],
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengambil data kelas', 
        isLoading: false 
      });
    }
  },
  
  // Fetch kelas berdasarkan ID
  fetchClassById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      set({ 
        currentClass: data as ClassData,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengambil data kelas', 
        isLoading: false 
      });
    }
  },
  
  // Buat kelas baru
  createClass: async (data: Partial<ClassData>) => {
    set({ isLoading: true, error: null });
    try {
      // Generate kode kelas unik 8 karakter
      const code = generateClassCode();
      
      const { data: newClass, error } = await supabase
        .from('classes')
        .insert({
          ...data,
          code,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
        
      if (error) throw error;
      
      set(state => ({ 
        classes: [...state.classes, newClass as ClassData],
        isLoading: false 
      }));
      
      return newClass?.id || null;
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal membuat kelas', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Update kelas
  updateClass: async (id: string, data: Partial<ClassData>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('classes')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        classes: state.classes.map(c => c.id === id ? { ...c, ...data } : c),
        currentClass: state.currentClass?.id === id ? { ...state.currentClass, ...data } : state.currentClass,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengupdate kelas', 
        isLoading: false 
      });
    }
  },
  
  // Hapus kelas
  deleteClass: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        classes: state.classes.filter(c => c.id !== id),
        currentClass: state.currentClass?.id === id ? null : state.currentClass,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal menghapus kelas', 
        isLoading: false 
      });
    }
  },
  
  // Gabung kelas dengan kode
  joinClass: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      // Cari kelas dengan kode
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('code', code)
        .single();
        
      if (classError || !classData) {
        throw new Error('Kode kelas tidak valid');
      }
      
      // Dapatkan user saat ini
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        throw new Error('User tidak ditemukan');
      }
      
      // Tambahkan user ke kelas
      const { error: joinError } = await supabase
        .from('class_members')
        .insert({
          class_id: classData.id,
          user_id: sessionData.session.user.id,
          role: 'student',
          joined_at: new Date().toISOString(),
        });
        
      if (joinError) throw joinError;
      
      // Update state
      set(state => ({ 
        classes: [...state.classes, classData as ClassData],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal bergabung dengan kelas', 
        isLoading: false 
      });
    }
  },
  
  // Fetch materi berdasarkan ID kelas
  fetchMaterials: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('class_id', classId);
        
      if (error) throw error;
      
      set({ 
        materials: data as MaterialData[],
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengambil data materi', 
        isLoading: false 
      });
    }
  },
  
  // Fetch materi berdasarkan ID
  fetchMaterialById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      set({ isLoading: false });
      
      return data as MaterialData;
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengambil data materi', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Buat materi baru
  createMaterial: async (data: Partial<MaterialData>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newMaterial, error } = await supabase
        .from('materials')
        .insert({
          ...data,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
        
      if (error) throw error;
      
      set(state => ({ 
        materials: [...state.materials, newMaterial as MaterialData],
        isLoading: false 
      }));
      
      return newMaterial?.id || null;
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal membuat materi', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Update materi
  updateMaterial: async (id: string, data: Partial<MaterialData>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('materials')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        materials: state.materials.map(m => m.id === id ? { ...m, ...data } : m),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengupdate materi', 
        isLoading: false 
      });
    }
  },
  
  // Hapus materi
  deleteMaterial: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        materials: state.materials.filter(m => m.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal menghapus materi', 
        isLoading: false 
      });
    }
  },
  
  // Fetch kuis berdasarkan ID kelas
  fetchQuizzes: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('class_id', classId);
        
      if (error) throw error;
      
      set({ 
        quizzes: data as QuizData[],
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengambil data kuis', 
        isLoading: false 
      });
    }
  },
  
  // Fetch kuis berdasarkan ID
  fetchQuizById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      set({ isLoading: false });
      
      return data as QuizData;
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengambil data kuis', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Buat kuis baru
  createQuiz: async (data: Partial<QuizData>) => {
    set({ isLoading: true, error: null });
    try {
      const { data: newQuiz, error } = await supabase
        .from('quizzes')
        .insert({
          ...data,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
        
      if (error) throw error;
      
      set(state => ({ 
        quizzes: [...state.quizzes, newQuiz as QuizData],
        isLoading: false 
      }));
      
      return newQuiz?.id || null;
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal membuat kuis', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Update kuis
  updateQuiz: async (id: string, data: Partial<QuizData>) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('quizzes')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        quizzes: state.quizzes.map(q => q.id === id ? { ...q, ...data } : q),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal mengupdate kuis', 
        isLoading: false 
      });
    }
  },
  
  // Hapus kuis
  deleteQuiz: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set(state => ({
        quizzes: state.quizzes.filter(q => q.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.message || 'Gagal menghapus kuis', 
        isLoading: false 
      });
    }
  },
})); 