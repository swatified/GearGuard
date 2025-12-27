// Application constants

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const APP_NAME = 'GearGuard Maintenance Tracker';

// Request types
export const REQUEST_TYPES = {
  CORRECTIVE: 'corrective',
  PREVENTIVE: 'preventive',
} as const;

// Request states
export const REQUEST_STATES = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  REPAIRED: 'repaired',
  SCRAP: 'scrap',
} as const;

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: '0',
  NORMAL: '1',
  HIGH: '2',
  URGENT: '3',
} as const;

// User roles
export const USER_ROLES = {
  USER: 'user',
  TECHNICIAN: 'technician',
  MANAGER: 'manager',
  ADMIN: 'admin',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

