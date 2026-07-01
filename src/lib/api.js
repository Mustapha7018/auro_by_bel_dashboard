/**
 * API client for the Aura by Bel backend (admin surface).
 * Base URL: VITE_API_BASE (http://localhost:8000 in dev, api.aurabybel.shop in prod).
 */
const BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'aura-dash.token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => {
  if (t) localStorage.setItem(TOKEN_KEY, t)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let detail = `Something went wrong (${res.status}).`
    try {
      const d = await res.json()
      if (d && typeof d.detail === 'string') detail = d.detail
    } catch {
      /* non-JSON */
    }
    const err = new Error(detail)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  base: BASE,

  // auth
  login: (body) => request('/auth/login', { method: 'POST', body, auth: false }),
  me: () => request('/auth/me'),
  changePassword: (body) => request('/auth/password', { method: 'POST', body }),

  // products
  products: () => request('/admin/products'),
  categories: () => request('/admin/categories'),
  createProduct: (body) => request('/admin/products', { method: 'POST', body }),
  updateProduct: (id, body) => request(`/admin/products/${id}`, { method: 'PUT', body }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  setStock: (id, stock) => request(`/admin/products/${id}/stock`, { method: 'PATCH', body: { stock } }),

  // bookings
  bookings: () => request('/admin/bookings'),
  setBookingStatus: (id, status) => request(`/admin/bookings/${id}`, { method: 'PATCH', body: { status } }),
  deleteBooking: (id) => request(`/admin/bookings/${id}`, { method: 'DELETE' }),

  // availability
  availability: () => request('/availability', { auth: false }),
  saveAvailability: (body) => request('/admin/availability', { method: 'PUT', body }),

  // orders + payments
  orders: () => request('/admin/orders'),
  setOrderStatus: (id, status) => request(`/admin/orders/${id}`, { method: 'PATCH', body: { status } }),
  addPayment: (id, body) => request(`/admin/orders/${id}/payments`, { method: 'POST', body }),
  removePayment: (id, pid) => request(`/admin/orders/${id}/payments/${pid}`, { method: 'DELETE' }),

  // customers
  customers: () => request('/admin/customers'),
  customer: (id) => request(`/admin/customers/${id}`),

  // analytics
  analytics: () => request('/admin/analytics'),
}
