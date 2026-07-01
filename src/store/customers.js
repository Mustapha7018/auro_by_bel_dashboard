import { defineStore } from 'pinia'
import { api } from '@/lib/api'

export const useCustomersStore = defineStore('customers', {
  state: () => ({ items: [], loaded: false, loading: false }),

  getters: {
    count: (s) => s.items.length,
    byId: (s) => (id) => s.items.find((c) => c.id === id),
  },

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      this.loading = true
      try {
        this.items = await api.customers()
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    detail(id) {
      return api.customer(id)
    },
  },
})
