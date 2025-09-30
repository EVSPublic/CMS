import { api, ApiResponse, PaginationMeta } from './api';
import { logService } from './logService';

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

export interface UsersResponse {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class UsersService {
  async getUsers(searchRequest: UserSearchRequest = {}): Promise<ApiResponse<UsersResponse>> {
    const params = new URLSearchParams();

    if (searchRequest.page) params.append('page', searchRequest.page.toString());
    if (searchRequest.pageSize) params.append('pageSize', searchRequest.pageSize.toString());

    const endpoint = `/api/v1/users${params.toString() ? `?${params.toString()}` : ''}`;
    return api.get<UsersResponse>(endpoint);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return api.get<User>(`/api/v1/users/${id}`);
  }

  async createUser(request: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await api.post<User>('/api/v1/users', request);

    if (response.ok && response.data) {
      logService.logUserAction(
        'user_create',
        `Kullanıcı oluşturuldu: ${request.email} (${request.role})`,
        'success'
      );
    }

    return response;
  }

  async updateUser(id: string, request: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await api.put<User>(`/api/v1/users/${id}`, request);

    if (response.ok && response.data) {
      logService.logUserAction(
        'user_update',
        `Kullanıcı güncellendi: ${request.email || response.data.email} (${request.role || response.data.role})`,
        'success'
      );
    }

    return response;
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    const response = await api.delete(`/api/v1/users/${id}`);

    if (response.ok) {
      logService.logUserAction(
        'user_delete',
        `Kullanıcı silindi: ${id}`,
        'warning'
      );
    }

    return response;
  }

}

export const usersService = new UsersService();