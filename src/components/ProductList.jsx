import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../api'
import ProductCard from './ProductCard'
import './ProductList.css'

const PER_PAGE = 12

// Map UI sort option → dummyjson sortBy/order params (built-in API sort).
const SORTS = {
  'price-asc': { sortBy: 'price', order: 'asc' },
  'price-desc': { sortBy: 'price', order: 'desc' },
  'rating-desc': { sortBy: 'rating', order: 'desc' },
  'rating-asc': { sortBy: 'rating', order: 'asc' },
  'name-asc': { sortBy: 'title', order: 'asc' },
}

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const [categories, setCategories] = useState([])
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  // Fetch the current page from the API whenever filters change.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchProducts({ page, limit: PER_PAGE, q, category, ...SORTS[sort] })
      .then((d) => {
        if (!cancelled) setData(d)
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
  }, [q, category, sort, page])

  function updateParams(key, value) {
    const sp = new URLSearchParams(searchParams)
    if (value) sp.set(key, value)
    else sp.delete(key)
    if (key !== 'page') sp.delete('page') // reset page on filter change
    setSearchParams(sp)
  }

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const shown = data?.products ?? []
  const activeCategory = categories.find((c) => c.slug === category)?.name
  const currentPage = Math.min(page, totalPages)

  return (
    <div className="product-list">
      {q ? (
        <h2 className="section-title">
          Search results for “{q}” — {total} found
        </h2>
      ) : (
        <h2 className="section-title">
          {activeCategory || 'All Products'}{' '}
          <span className="result-count-inline">({total})</span>
        </h2>
      )}

      <div className="toolbar">
        <div className="filter-group">
          <label htmlFor="category-select">Category</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => updateParams('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => updateParams('sort', e.target.value)}
          >
            <option value="">Relevance</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating-desc">Rating: High → Low</option>
            <option value="rating-asc">Rating: Low → High</option>
            <option value="name-asc">Name: A → Z</option>
          </select>
        </div>

        {q && (
          <button
            className="link-btn"
            onClick={() => {
              const sp = new URLSearchParams(searchParams)
              sp.delete('q')
              sp.delete('page')
              setSearchParams(sp)
            }}
          >
            ✕ Clear search
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid">
          {Array.from({ length: PER_PAGE }, (_, i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      ) : error ? (
        <div className="empty">
          <p>⚠️ {error}</p>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          <p>
            {q
              ? `No products found for “${q}”.`
              : 'No products in this category.'}
          </p>
        </div>
      ) : (
        <>
          <p className="range-info">
            Showing {(currentPage - 1) * PER_PAGE + 1}–
            {Math.min(currentPage * PER_PAGE, total)} of {total}
          </p>
          <div className="grid">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Products">
          <button
            disabled={currentPage === 1}
            onClick={() => updateParams('page', currentPage - 1)}
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={n === currentPage ? 'active' : ''}
              aria-current={n === currentPage ? 'page' : undefined}
              onClick={() => updateParams('page', n)}
            >
              {n}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => updateParams('page', currentPage + 1)}
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  )
}