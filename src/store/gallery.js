import { defineStore } from 'pinia'
import { api } from '@/lib/api'
import { withToast } from './toasts'

export const useGalleryStore = defineStore('gallery', {
  state: () => ({
    items: [],
    loaded: false,
    loading: false,
  }),

  getters: {
    count: (s) => s.items.length,
  },

  actions: {
    async load() {
      if (this.loaded || this.loading) return
      this.loading = true
      try {
        this.items = await withToast(() => api.gallery(), { error: 'Could not load the gallery.' })
        this.loaded = true
      } finally {
        this.loading = false
      }
    },
    async add(file) {
      const created = await withToast(() => api.addGalleryItem(file), { success: 'Added to gallery.' })
      this.items.unshift(created)
    },
    async remove(id) {
      await withToast(() => api.deleteGalleryItem(id), { success: 'Removed from gallery.' })
      this.items = this.items.filter((g) => g.id !== id)
    },
  },
})
