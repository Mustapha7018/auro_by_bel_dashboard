import { defineStore } from 'pinia'

/**
 * Admin gate. MOCK for now — checks a demo credential locally and persists the
 * session. Replace `signIn()` with a real call (e.g. Supabase Auth + an admin
 * role check) when the backend lands; the gate and logout stay the same.
 */
export const DEMO = { email: 'bel@aurabybel.com', password: 'studio' }

export const useAuthStore = defineStore('auth', {
  state: () => ({ authed: false, user: null }),

  getters: {
    initials: (s) =>
      s.user ? s.user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() : '',
  },

  actions: {
    signIn(email, password) {
      if (email.trim().toLowerCase() === DEMO.email && password === DEMO.password) {
        this.authed = true
        this.user = { name: 'Bel', email: DEMO.email, role: 'Owner' }
        return true
      }
      return false
    },
    signOut() {
      this.authed = false
      this.user = null
    },
  },
})
