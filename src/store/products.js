import { defineStore } from 'pinia'
import { seedProducts } from '@/data/seed'
import { uid } from '@/utils'

const LOW_STOCK = 3

export const useProductsStore = defineStore('products', {
  state: () => ({ items: seedProducts }),

  getters: {
    count: (s) => s.items.length,
    shopItems: (s) => s.items.filter((p) => p.mode === 'shop'),
    byId: (s) => (id) => s.items.find((p) => p.id === id),
    lowStock: (s) =>
      s.items.filter((p) => p.mode === 'shop' && p.status === 'instock' && (p.stock ?? 0) <= LOW_STOCK),
  },

  actions: {
    add(product) {
      this.items.unshift({ id: uid('p'), tags: [], options: null, ...product })
    },
    update(id, patch) {
      const p = this.items.find((x) => x.id === id)
      if (p) Object.assign(p, patch)
    },
    remove(id) {
      this.items = this.items.filter((p) => p.id !== id)
    },
    adjustStock(id, delta) {
      const p = this.items.find((x) => x.id === id)
      if (p) p.stock = Math.max(0, (p.stock ?? 0) + delta)
    },
    setStock(id, value) {
      const p = this.items.find((x) => x.id === id)
      if (p) p.stock = Math.max(0, Number(value) || 0)
    },
  },
})

export { LOW_STOCK }
