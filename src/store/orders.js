import { defineStore } from 'pinia'
import { seedOrders } from '@/data/seed'
import { uid } from '@/utils'

export const ORDER_STATUSES = ['processing', 'delivered', 'cancelled']
export const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank transfer', 'Card']

/** Sum of payments recorded against an order. */
export const orderPaid = (o) => (o.payments || []).reduce((s, p) => s + (p.amount || 0), 0)
/** Outstanding balance (never negative). */
export const orderBalance = (o) => Math.max(0, (o.total || 0) - orderPaid(o))
export const isSettled = (o) => orderBalance(o) === 0

export const useOrdersStore = defineStore('orders', {
  state: () => ({ items: seedOrders }),

  getters: {
    sorted: (s) => [...s.items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    // collected = everything actually paid; outstanding = unpaid balances
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
    setStatus(id, status) {
      const o = this.items.find((x) => x.id === id)
      if (o) o.status = status
    },

    /** Record a payment Bel received against an order. */
    addPayment(id, { amount, method = 'Cash', note = '' }) {
      const o = this.items.find((x) => x.id === id)
      const amt = Number(amount)
      if (!o || !amt || amt <= 0) return
      o.payments = o.payments || []
      o.payments.push({ id: uid('pay'), amount: amt, method, note: note.trim(), ts: new Date().toISOString() })
    },

    removePayment(id, paymentId) {
      const o = this.items.find((x) => x.id === id)
      if (o) o.payments = (o.payments || []).filter((p) => p.id !== paymentId)
    },
  },
})
