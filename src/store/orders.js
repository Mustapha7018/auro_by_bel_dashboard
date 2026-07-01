import { defineStore } from 'pinia'
import { api } from '@/lib/api'

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
        this.items = await api.orders()
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
      this._replace(await api.setOrderStatus(id, status))
    },
    async addPayment(id, { amount, method = 'Cash', note = '' }) {
      this._replace(await api.addPayment(id, { amount: Number(amount), method, note }))
    },
    async removePayment(id, paymentId) {
      const updated = await api.removePayment(id, paymentId)
      if (updated && updated.id) this._replace(updated)
    },
  },
})
