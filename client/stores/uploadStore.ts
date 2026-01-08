import { create } from 'zustand';
import type { UploadStore, UploadFile } from '@/types/store';

let fileIdCounter = 0;

/**
 * Upload Store
 * Manages file upload state and progress
 */
export const useUploadStore = create<UploadStore>((set) => ({
  // Initial state
  files: [],
  currentUpload: null,
  isUploading: false,

  // Actions
  addFile: (file: Omit<UploadFile, 'id' | 'status' | 'progress'>) => {
    const id = `file-${++fileIdCounter}-${Date.now()}`;
    const newFile: UploadFile = {
      ...file,
      id,
      status: 'pending',
      progress: 0,
    };

    set((state) => ({
      files: [...state.files, newFile],
    }));

    return id;
  },

  removeFile: (id: string) => {
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
      currentUpload: state.currentUpload?.id === id ? null : state.currentUpload,
    }));
  },

  updateFileProgress: (id: string, progress: number) => {
    set((state) => ({
      files: state.files.map((file) => (file.id === id ? { ...file, progress } : file)),
      currentUpload:
        state.currentUpload?.id === id ? { ...state.currentUpload, progress } : state.currentUpload,
    }));
  },

  updateFileStatus: (id: string, status: UploadFile['status'], error?: string) => {
    set((state) => {
      const updatedFiles = state.files.map((file) =>
        file.id === id ? { ...file, status, error } : file
      );

      const isUploading = updatedFiles.some((file) => file.status === 'uploading');

      return {
        files: updatedFiles,
        isUploading,
        currentUpload:
          state.currentUpload?.id === id
            ? { ...state.currentUpload, status, error }
            : state.currentUpload,
      };
    });
  },

  setCurrentUpload: (file: UploadFile | null) => {
    set({ currentUpload: file, isUploading: file?.status === 'uploading' });
  },

  clearCompleted: () => {
    set((state) => ({
      files: state.files.filter((file) => file.status !== 'completed' && file.status !== 'failed'),
    }));
  },

  clearAll: () => {
    set({
      files: [],
      currentUpload: null,
      isUploading: false,
    });
  },
}));
