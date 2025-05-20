import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreviewStore {
  previewImage: string;
  setPreviewImage: (image: string) => void;
}

export const usePreviewStore = create(
  persist(
    (set) => ({
      previewImage: '',
      setPreviewImage: (image: string = '') => {
        set({ previewImage: image });
      }
    }),
    { name: 'previewStore' } // 持久化存储
  )
);
