import { create } from 'zustand';
import type { Personality, FilterOptions, ShortlistItem, Application } from '../types';
import { mockPersonalities, mockShortlists, mockApplications } from '../data/mockData';

interface PersonalityState {
  personalities: Personality[];
  filteredPersonalities: Personality[];
  selectedPersonality: Personality | null;
  shortlist: ShortlistItem[];
  applications: Application[];
  filters: FilterOptions;
  isLoading: boolean;
  setFilter: (key: keyof FilterOptions, value: string | undefined) => void;
  applyFilters: () => void;
  selectPersonality: (id: string) => void;
  clearSelection: () => void;
  addToShortlist: (personalityId: string, notes?: string) => void;
  removeFromShortlist: (id: string) => void;
  submitApplication: (usage: string, expectedDate: string, budget: number) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
}

export const usePersonalityStore = create<PersonalityState>((set, get) => ({
  personalities: mockPersonalities,
  filteredPersonalities: mockPersonalities,
  selectedPersonality: null,
  shortlist: mockShortlists,
  applications: mockApplications,
  filters: {},
  isLoading: false,
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().applyFilters();
  },
  applyFilters: () => {
    const { personalities, filters } = get();
    let filtered = [...personalities];

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
    const personality = get().personalities.find((p) => p.id === personalityId);
    if (!personality) return;

    const newItem: ShortlistItem = {
      id: `s${Date.now()}`,
      userId: 'u1',
      personalityId,
      personality,
      notes,
      addedAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ shortlist: [...state.shortlist, newItem] }));
  },
  removeFromShortlist: (id) => {
    set((state) => ({ shortlist: state.shortlist.filter((item) => item.id !== id) }));
  },
  submitApplication: (usage, expectedDate, budget) => {
    const shortlist = get().shortlist;
    const newApplication: Application = {
      id: `a${Date.now()}`,
      userId: 'u1',
      userName: '张明',
      items: shortlist.map((item, index) => ({
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
    set((state) => ({
      applications: [newApplication, ...state.applications],
      shortlist: [],
    }));
  },
  approveApplication: (id) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status: 'approved' as const } : app
      ),
    }));
  },
  rejectApplication: (id, reason) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status: 'rejected' as const, rejectionReason: reason } : app
      ),
    }));
  },
}));
