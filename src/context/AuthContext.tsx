import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { User, AuthState } from '@/types/user'
import { sampleUser } from '@/data/users'

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

interface AuthContextType {
  state: AuthState
  login: (email: string, password: string) => Promise<boolean>
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

    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = async (email: string, _password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' })

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock authentication - accept any email/password for demo
    if (email) {
      const user: User = {
        ...sampleUser,
        email,
      }
      dispatch({ type: 'LOGIN_SUCCESS', payload: user })
      return true
    }

    dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid email or password' })
    return false
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: data })
  }

  return (
    <AuthContext.Provider value={{ state, login, logout, updateUser }}>
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
