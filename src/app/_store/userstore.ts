import { create } from "zustand";
import { User } from "@supabase/supabase-js"; // type import

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

interface UploadState {
  uploadSuccess: boolean | null; // null = not attempted, true = success, false = fail
  setUploadSuccess: (success: boolean) => void;
  resetUploadStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));


export const useUploadStore = create<UploadState>((set) => ({
  uploadSuccess: null,
  setUploadSuccess: (success) => set({ uploadSuccess: success }),
  resetUploadStatus: () => set({ uploadSuccess: null }),
}));