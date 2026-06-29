import { defineStore } from 'pinia'
import { seedCustomers } from '@/data/seed'

export const useCustomersStore = defineStore('customers', {
  state: () => ({ items: seedCustomers }),
  getters: {
    byId: (s) => (id) => s.items.find((c) => c.id === id),
    count: (s) => s.items.length,
  },
})
