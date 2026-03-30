import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import type { User, AuthState } from '@/types';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user as User);
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      company_name: string;
      role: string;
    }) => authApi.register(data),
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user as User);
      localStorage.setItem('auth_token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      logout();
      queryClient.clear();
    },
  });
}
