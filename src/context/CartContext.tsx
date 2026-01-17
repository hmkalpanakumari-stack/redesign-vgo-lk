import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { Product, ProductVariant } from '@/types/product'
import type { CartItem, CartState } from '@/types/order'

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant?: ProductVariant; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { itemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' }

interface CartContextType {
  state: CartState
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  clearCart: () => void
  itemCount: number
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
}

function calculateTotals(items: CartItem[], couponDiscount: number = 0): Omit<CartState, 'items' | 'couponCode'> {
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant?.priceModifier
      ? item.product.price.amount + item.variant.priceModifier
      : item.product.price.amount
    return sum + price * item.quantity
  }, 0)

  const shipping = subtotal >= 5000 ? 0 : 350
  const discount = couponDiscount
  const total = subtotal - discount + shipping

  return { subtotal, shipping, discount, total, couponDiscount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity } = action.payload
      const existingIndex = state.items.findIndex(
        item => item.product.id === product.id && item.variant?.id === variant?.id
      )

      let newItems: CartItem[]
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}`,
          product,
          variant,
          quantity,
          addedAt: new Date().toISOString(),
        }
        newItems = [...state.items, newItem]
      }

      const totals = calculateTotals(newItems, state.couponDiscount)
      return { ...state, items: newItems, ...totals }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.itemId)
      const totals = calculateTotals(newItems, state.couponDiscount)
      return { ...state, items: newItems, ...totals }
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== itemId)
        const totals = calculateTotals(newItems, state.couponDiscount)
        return { ...state, items: newItems, ...totals }
      }

      const newItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
      const totals = calculateTotals(newItems, state.couponDiscount)
      return { ...state, items: newItems, ...totals }
    }

    case 'APPLY_COUPON': {
      const { code, discount } = action.payload
      const totals = calculateTotals(state.items, discount)
      return { ...state, couponCode: code, couponDiscount: discount, ...totals }
    }

    case 'REMOVE_COUPON': {
      const totals = calculateTotals(state.items, 0)
      return { ...state, couponCode: undefined, couponDiscount: undefined, ...totals }
    }

    case 'CLEAR_CART':
      return initialState

    default:
      return state
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })
  }

  const applyCoupon = (code: string, discount: number) => {
    dispatch({ type: 'APPLY_COUPON', payload: { code, discount } })
  }

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
