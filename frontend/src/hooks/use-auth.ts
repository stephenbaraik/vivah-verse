import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore, type User } from '@/stores/auth-store';
import { toast } from '@/stores/toast-store';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: 'CLIENT' | 'VENDOR';
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
}

// API Functions
async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post('/auth/login', credentials);
  return response.data;
}

async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post('/auth/register', data);
  return response.data;
}

async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

async function getSessions(): Promise<Session[]> {
  const response = await api.get('/auth/sessions');
  return response.data;
}

// Hooks
export function useLogin() {
  const { login: setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Welcome back!', `Signed in as ${data.user.email}`);
    },
    onError: () => {
      toast.error('Login failed', 'Please check your credentials and try again.');
    },
  });
}

export function useRegister() {
  const { login: setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Account created!', 'Welcome to Vivah Verse');
    },
    onError: () => {
      toast.error('Registration failed', 'Please try again with different credentials.');
    },
  });
}

export function useLogout() {
  const { logout: clearAuth } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.info('Signed out', 'See you next time!');
    },
  });
}

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });
}
