import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export const useLogin = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password).then((res) => res.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      localStorage.setItem('agroops_token', data.token)
      queryClient.setQueryData(['user'], data.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed')
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: {
      email: string
      password: string
      first_name: string
      last_name: string
      company_name?: string
      state: string
      role: 'buyer' | 'supplier'
    }) => authApi.register(data).then((res) => res.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      localStorage.setItem('agroops_token', data.token)
      queryClient.setQueryData(['user'], data.user)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed')
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth()
      localStorage.removeItem('agroops_token')
      queryClient.clear()
      toast.success('Logged out successfully')
      navigate('/')
    },
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.me().then((res) => res.data),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useRefreshToken = () => {
  const { setAuth } = useAuthStore()
  
  return useMutation({
    mutationFn: () => authApi.refreshToken().then((res) => res.data),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      localStorage.setItem('agroops_token', data.token)
    },
  })
}
