import { defineStore } from 'pinia'
import { api } from '@/lib/api'

export const BOOKING_STATUSES = ['requested', 'confirmed', 'completed', 'cancelled']

/** Normalize a raw API booking (snake_case) to the shape the views use. */
export function normalizeBooking(b) {
  return {
    id: b.id,
    customerId: b.customer_id,
    customerName: b.customer_name,
    productId: b.product_id,
    service: b.service,
    date: b.date,
    time: b.time,
    deposit: b.deposit,
    status: b.status,
    createdAt: b.created_at,
  }
}

export const useBookingsStore = defineStore('bookings', {
  state: () => ({ items: [], loaded: false, loading: false }),

  getters: {
    sorted: (s) => [...s.items].sort((a, b) => new Date(a.date) - new Date(b.date)),
    pending: (s) => s.items.filter((b) => b.status === 'requested').length,
    upcoming: (s) =>
      [...s.items]
        .filter(
          (b) =>
            new Date(b.date) >= new Date(new Date().toDateString()) && b.status !== 'cancelled',
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    forCustomer: (s) => (id) => s.items.filter((b) => b.customerId === id),
  },

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      this.loading = true
      try {
        this.items = (await api.bookings()).map(normalizeBooking)
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    async setStatus(id, status) {
      const updated = normalizeBooking(await api.setBookingStatus(id, status))
      const i = this.items.findIndex((b) => b.id === id)
      if (i >= 0) this.items[i] = updated
    },
  },
})
