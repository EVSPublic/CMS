import { api, type ApiResponse } from './api';
import { logService } from './logService';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  brandAccess: string[];
  permissions: { [brand: string]: string[] };
  lastLogin?: string;
  status: string;
  createdAt: string;
}

export interface LoginResponse {
  ok: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
  permissions: { [brand: string]: string[] };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdateRequest {
  name: string;
  email: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<any>('/api/v1/auth/login', request);

    if (response.ok && (response as any).accessToken) {
      // Backend returns data directly, not wrapped in a data property
      const backendData = response as any;
      this.setTokens(backendData.accessToken, backendData.refreshToken);
      this.setUser(backendData.user);

      // Log successful login
      logService.logUserAction(
        'user_login',
        `Kullanıcı ${backendData.user.email} sisteme giriş yaptı`,
        'success'
      );

      // Transform backend response to expected format
      return {
        ok: true,
        data: {
          ok: backendData.ok,
          accessToken: backendData.accessToken,
          refreshToken: backendData.refreshToken,
          expiresIn: backendData.expiresIn,
          user: backendData.user,
          permissions: backendData.permissions
        }
      };
    }

    return response;
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    const user = this.getUser();

    console.log('Logging out, refresh token:', refreshToken);
    if (refreshToken) {
      try {
        await api.post('/api/v1/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    // Log logout before clearing data
    if (user) {
      logService.logUserAction(
        'user_logout',
        `Kullanıcı ${user.email} sistemden çıkış yaptı`,
        'info'
      );
    }

    this.clearAuthData();
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return {
        ok: false,
        error: {
          code: 'NO_REFRESH_TOKEN',
          message: 'No refresh token available'
        }
      };
    }

    const response = await api.post<LoginResponse>('/api/v1/auth/refresh', { refreshToken });
    
    if (response.ok && response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
      this.setUser(response.data.user);
    } else {
      this.clearAuthData();
    }
    
    return response;
  }

  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<any>> {
    return api.post('/api/v1/auth/change-password', request);
  }

  async updateProfile(request: ProfileUpdateRequest): Promise<ApiResponse<User>> {
    const response = await api.put<User>('/api/v1/auth/me', request);
    
    if (response.ok && response.data) {
      this.setUser(response.data);
    }
    
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<any>('/api/v1/auth/me');

    if (response.ok && (response as any).id) {
      // Backend returns user data directly, wrap it in expected format
      return {
        ok: true,
        data: response as unknown as User
      };
    }

    return response;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  hasPermission(brand: string, permission: string): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    const brandPermissions = user.permissions[brand] || [];
    return brandPermissions.includes(permission);
  }

  hasBrandAccess(brand: string): boolean {
    const user = this.getUser();
    return user?.brandAccess.includes(brand) ?? false;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

export const authService = new AuthService();