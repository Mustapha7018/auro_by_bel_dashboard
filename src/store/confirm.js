import { defineStore } from 'pinia'

/**
 * Promise-based confirmation dialog. Call `ask()` and await the boolean:
 *   if (await confirm.ask({ title, message, confirmLabel, danger })) { ... }
 */
export const useConfirmStore = defineStore('confirm', {
  state: () => ({
    open: false,
    title: 'Are you sure?',
    message: '',
    confirmLabel: 'Confirm',
    danger: false,
    _resolve: null,
  }),
  actions: {
    ask({ title = 'Are you sure?', message = '', confirmLabel = 'Confirm', danger = false } = {}) {
      this.title = title
      this.message = message
      this.confirmLabel = confirmLabel
      this.danger = danger
      this.open = true
      return new Promise((resolve) => {
        this._resolve = resolve
      })
    },
    _finish(value) {
      this.open = false
      const resolve = this._resolve
      this._resolve = null
      if (resolve) resolve(value)
    },
    confirm() {
      this._finish(true)
    },
    cancel() {
      this._finish(false)
    },
  },
})
