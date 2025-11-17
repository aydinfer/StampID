import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  isOnboarded: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setOnboarded: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'system',
  isOnboarded: false,
  setTheme: (theme) => set({ theme }),
  setOnboarded: (value) => set({ isOnboarded: value }),
}));
