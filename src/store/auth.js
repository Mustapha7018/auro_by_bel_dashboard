import { defineStore } from 'pinia'
import { api, getToken, setToken } from '@/lib/api'

/**
 * Admin gate — real auth against the backend. Only users with role `admin`
 * are allowed into the dashboard.
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    authed: false,
    user: null,
    token: getToken(),
    busy: false,
    error: '',
    ready: false, // finished restoring any existing session
  }),

  getters: {
    initials: (s) =>
      s.user ? s.user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() : '',
  },

  actions: {
    async init() {
      if (this.token) {
        try {
          const user = await api.me()
          if (user.role === 'admin') {
            this.user = user
            this.authed = true
          } else {
            this.signOut()
          }
        } catch {
          this.signOut()
        }
      }
      this.ready = true
    },

    async signIn(email, password) {
      this.busy = true
      this.error = ''
      try {
        const { access_token, user } = await api.login({ email, password })
        if (user.role !== 'admin') {
          this.error = 'This account is not an administrator.'
          return false
        }
        setToken(access_token)
        this.token = access_token
        this.user = user
        this.authed = true
        return true
      } catch (e) {
        this.error = e.message || 'Could not sign in.'
        return false
      } finally {
        this.busy = false
      }
    },

    signOut() {
      setToken(null)
      this.token = null
      this.user = null
      this.authed = false
    },
  },
})
