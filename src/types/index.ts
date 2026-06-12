export interface Company {
  id: string;
  name: string;
  industry: string;
  createdAt: string;
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: 'purchaser' | 'admin' | 'super_admin';
  avatar?: string;
  createdAt: string;
}

export interface Quota {
  id: string;
  companyId: string;
  totalCalls: number;
  usedCalls: number;
  warningThreshold: number;
  expiresAt: string;
}

export type ComplianceLevel = 'S' | 'A' | 'B' | 'C';

export interface Personality {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  industry: string;
  taskType: 'customer_service' | 'sales' | 'training';
  complianceLevel: ComplianceLevel;
  responseStyle: string;
  monthlyCalls: number;
  rating: number;
  price: number;
  description: string;
  capabilities: string[];
  isActive: boolean;
}

export interface ShortlistItem {
  id: string;
  userId: string;
  personalityId: string;
  personality: Personality;
  notes: string;
  addedAt: string;
}

export interface ApplicationItem {
  id: string;
  applicationId: string;
  personalityId: string;
  personality: Personality;
  quantity: number;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
  userId: string;
  userName: string;
  items: ApplicationItem[];
  usage: string;
  expectedDate: string;
  budget: number;
  status: ApplicationStatus;
  createdAt: string;
  rejectionReason?: string;
}

export interface Assignment {
  id: string;
  applicationId: string;
  userId: string;
  userName: string;
  personalityId: string;
  personality: Personality;
  expiresAt: string;
  isActive: boolean;
}

export interface UsageLog {
  id: string;
  assignmentId: string;
  personalityId: string;
  timestamp: string;
  responseTime: number;
  isSatisfied: boolean;
}

export type AlertType = 'anomaly' | 'quota_warning' | 'compliance';
export type AlertStatus = 'open' | 'resolved';

export interface Alert {
  id: string;
  companyId: string;
  type: AlertType;
  description: string;
  status: AlertStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface UsageStats {
  totalCalls: number;
  activePersonas: number;
  avgSatisfaction: number;
  pendingApprovals: number;
  trends: { date: string; calls: number }[];
}

export interface EmployeeUsage {
  id: string;
  name: string;
  avatar: string;
  assignedPersonas: { id: string; name: string }[];
  callCount: number;
  satisfaction: number;
}

export interface EvaluationResult {
  personalityId: string;
  personality: Personality;
  answer: string;
  scores: {
    accuracy: number;
    professionalism: number;
    friendliness: number;
  };
}

export interface FilterOptions {
  industry?: string;
  taskType?: string;
  complianceLevel?: string;
  responseStyle?: string;
  search?: string;
  sortBy?: 'rating' | 'monthlyCalls' | 'price' | 'newest';
}

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}
