import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../CartContext'
import './Header.css'

export default function Header({ search, onSearchChange }) {
  const cart = useCart()
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={() => onSearchChange('')}>
          <span className="logo-mark">🛒</span> ShopSmart
        </Link>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearchChange(search.trim())
              if (e.key === 'Enter') navigate(`?q=${encodeURIComponent(search.trim())}`)
            }}
          />
          {search && (
            <button
              className="clear-btn"
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
            >
              ✕
            </button>
          )}
        </div>
        <button className="cart-btn" onClick={() => navigate('/cart')}>
          🛒 Cart
          {cart.count > 0 && <span className="cart-badge">{cart.count}</span>}
        </button>
      </div>
    </header>
  )
}