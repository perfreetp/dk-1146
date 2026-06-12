import { create } from 'zustand';
import type { Personality, FilterOptions, ShortlistItem, Application, Assignment, Employee } from '../types';
import { mockPersonalities, mockShortlists, mockApplications, mockAssignments, mockEmployees } from '../data/mockData';

const STORAGE_KEY = 'ai_personality_market';

interface StoreData {
  personalities: Personality[];
  shortlist: ShortlistItem[];
  applications: Application[];
  assignments: Assignment[];
  employees: Employee[];
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
  updateQuotaRenewalNotice: (companyId: string, notice: boolean) => void;
  resolveAlert: (alertId: string) => void;
}

export const usePersonalityStore = create<PersonalityState>((set, get) => ({
  personalities: [],
  filteredPersonalities: [],
  selectedPersonality: null,
  shortlist: [],
  applications: [],
  assignments: [],
  employees: [],
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
    const newApplication: Application = {
      id: `a${Date.now()}`,
      userId: 'u1',
      userName: '张明',
      items: state.shortlist.map((item, index) => ({
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
    set({ personalities: newPersonalities });
    get().applyFilters();
    saveToStorage({ ...state, personalities: newPersonalities });
  },

  updateQuotaRenewalNotice: (companyId, notice) => {
    console.log('Update quota renewal notice:', companyId, notice);
  },

  resolveAlert: (alertId) => {
    console.log('Resolve alert:', alertId);
  },
}));
