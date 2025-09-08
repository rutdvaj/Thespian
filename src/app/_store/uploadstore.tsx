import { create } from "zustand";
import { User } from "@supabase/supabase-js"; // type import

interface UploadState {
  uploadSuccess: boolean | null; // null = not attempted, true = success, false = fail
  setUploadSuccess: (success: boolean) => void;
  resetUploadStatus: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploadSuccess: null,
  setUploadSuccess: (success) => set({ uploadSuccess: success }),
  resetUploadStatus: () => set({ uploadSuccess: null }),
}));