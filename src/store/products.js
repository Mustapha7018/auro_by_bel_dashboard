import { defineStore } from 'pinia'
import { api } from '@/lib/api'

const LOW_STOCK = 3

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    categories: [],
    loaded: false,
    loading: false,
  }),

  getters: {
    count: (s) => s.items.length,
    shopItems: (s) => s.items.filter((p) => p.mode === 'shop'),
    byId: (s) => (id) => s.items.find((p) => p.id === id),
    lowStock: (s) =>
      s.items.filter(
        (p) => p.mode === 'shop' && p.status === 'instock' && (p.stock ?? 0) <= LOW_STOCK,
      ),
  },

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      this.loading = true
      try {
        const [items, categories] = await Promise.all([api.products(), api.categories()])
        this.items = items
        this.categories = categories
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    async add(payload) {
      const created = await api.createProduct(payload)
      this.items.unshift(created)
    },
    async update(id, payload) {
      const updated = await api.updateProduct(id, payload)
      const i = this.items.findIndex((p) => p.id === id)
      if (i >= 0) this.items[i] = updated
    },
    async remove(id) {
      await api.deleteProduct(id)
      this.items = this.items.filter((p) => p.id !== id)
    },
    async setStock(id, value) {
      const { stock } = await api.setStock(id, Math.max(0, Number(value) || 0))
      const p = this.items.find((x) => x.id === id)
      if (p) p.stock = stock
    },
    async adjustStock(id, delta) {
      const p = this.items.find((x) => x.id === id)
      if (p) await this.setStock(id, Math.max(0, (p.stock ?? 0) + delta))
    },
  },
})

export { LOW_STOCK }
