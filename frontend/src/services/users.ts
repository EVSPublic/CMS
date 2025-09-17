import { api, ApiResponse, PaginationMeta } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  brandAccess: string[];
  permissions: Record<string, string[]>;
  lastLogin?: string;
  status: string;
  createdAt: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  brandAccess: string[];
  lastLogin?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  brandAccess: string[];
  permissions: Record<string, string[]>;
  status: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
  brandAccess: string[];
  permissions: Record<string, string[]>;
  status: string;
}

export interface UserSearchRequest {
  page?: number;
  perPage?: number;
  search?: string;
  role?: string;
  status?: string;
  brandFilter?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SetUserPasswordRequest {
  newPassword: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: Record<string, number>;
  usersByBrand: Record<string, number>;
  usersLoggedInLast7Days: number;
  usersLoggedInLast30Days: number;
}

class UsersService {
  async getUsers(searchRequest: UserSearchRequest = {}): Promise<ApiResponse<UserListItem[]>> {
    const params = new URLSearchParams();
    
    if (searchRequest.page) params.append('page', searchRequest.page.toString());
    if (searchRequest.perPage) params.append('perPage', searchRequest.perPage.toString());
    if (searchRequest.search) params.append('search', searchRequest.search);
    if (searchRequest.role) params.append('role', searchRequest.role);
    if (searchRequest.status) params.append('status', searchRequest.status);
    if (searchRequest.brandFilter) params.append('brandFilter', searchRequest.brandFilter);
    if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
    if (searchRequest.sortOrder) params.append('sortOrder', searchRequest.sortOrder);
    
    const endpoint = `/api/admin/v1/users${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<UserListItem[]>(endpoint);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return api.get<User>(`/api/admin/v1/users/${id}`);
  }

  async createUser(request: CreateUserRequest): Promise<ApiResponse<User>> {
    return api.post<User>('/api/admin/v1/users', request);
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<ApiResponse<User>> {
    return api.put<User>(`/api/admin/v1/users/${id}`, request);
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    return api.delete(`/api/admin/v1/users/${id}`);
  }

  async setUserPassword(id: string, request: SetUserPasswordRequest): Promise<ApiResponse<any>> {
    return api.post(`/api/admin/v1/users/${id}/password`, request);
  }

  async activateUser(id: string): Promise<ApiResponse<any>> {
    return api.post(`/api/admin/v1/users/${id}/activate`);
  }

  async deactivateUser(id: string): Promise<ApiResponse<any>> {
    return api.post(`/api/admin/v1/users/${id}/deactivate`);
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return api.get<UserStats>('/api/admin/v1/users/stats');
  }

  async getAvailableRoles(): Promise<ApiResponse<string[]>> {
    return api.get<string[]>('/api/admin/v1/users/roles');
  }

  async getAvailableBrands(): Promise<ApiResponse<string[]>> {
    return api.get<string[]>('/api/admin/v1/users/brands');
  }
}

export const usersService = new UsersService();