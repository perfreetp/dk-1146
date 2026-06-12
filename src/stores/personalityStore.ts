import { create } from 'zustand';
import type { Personality, FilterOptions, ShortlistItem, Application, Assignment, Employee, Alert, Quota, UsageStats } from '../types';
import { mockPersonalities, mockShortlists, mockApplications, mockAssignments, mockEmployees, mockAlerts, mockQuotas, mockUsageStats } from '../data/mockData';

const STORAGE_KEY = 'ai_personality_market';

interface StoreData {
  personalities: Personality[];
  shortlist: ShortlistItem[];
  applications: Application[];
  assignments: Assignment[];
  employees: Employee[];
  alerts: Alert[];
  quotas: Quota[];
}

function loadFromStorage(): StoreData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from storage:', e);
  }
  return {
    personalities: mockPersonalities,
    shortlist: mockShortlists,
    applications: mockApplications,
    assignments: mockAssignments,
    employees: mockEmployees,
    alerts: mockAlerts,
    quotas: mockQuotas,
  };
}

function saveToStorage(data: StoreData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

interface PersonalityState {
  personalities: Personality[];
  filteredPersonalities: Personality[];
  selectedPersonality: Personality | null;
  shortlist: ShortlistItem[];
  applications: Application[];
  assignments: Assignment[];
  employees: Employee[];
  alerts: Alert[];
  quotas: Quota[];
  usageStats: UsageStats;
  currentQuota: Quota | null;
  filters: FilterOptions;
  isLoading: boolean;
  initialize: () => void;
  setFilter: (key: keyof FilterOptions, value: string | boolean | undefined) => void;
  applyFilters: () => void;
  selectPersonality: (id: string) => void;
  clearSelection: () => void;
  addToShortlist: (personalityId: string, notes?: string) => void;
  removeFromShortlist: (id: string) => void;
  submitApplication: (usage: string, expectedDate: string, budget: number) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
  assignEmployeesToApplication: (applicationId: string, employeeIds: string[]) => void;
  togglePersonalityActive: (personalityId: string) => void;
  resolveAlert: (alertId: string) => void;
  resolveQuotaAlert: (companyId: string) => void;
  updateQuota: (id: string, totalCalls: number, warningThreshold: number) => void;
}

export const usePersonalityStore = create<PersonalityState>((set, get) => ({
  personalities: [],
  filteredPersonalities: [],
  selectedPersonality: null,
  shortlist: [],
  applications: [],
  assignments: [],
  employees: [],
  alerts: [],
  quotas: [],
  usageStats: mockUsageStats,
  currentQuota: null,
  filters: { showInactive: false },
  isLoading: false,

  initialize: () => {
    const data = loadFromStorage();
    set({
      personalities: data.personalities,
      filteredPersonalities: data.personalities,
      shortlist: data.shortlist,
      applications: data.applications,
      assignments: data.assignments,
      employees: data.employees,
      alerts: data.alerts,
      quotas: data.quotas,
      currentQuota: data.quotas[0] || null,
    });
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().applyFilters();
  },

  applyFilters: () => {
    const { personalities, filters } = get();
    let filtered = [...personalities];

    if (!filters.showInactive) {
      filtered = filtered.filter((p) => p.isActive);
    }

    if (filters.industry && filters.industry !== '全部') {
      filtered = filtered.filter((p) => p.industry === filters.industry);
    }
    if (filters.taskType && filters.taskType !== '全部') {
      filtered = filtered.filter((p) => p.taskType === filters.taskType);
    }
    if (filters.complianceLevel && filters.complianceLevel !== '全部') {
      filtered = filtered.filter((p) => p.complianceLevel === filters.complianceLevel);
    }
    if (filters.responseStyle && filters.responseStyle !== '全部') {
      filtered = filtered.filter((p) => p.responseStyle === filters.responseStyle);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'monthlyCalls':
        filtered.sort((a, b) => b.monthlyCalls - a.monthlyCalls);
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
      default:
        break;
    }

    set({ filteredPersonalities: filtered });
  },

  selectPersonality: (id) => {
    const personality = get().personalities.find((p) => p.id === id) || null;
    set({ selectedPersonality: personality });
  },

  clearSelection: () => {
    set({ selectedPersonality: null });
  },

  addToShortlist: (personalityId, notes = '') => {
    const state = get();
    const personality = state.personalities.find((p) => p.id === personalityId);
    if (!personality || !personality.isActive) return;
    
    const existingItem = state.shortlist.find((s) => s.personalityId === personalityId);
    if (existingItem) return;

    const newItem: ShortlistItem = {
      id: `s${Date.now()}`,
      userId: 'u1',
      personalityId,
      personality,
      notes,
      addedAt: new Date().toISOString().split('T')[0],
    };
    
    const newShortlist = [...state.shortlist, newItem];
    set({ shortlist: newShortlist });
    saveToStorage({ ...state, shortlist: newShortlist });
  },

  removeFromShortlist: (id) => {
    const state = get();
    const newShortlist = state.shortlist.filter((item) => item.id !== id);
    set({ shortlist: newShortlist });
    saveToStorage({ ...state, shortlist: newShortlist });
  },

  submitApplication: (usage, expectedDate, budget) => {
    const state = get();
    const activeShortlist = state.shortlist.filter((item) => item.personality.isActive);
    if (activeShortlist.length === 0) return;

    const newApplication: Application = {
      id: `a${Date.now()}`,
      userId: 'u1',
      userName: '张明',
      items: activeShortlist.map((item, index) => ({
        id: `ai${Date.now()}_${index}`,
        applicationId: `a${Date.now()}`,
        personalityId: item.personalityId,
        personality: item.personality,
        quantity: 1,
      })),
      usage,
      expectedDate,
      budget,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const newApplications = [newApplication, ...state.applications];
    set({ applications: newApplications, shortlist: [] });
    saveToStorage({ ...state, applications: newApplications, shortlist: [] });
  },

  approveApplication: (id) => {
    const state = get();
    const newApplications = state.applications.map((app) =>
      app.id === id
        ? { ...app, status: 'approved' as const, approvedAt: new Date().toISOString().split('T')[0] }
        : app
    );
    set({ applications: newApplications });
    saveToStorage({ ...state, applications: newApplications });
  },

  rejectApplication: (id, reason) => {
    const state = get();
    const newApplications = state.applications.map((app) =>
      app.id === id ? { ...app, status: 'rejected' as const, rejectionReason: reason } : app
    );
    set({ applications: newApplications });
    saveToStorage({ ...state, applications: newApplications });
  },

  assignEmployeesToApplication: (applicationId, employeeIds) => {
    const state = get();
    const application = state.applications.find((a) => a.id === applicationId);
    if (!application) return;

    const newAssignments = application.items.flatMap((item) => {
      return employeeIds.map((employeeId) => {
        const employee = state.employees.find((e) => e.id === employeeId);
        return {
          id: `as${Date.now()}_${employeeId}_${item.personalityId}`,
          applicationId,
          userId: employeeId,
          userName: employee?.name || '',
          personalityId: item.personalityId,
          personality: item.personality,
          expiresAt: application.expectedDate,
          isActive: true,
          assignedAt: new Date().toISOString().split('T')[0],
        } as Assignment;
      });
    });

    const newApplications = state.applications.map((app) =>
      app.id === applicationId ? { ...app, assignedEmployees: employeeIds } : app
    );

    const allAssignments = [...state.assignments, ...newAssignments];
    set({ assignments: allAssignments, applications: newApplications });
    saveToStorage({ ...state, assignments: allAssignments, applications: newApplications });
  },

  togglePersonalityActive: (personalityId) => {
    const state = get();
    const newPersonalities = state.personalities.map((p) =>
      p.id === personalityId ? { ...p, isActive: !p.isActive } : p
    );
    const updatedShortlist = state.shortlist.filter((item) =>
      item.personalityId !== personalityId
    );
    set({ 
      personalities: newPersonalities,
      shortlist: updatedShortlist
    });
    get().applyFilters();
    saveToStorage({ ...state, personalities: newPersonalities, shortlist: updatedShortlist });
  },

  resolveAlert: (alertId) => {
    const state = get();
    const alertToResolve = state.alerts.find((a) => a.id === alertId);
    
    let newAlerts = state.alerts.map((alert) =>
      alert.id === alertId
        ? { ...alert, status: 'resolved' as const, resolvedAt: new Date().toISOString().split('T')[0] }
        : alert
    );

    let newQuotas = [...state.quotas];
    if (alertToResolve?.type === 'expiring_soon' && alertToResolve?.companyId) {
      newQuotas = state.quotas.map((quota) =>
        quota.companyId === alertToResolve.companyId
          ? { ...quota, renewalNotice: false }
          : quota
      );
    }

    set({ alerts: newAlerts, quotas: newQuotas });
    saveToStorage({ ...state, alerts: newAlerts, quotas: newQuotas });
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
    saveToStorage({ ...state, alerts: newAlerts, quotas: newQuotas });
  },

  updateQuota: (id, totalCalls, warningThreshold) => {
    const state = get();
    const newQuotas = state.quotas.map((q) =>
      q.id === id ? { ...q, totalCalls, warningThreshold } : q
    );
    set({
      quotas: newQuotas,
      currentQuota: state.currentQuota?.id === id
        ? { ...state.currentQuota, totalCalls, warningThreshold }
        : state.currentQuota,
    });
    saveToStorage({ ...state, quotas: newQuotas });
  },
}));
