import { useState, useEffect, useCallback } from 'react';
import { authService, type User, type LoginRequest, type ChangePasswordRequest, type ProfileUpdateRequest } from '@/services/auth';

interface UseAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseAuthActions {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  changePassword: (request: ChangePasswordRequest) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (request: ProfileUpdateRequest) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  hasPermission: (brand: string, permission: string) => boolean;
  hasBrandAccess: (brand: string) => boolean;
}

export function useAuth(): UseAuthState & UseAuthActions {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const initAuth = () => {
      const user = authService.getUser();
      const isAuthenticated = authService.isAuthenticated();
      
      if (isAuthenticated && user) {
        setState({
          user: user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    initAuth();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'access_token' || event.key === 'user') {
        initAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await authService.login(credentials);
      
      if (response.ok && response.data) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
        return { 
          success: false, 
          error: response.error?.message || 'Login failed' 
        };
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: false, 
        error: 'Network error during login' 
      };
    }
  }, []);

  const logout = useCallback(async () => {
    // Clear localStorage immediately
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Update state immediately
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    // Then make API call (fire and forget)
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }, []);

  const changePassword = useCallback(async (request: ChangePasswordRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.changePassword(request);
      
      if (response.ok) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Password change failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error during password change' 
      };
    }
  }, []);

  const updateProfile = useCallback(async (request: ProfileUpdateRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authService.updateProfile(request);
      
      if (response.ok && response.data) {
        setState(prev => ({
          ...prev,
          user: response.data!
        }));
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Profile update failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error during profile update' 
      };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      const response = await authService.getCurrentUser();
      if (response.ok && response.data) {
        setState(prev => ({
          ...prev,
          user: response.data!
        }));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [state.isAuthenticated]);

  const hasPermission = useCallback((brand: string, permission: string): boolean => {
    return authService.hasPermission(brand, permission);
  }, []);

  const hasBrandAccess = useCallback((brand: string): boolean => {
    return authService.hasBrandAccess(brand);
  }, []);

  return {
    ...state,
    login,
    logout,
    changePassword,
    updateProfile,
    refreshUser,
    hasPermission,
    hasBrandAccess
  };
}