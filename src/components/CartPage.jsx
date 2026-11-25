import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import './CartPage.css'

function formatPrice(p) {
  return `$${p.toFixed(2)}`
}

export default function CartPage() {
  const cart = useCart()

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="add-btn add-btn-lg">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h2 className="section-title">Your Cart ({cart.count} items)</h2>
      <div className="cart-table">
        <div className="cart-head">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
          <span></span>
        </div>
        {cart.items.map((item) => (
          <div key={item.id} className="cart-row">
            <div className="cart-item">
              <img
                src={item.thumbnail || item.images?.[0]}
                alt={item.title}
              />
              <div>
                <Link to={`/product/${item.id}`}>{item.title}</Link>
                <span className="cart-brand">{item.brand}</span>
              </div>
            </div>
            <span>{formatPrice(item.price)}</span>
            <div className="qty">
              <button
                aria-label="Decrease"
                onClick={() =>
                  cart.setQty(item.id, Math.max(1, item.quantity - 1))
                }
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => {
                  const v = Math.max(1, parseInt(e.target.value, 10) || 1)
                  cart.setQty(item.id, v)
                }}
              />
              <button
                aria-label="Increase"
                onClick={() => cart.setQty(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <span>{formatPrice(item.price * item.quantity)}</span>
            <button
              className="remove-btn"
              onClick={() => cart.remove(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div>
          <p>Total items: {cart.count}</p>
          <button className="link-btn" onClick={cart.clear}>
            Clear cart
          </button>
        </div>
        <div className="cart-total">
          <span>Total</span>
          <strong>{formatPrice(cart.total)}</strong>
        </div>
      </div>

      <div className="cart-actions">
        <Link to="/" className="link-btn">
          ← Continue Shopping
        </Link>
        <button className="add-btn add-btn-lg" disabled>
          Checkout (coming soon)
        </button>
      </div>
    </div>
  )
}