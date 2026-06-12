import { create } from 'zustand';
import type { Alert, EmployeeUsage, Quota, UsageStats } from '../types';
import { mockAlerts, mockEmployeeUsage, mockQuotas, mockUsageStats } from '../data/mockData';

const STORAGE_KEY = 'ai_monitor_data';

interface MonitorData {
  quotas: Quota[];
  alerts: Alert[];
}

function loadFromStorage(): MonitorData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return {
    quotas: mockQuotas,
    alerts: mockAlerts,
  };
}

function saveToStorage(data: MonitorData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

interface MonitorState {
  usageStats: UsageStats;
  employeeUsage: EmployeeUsage[];
  alerts: Alert[];
  quotas: Quota[];
  currentQuota: Quota | null;
  isLoading: boolean;
  initialize: () => void;
  fetchData: () => Promise<void>;
  resolveAlert: (id: string) => void;
  updateQuota: (id: string, totalCalls: number, warningThreshold: number) => void;
  resolveQuotaAlert: (companyId: string) => void;
}

export const useMonitorStore = create<MonitorState>((set, get) => ({
  usageStats: mockUsageStats,
  employeeUsage: mockEmployeeUsage,
  alerts: [],
  quotas: [],
  currentQuota: null,
  isLoading: false,

  initialize: () => {
    const data = loadFromStorage();
    set({
      quotas: data.quotas,
      alerts: data.alerts,
      currentQuota: data.quotas[0] || null,
    });
  },

  fetchData: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  resolveAlert: (id) => {
    const state = get();
    const newAlerts = state.alerts.map((alert) =>
      alert.id === id
        ? { ...alert, status: 'resolved' as const, resolvedAt: new Date().toISOString().split('T')[0] }
        : alert
    );
    set({ alerts: newAlerts });
    saveToStorage({ ...state, alerts: newAlerts });
  },

  resolveQuotaAlert: (companyId) => {
    const state = get();
    const newAlerts = state.alerts.map((alert) =>
      alert.companyId === companyId && alert.type === 'expiring_soon'
        ? { ...alert, status: 'resolved' as const, resolvedAt: new Date().toISOString().split('T')[0] }
        : alert
    );
    const newQuotas = state.quotas.map((quota) =>
      quota.companyId === companyId ? { ...quota, renewalNotice: false } : quota
    );
    set({ alerts: newAlerts, quotas: newQuotas });
    if (state.currentQuota?.companyId === companyId) {
      const updatedCurrentQuota = newQuotas.find((q) => q.id === state.currentQuota?.id);
      set({ currentQuota: updatedCurrentQuota || state.currentQuota });
    }
    saveToStorage({ quotas: newQuotas, alerts: newAlerts });
  },

  updateQuota: (id, totalCalls, warningThreshold) => {
    const state = get();
    const newQuotas = state.quotas.map((q) =>
      q.id === id ? { ...q, totalCalls, warningThreshold } : q
    );
    set({
      quotas: newQuotas,
      currentQuota:
        state.currentQuota?.id === id
          ? { ...state.currentQuota, totalCalls, warningThreshold }
          : state.currentQuota,
    });
    saveToStorage({ ...state, quotas: newQuotas });
  },
}));
