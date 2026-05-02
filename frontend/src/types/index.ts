/**
 * Global Type Definitions
 * Centralized type definitions for the entire application
 */

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  account: AccountResponse;
  access_token: string;
  token_type: string;
  expires_at: string;
}

export interface AccountResponse {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
  created_at: string;
  updated_at: string;
  accounts_id: number;
  accounts: AccountResponse;
  create_accounts_id: number;
  create_accounts: AccountResponse;
  update_accounts_id: number | null;
  update_accounts: AccountResponse | null;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string;
  account_id: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  deadline?: string;
}

export interface TaskFilterRequest {
  status?: TaskStatus;
  start_date?: Date;
  end_date?: Date;
}

export interface TaskListResponse {
  data: Task[];
  total: number;
  page?: string;
  limit?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  has_next: boolean;
}

// JWT Payload
export interface JwtPayload {
  user_id: number;
  email: string;
  [key: string]: unknown;
}

// Error Types
export interface ApiError {
  message: string;
  error?: string;
  status?: number;
}
