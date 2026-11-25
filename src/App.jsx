import { useEffect, useRef, useState } from 'react'
import {
  Routes,
  Route,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { CartProvider } from './CartContext'
import Header from './components/Header'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import CartPage from './components/CartPage'
import './App.css'

const DEBOUNCE_MS = 400

export default function App() {
  const [initialParams] = useSearchParams()
  const [search, setSearch] = useState(initialParams.get('q') || '')
  const [debounced, setDebounced] = useState(initialParams.get('q') || '')
  const navigate = useNavigate()
  const skipFirst = useRef(true)

  // Debounce: sync the search state to a debounced value (400ms).
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [search])

  // Debounce: only navigate / update URL after the debounce settles.
  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }
    const sp = new URLSearchParams()
    const trimmed = debounced.trim()
    if (trimmed) sp.set('q', trimmed)
    navigate({ search: sp.toString() }, { replace: true })
  }, [debounced, navigate])

  return (
    <CartProvider>
      <Header search={search} onSearchChange={setSearch} />
      <main className="main">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>ShopSmart · powered by dummyjson </p>
      </footer>
    </CartProvider>
  )
}