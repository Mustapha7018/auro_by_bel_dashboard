import { defineStore } from 'pinia'
import { seedBookings } from '@/data/seed'

export const BOOKING_STATUSES = ['requested', 'confirmed', 'completed', 'cancelled']

export const useBookingsStore = defineStore('bookings', {
  state: () => ({ items: seedBookings }),

  getters: {
    sorted: (s) => [...s.items].sort((a, b) => new Date(a.date) - new Date(b.date)),
    pending: (s) => s.items.filter((b) => b.status === 'requested').length,
    upcoming: (s) =>
      [...s.items]
        .filter((b) => new Date(b.date) >= new Date(new Date().toDateString()) && b.status !== 'cancelled')
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    forCustomer: (s) => (id) => s.items.filter((b) => b.customerId === id),
  },

  actions: {
    setStatus(id, status) {
      const b = this.items.find((x) => x.id === id)
      if (b) b.status = status
    },
    remove(id) {
      this.items = this.items.filter((b) => b.id !== id)
    },
  },
})
