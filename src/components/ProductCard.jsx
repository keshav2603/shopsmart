import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import './ProductCard.css'

function formatPrice(p) {
  return `$${p.toFixed(2)}`
}

export default function ProductCard({ product }) {
  const cart = useCart()
  const discounted = product.price * (1 - product.discountPercentage / 100)

  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card-link">
        <div className="card-media">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            loading="lazy"
          />
          {product.discountPercentage > 0 && (
            <span className="badge">-{Math.round(product.discountPercentage)}%</span>
          )}
        </div>
        <div className="card-body">
          <h3 className="card-title" title={product.title}>
            {product.title}
          </h3>
          <p className="card-desc">
            {product.description?.slice(0, 90)}
            {product.description?.length > 90 ? '…' : ''}
          </p>
          <div className="card-meta">
            <span className="rating">★ {product.rating?.toFixed(1) ?? '—'}</span>
            <span className="stock">{product.stock} in stock</span>
          </div>
        </div>
      </Link>
      <div className="card-footer">
        <div className="price">
          <span className="price-now">{formatPrice(discounted)}</span>
          {product.discountPercentage > 0 && (
            <span className="price-old">{formatPrice(product.price)}</span>
          )}
        </div>
        <button
          className="add-btn"
          onClick={(e) => {
            e.preventDefault()
            cart.add(product)
          }}
        >
          + Add
        </button>
      </div>
    </article>
  )
}