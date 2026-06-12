import { create } from 'zustand';
import type { User, Company } from '../types';
import { currentUser, currentCompany } from '../data/mockData';

interface AuthState {
  user: User | null;
  company: Company | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: currentUser,
  company: currentCompany,
  isAuthenticated: true,
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email && password) {
      set({ user: currentUser, company: currentCompany, isAuthenticated: true });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ user: null, company: null, isAuthenticated: false });
  },
}));
