import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

export const useLogin = () => {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      const { access_token, refresh_token } = data.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      
      // Fetch user data
      queryClient.invalidateQueries({ queryKey: ['me'] })
      
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      email: string
      password: string
      name: string
      organization_name: string
      organization_type: string
    }) => authApi.register(data),
    onSuccess: (data) => {
      const { access_token, refresh_token } = data.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      
      queryClient.invalidateQueries({ queryKey: ['me'] })
      
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
  const queryClient = useQueryClient()
  const { logout: storeLogout } = useAuthStore()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      storeLogout()
      queryClient.clear()
      toast.success('Logged out successfully')
      navigate('/')
    },
    onError: () => {
      // Still logout locally even if API fails
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      storeLogout()
      queryClient.clear()
      navigate('/')
    },
  })
}

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
