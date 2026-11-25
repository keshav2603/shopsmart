const BASE = 'https://dummyjson.com/products'

// Fetch one page of products using the dummyjson built-in params:
//   - browse:  GET /products?limit&skip[&sortBy&order]
//   - category:GET /products/category/:slug?limit&skip[&sortBy&order]
//   - search:  GET /products/search?q=...&limit&skip[&sortBy&order]
// Returns { products, total, limit, skip }.
export async function fetchProducts({
  page = 1,
  limit = 12,
  q = '',
  category = '',
  sortBy = '',
  order = '',
} = {}) {
  const query = q.trim()
  let base
  if (query) {
    base = `${BASE}/search?q=${encodeURIComponent(query)}`
  } else if (category) {
    base = `${BASE}/category/${encodeURIComponent(category)}`
  } else {
    base = BASE
  }

  const params = new URLSearchParams()
  params.set('limit', limit)
  params.set('skip', (page - 1) * limit)
  if (sortBy) {
    params.set('sortBy', sortBy)
    params.set('order', order)
  }

  const res = await fetch(`${base}?${params.toString()}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/categories`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error(`Product ${id} not found`)
  return res.json()
}