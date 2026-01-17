import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

interface Modal {
  id: string
  component: ReactNode
  props?: Record<string, unknown>
}

interface UIState {
  toasts: Toast[]
  modals: Modal[]
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isCartDrawerOpen: boolean
}

type UIAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'OPEN_MODAL'; payload: Modal }
  | { type: 'CLOSE_MODAL'; payload?: string }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_MOBILE_MENU'; payload: boolean }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'SET_SEARCH'; payload: boolean }
  | { type: 'TOGGLE_CART_DRAWER' }
  | { type: 'SET_CART_DRAWER'; payload: boolean }

interface UIContextType {
  state: UIState
  showToast: (type: Toast['type'], message: string, duration?: number) => void
  hideToast: (id: string) => void
  openModal: (component: ReactNode, props?: Record<string, unknown>) => string
  closeModal: (id?: string) => void
  toggleMobileMenu: () => void
  setMobileMenu: (isOpen: boolean) => void
  toggleSearch: () => void
  setSearch: (isOpen: boolean) => void
  toggleCartDrawer: () => void
  setCartDrawer: (isOpen: boolean) => void
}

const initialState: UIState = {
  toasts: [],
  modals: [],
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isCartDrawerOpen: false,
}

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] }

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      }

    case 'OPEN_MODAL':
      return { ...state, modals: [...state.modals, action.payload] }

    case 'CLOSE_MODAL':
      if (action.payload) {
        return {
          ...state,
          modals: state.modals.filter(m => m.id !== action.payload),
        }
      }
      return { ...state, modals: state.modals.slice(0, -1) }

    case 'TOGGLE_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: !state.isMobileMenuOpen }

    case 'SET_MOBILE_MENU':
      return { ...state, isMobileMenuOpen: action.payload }

    case 'TOGGLE_SEARCH':
      return { ...state, isSearchOpen: !state.isSearchOpen }

    case 'SET_SEARCH':
      return { ...state, isSearchOpen: action.payload }

    case 'TOGGLE_CART_DRAWER':
      return { ...state, isCartDrawerOpen: !state.isCartDrawerOpen }

    case 'SET_CART_DRAWER':
      return { ...state, isCartDrawerOpen: action.payload }

    default:
      return state
  }
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState)

  const showToast = useCallback((type: Toast['type'], message: string, duration = 5000) => {
    const id = `toast-${Date.now()}`
    dispatch({ type: 'ADD_TOAST', payload: { id, type, message, duration } })

    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: id })
      }, duration)
    }
  }, [])

  const hideToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id })
  }, [])

  const openModal = useCallback((component: ReactNode, props?: Record<string, unknown>) => {
    const id = `modal-${Date.now()}`
    dispatch({ type: 'OPEN_MODAL', payload: { id, component, props } })
    return id
  }, [])

  const closeModal = useCallback((id?: string) => {
    dispatch({ type: 'CLOSE_MODAL', payload: id })
  }, [])

  const toggleMobileMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' })
  }, [])

  const setMobileMenu = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_MOBILE_MENU', payload: isOpen })
  }, [])

  const toggleSearch = useCallback(() => {
    dispatch({ type: 'TOGGLE_SEARCH' })
  }, [])

  const setSearch = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_SEARCH', payload: isOpen })
  }, [])

  const toggleCartDrawer = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART_DRAWER' })
  }, [])

  const setCartDrawer = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_CART_DRAWER', payload: isOpen })
  }, [])

  return (
    <UIContext.Provider
      value={{
        state,
        showToast,
        hideToast,
        openModal,
        closeModal,
        toggleMobileMenu,
        setMobileMenu,
        toggleSearch,
        setSearch,
        toggleCartDrawer,
        setCartDrawer,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}
