// src/store/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: {
    email: string | null;
    uid: string | null;
  } | null;
  setUser: (user: { email: string; uid: string }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // Nombre de la clave en localStorage
    }
  )
);
