import { createContext, useContext, useReducer, useMemo } from 'react'

const CartContext = createContext()

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i,
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const value = useMemo(
    () => ({
      items: state.items,
      count: state.items.reduce((s, i) => s + i.quantity, 0),
      total: state.items.reduce((s, i) => s + i.price * i.quantity, 0),
      add: (p) => dispatch({ type: 'ADD', product: p }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      setQty: (id, q) => dispatch({ type: 'SET_QTY', id, quantity: q }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}