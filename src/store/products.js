import { defineStore } from 'pinia'
import { api } from '@/lib/api'
import { withToast } from './toasts'

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
        const [items, categories] = await withToast(
          () => Promise.all([api.products(), api.categories()]),
          { error: 'Could not load products.' },
        )
        this.items = items
        this.categories = categories
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    async add(payload) {
      const created = await withToast(() => api.createProduct(payload), { success: 'Product added.' })
      this.items.unshift(created)
    },
    async update(id, payload) {
      const updated = await withToast(() => api.updateProduct(id, payload), { success: 'Product updated.' })
      const i = this.items.findIndex((p) => p.id === id)
      if (i >= 0) this.items[i] = updated
    },
    async remove(id) {
      await withToast(() => api.deleteProduct(id), { success: 'Product deleted.' })
      this.items = this.items.filter((p) => p.id !== id)
    },
    async setStock(id, value) {
      const { stock } = await withToast(() => api.setStock(id, Math.max(0, Number(value) || 0)), {
        error: 'Could not update stock.',
      })
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
