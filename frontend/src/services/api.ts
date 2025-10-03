// API Configuration and Base Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiService {
  private baseUrl: string;
  private tokenRefreshTimeout: number | null = null;
  private isRefreshing = false;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.scheduleTokenRefresh();

    // Listen for storage events to sync token refresh across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'access_token' && e.newValue) {
        this.scheduleTokenRefresh();
      }
    });
  }

  private scheduleTokenRefresh() {
    // Clear existing timeout
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }

    // Schedule refresh 5 minutes before expiry (55 minutes for a 1-hour token)
    const refreshTime = 55 * 60 * 1000; // 55 minutes in milliseconds
    this.tokenRefreshTimeout = window.setTimeout(() => {
      this.refreshTokenIfNeeded();
    }, refreshTime);
  }

  private async refreshTokenIfNeeded() {
    if (this.isRefreshing) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    this.isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData.ok && refreshData.accessToken) {
          localStorage.setItem('access_token', refreshData.accessToken);
          localStorage.setItem('user', JSON.stringify(refreshData.user));
          console.log('Token refreshed successfully');

          // Schedule next refresh
          this.scheduleTokenRefresh();
        }
      } else {
        console.error('Token refresh failed, logging out');
        this.clearAuth();
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  private clearAuth() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
      this.tokenRefreshTimeout = null;
    }

    // Dispatch a custom event to notify the auth hook
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'access_token',
      oldValue: localStorage.getItem('access_token'),
      newValue: null,
      storageArea: localStorage
    }));
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      // Refresh token on activity (reschedule the refresh timer)
      if (!endpoint.includes('/auth/refresh')) {
        this.scheduleTokenRefresh();
      }

      // Get token from localStorage
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && !isRetry && !endpoint.includes('/auth/')) {
        try {
          const refreshResponse = await fetch(`${this.baseUrl}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.ok && refreshData.accessToken) {
              localStorage.setItem('access_token', refreshData.accessToken);
              localStorage.setItem('user', JSON.stringify(refreshData.user));

              // Reschedule token refresh
              this.scheduleTokenRefresh();

              // Retry the original request with new token
              return this.makeRequest<T>(endpoint, options, true);
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }

        // If refresh fails, clear auth data
        this.clearAuth();
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: data.error || {
            code: 'HTTP_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
        };
      }

      // If the response has the ApiResponse structure, return as-is
      if (data.hasOwnProperty('ok')) {
        return data;
      }

      // Otherwise, wrap the response in our ApiResponse structure
      return {
        ok: true,
        data: data
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Failed to connect to the server',
          details: error,
        },
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService(API_BASE_URL);