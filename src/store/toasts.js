import { defineStore } from 'pinia'

let uid = 0

export const useToastsStore = defineStore('toasts', {
  state: () => ({ items: [] }),
  actions: {
    push(message, type = 'info', timeout = 3500) {
      const id = ++uid
      this.items.push({ id, message, type })
      if (timeout) setTimeout(() => this.remove(id), timeout)
      return id
    },
    success(m) {
      return this.push(m, 'success')
    },
    error(m) {
      return this.push(m, 'error', 5000)
    },
    info(m) {
      return this.push(m, 'info')
    },
    remove(id) {
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})

/**
 * Run an async action with automatic toasts: a success toast (if a message is
 * given) and an error toast on failure. Re-throws so callers can still branch.
 */
export async function withToast(fn, { success, error } = {}) {
  const toasts = useToastsStore()
  try {
    const result = await fn()
    if (success) toasts.success(success)
    return result
  } catch (e) {
    toasts.error(error || e.message || 'Something went wrong.')
    throw e
  }
}
