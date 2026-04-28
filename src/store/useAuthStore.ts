import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { APP_CONFIG } from '../config';

const apiStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const resp = await fetch(`${APP_CONFIG.API_URL}/api/store/${name}`);
      if (!resp.ok) return null;
      const data = await resp.json();
      return data.value || null;
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await fetch(`${APP_CONFIG.API_URL}/api/store/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
    } catch (e) {
      console.error('Falha ao salvar no SQLite:', e);
    }
  },
  removeItem: async () => {},
};

export interface Account {
  id: string;
  name: string;
  email: string;
  password?: string;
  maxProfiles: number;
  plan: 'free' | 'pro';
  createdAt: number;
}

interface AuthStore {
  accounts: Account[];
  currentAccount: Account | null;
  registerAccount: (name: string, email: string, password?: string) => void;
  loginAccount: (id: string) => void;
  logoutAccount: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accounts: [],
      currentAccount: null,

      registerAccount: (name: string, email: string, password?: string) => set((state) => {
        const newAccount: Account = {
          id: Math.random().toString(36).substring(2, 11),
          name,
          email,
          ...(password ? { password } : {}),
          maxProfiles: 5, // Default for now
          plan: 'free',
          createdAt: Date.now(),
        };
        return { accounts: [...state.accounts, newAccount], currentAccount: newAccount };
      }),

      loginAccount: (id: string) => set((state) => ({
        currentAccount: state.accounts.find(a => a.id === id) || null
      })),

      logoutAccount: () => set({ currentAccount: null }),
    }),
    {
      name: 'digit-ae-auth',
      storage: createJSONStorage(() => apiStorage),
    }
  )
);
