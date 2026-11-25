import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCart } from '../CartContext'
import { fetchProduct } from '../api'
import './ProductDetail.css'

function formatPrice(p) {
  return `$${p.toFixed(2)}`
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cart = useCart()

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProduct(id)
      .then((p) => {
        if (!cancelled) setProduct(p)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading)
    return (
      <div className="detail">
        <p>Loading product…</p>
      </div>
    )
  if (error || !product)
    return (
      <div className="detail">
        <p>Product not found.</p>
        <Link to="/">← Back to shop</Link>
      </div>
    )

  const discounted = product.price * (1 - product.discountPercentage / 100)
  const imgs =
    product.images && product.images.length
      ? product.images
      : [product.thumbnail]

  return (
    <div className="detail">
      <Link to="/" className="back-link" onClick={() => {}}>
        ← Back
      </Link>
      <div className="detail-grid">
        <div className="detail-media">
          {imgs.map((src, i) => (
            <img key={i} src={src} alt={`${product.title} ${i + 1}`} />
          ))}
        </div>
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-pricing">
            <span className="price-now">{formatPrice(discounted)}</span>
            {product.discountPercentage > 0 && (
              <span className="price-old">{formatPrice(product.price)}</span>
            )}
            <span className="rating">★ {product.rating?.toFixed(1)}</span>
          </div>

          <div className="detail-meta">
            <span>📦 {product.stock} in stock</span>
            <span>🏷️ Brand: {product.brand}</span>
            <span>🏷️ SKU: {product.sku}</span>
            <span>🚚 {product.shippingInformation}</span>
            <span>↩️ {product.returnPolicy}</span>
            <span>🛡️ {product.warrantyInformation}</span>
          </div>

          <div className="detail-actions">
            <button
              className="add-btn add-btn-lg"
              onClick={() => {
                cart.add(product)
                navigate('/cart')
              }}
            >
              + Add to Cart
            </button>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div className="reviews">
              <h3>Customer Reviews</h3>
              {product.reviews.map((r, i) => (
                <div key={i} className="review">
                  <div>
                    <strong>{r.reviewerName}</strong>
                    <span className="review-date">
                      {new Date(r.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p>★ {r.rating}/5</p>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}