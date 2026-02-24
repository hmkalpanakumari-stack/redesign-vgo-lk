import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { User, AuthState } from '@/types/user'
import { authService } from '@/services'

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean }

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<boolean>
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string; confirmPassword: string }) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }

    case 'LOGOUT':
      return initialState

    case 'UPDATE_USER':
      if (!state.user) return state
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        dispatch({ type: 'SET_LOADING', payload: true })
        try {
          const user = await authService.getCurrentUser()
          dispatch({ type: 'LOGIN_SUCCESS', payload: user })
        } catch {
          // Token invalid or expired
          authService.logout()
          dispatch({ type: 'LOGOUT' })
        }
      }
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const response = await authService.login({ email, password })
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid email or password'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      return false
    }
  }

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string; confirmPassword: string }): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const response = await authService.register(data)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user })
      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      return false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore logout errors
    }
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data })
  }

  return (
    <AuthContext.Provider value={{ state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
