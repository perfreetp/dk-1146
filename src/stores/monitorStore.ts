import { create } from 'zustand';
import type { Alert, EmployeeUsage, Quota, UsageStats } from '../types';
import { mockAlerts, mockEmployeeUsage, mockQuotas, mockUsageStats } from '../data/mockData';

interface MonitorState {
  usageStats: UsageStats;
  employeeUsage: EmployeeUsage[];
  alerts: Alert[];
  quotas: Quota[];
  currentQuota: Quota | null;
  isLoading: boolean;
  fetchData: () => Promise<void>;
  resolveAlert: (id: string) => void;
  updateQuota: (id: string, totalCalls: number, warningThreshold: number) => void;
  togglePersonalityActive: (personalityId: string) => void;
}

export const useMonitorStore = create<MonitorState>((set, get) => ({
  usageStats: mockUsageStats,
  employeeUsage: mockEmployeeUsage,
  alerts: mockAlerts,
  quotas: mockQuotas,
  currentQuota: mockQuotas[0],
  isLoading: false,
  fetchData: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ isLoading: false });
  },
  resolveAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id
          ? { ...alert, status: 'resolved' as const, resolvedAt: new Date().toISOString().split('T')[0] }
          : alert
      ),
    }));
  },
  updateQuota: (id, totalCalls, warningThreshold) => {
    set((state) => ({
      quotas: state.quotas.map((q) =>
        q.id === id ? { ...q, totalCalls, warningThreshold } : q
      ),
      currentQuota:
        state.currentQuota?.id === id
          ? { ...state.currentQuota, totalCalls, warningThreshold }
          : state.currentQuota,
    }));
  },
  togglePersonalityActive: (personalityId) => {
    console.log('Toggle personality active:', personalityId);
  },
}));
