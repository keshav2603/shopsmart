import { useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ProductCard from './ProductCard'
import './ProductList.css'

export default function SearchResults({ products, onClear }) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') || ''

  const results = useMemo(() => {
    if (!q) return []
    const term = q.toLowerCase()
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    )
  }, [products, q])

  return (
    <div className="product-list">
      <div className="toolbar">
        <h2 className="section-title">
          Results for “{q}” — {results.length} found
        </h2>
        <button className="link-btn" onClick={onClear}>
          ← Back to all products
        </button>
      </div>

      {results.length === 0 ? (
        <div className="empty">
          <p>No products found for “{q}”.</p>
        </div>
      ) : (
        <div className="grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}