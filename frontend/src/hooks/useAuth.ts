/**
 * useAuth Hook
 * Custom hook for authentication using Redux
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logout, checkAuth } from '@/store/slices/authSlice';
import { AccountResponse } from '@/types';

interface UseAuthReturn {
  user: AccountResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userId: number | null;
}

export const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, isLoading, error, token } = useAppSelector(
    (state) => state.auth
  );

  // Check authentication on mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    userId: user?.id || null,
  };
};
