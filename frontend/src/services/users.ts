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
  brandId?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  brandId?: number;
  status?: string;
}

export interface UserSearchRequest {
  page?: number;
  pageSize?: number;
  brandId?: number;
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
  async getUsers(searchRequest: UserSearchRequest = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();

    if (searchRequest.page) params.append('page', searchRequest.page.toString());
    if (searchRequest.pageSize) params.append('pageSize', searchRequest.pageSize.toString());
    if (searchRequest.brandId) params.append('brandId', searchRequest.brandId.toString());

    const endpoint = `/api/v1/users${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<any>(endpoint);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return api.get<User>(`/api/v1/users/${id}`);
  }

  async createUser(request: CreateUserRequest): Promise<ApiResponse<User>> {
    return api.post<User>('/api/v1/users', request);
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<ApiResponse<User>> {
    return api.put<User>(`/api/v1/users/${id}`, request);
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    return api.delete(`/api/v1/users/${id}`);
  }

}

export const usersService = new UsersService();