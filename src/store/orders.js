import { defineStore } from 'pinia'
import { api } from '@/lib/api'
import { withToast } from './toasts'

export const ORDER_STATUSES = ['processing', 'delivered', 'cancelled']
export const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank transfer', 'Card']

// The API already computes these; kept as helpers so views read cleanly.
export const orderPaid = (o) => o.paid ?? 0
export const orderBalance = (o) => o.balance ?? 0

export const useOrdersStore = defineStore('orders', {
  state: () => ({ items: [], loaded: false, loading: false }),

  getters: {
    sorted: (s) => [...s.items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    revenue: (s) =>
      s.items.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + orderPaid(o), 0),
    outstanding: (s) =>
      s.items.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + orderBalance(o), 0),
    processingCount: (s) => s.items.filter((o) => o.status === 'processing').length,
    unpaidCount: (s) =>
      s.items.filter((o) => o.status !== 'cancelled' && orderBalance(o) > 0).length,
    forCustomer: (s) => (id) => s.items.filter((o) => o.customerId === id),
  },

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      this.loading = true
      try {
        this.items = await withToast(() => api.orders(), { error: 'Could not load orders.' })
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    _replace(order) {
      const i = this.items.findIndex((o) => o.id === order.id)
      if (i >= 0) this.items[i] = order
    },
    async setStatus(id, status) {
      this._replace(await withToast(() => api.setOrderStatus(id, status), { success: 'Order updated.' }))
    },
    async addPayment(id, { amount, method = 'Cash', note = '' }) {
      this._replace(
        await withToast(() => api.addPayment(id, { amount: Number(amount), method, note }), {
          success: 'Payment recorded.',
        }),
      )
    },
    async removePayment(id, paymentId) {
      const updated = await withToast(() => api.removePayment(id, paymentId), { success: 'Payment removed.' })
      if (updated && updated.id) this._replace(updated)
    },
  },
})
