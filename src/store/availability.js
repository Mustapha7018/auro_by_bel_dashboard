import { defineStore } from 'pinia'
import { api } from '@/lib/api'

export const WEEKDAYS = [
  { i: 1, label: 'Mon' },
  { i: 2, label: 'Tue' },
  { i: 3, label: 'Wed' },
  { i: 4, label: 'Thu' },
  { i: 5, label: 'Fri' },
  { i: 6, label: 'Sat' },
  { i: 0, label: 'Sun' },
]

export const useAvailabilityStore = defineStore('availability', {
  state: () => ({
    workingDays: [2, 3, 4, 5, 6],
    openHour: 9,
    closeHour: 18,
    blockedDates: [],
    loaded: false,
    saving: false,
  }),

  actions: {
    async load() {
      if (this.loaded) return
      const a = await api.availability()
      this.workingDays = a.workingDays
      this.openHour = a.openHour
      this.closeHour = a.closeHour
      this.blockedDates = a.blockedDates
      this.loaded = true
    },

    async _save() {
      this.saving = true
      try {
        await api.saveAvailability({
          working_days: this.workingDays,
          open_hour: this.openHour,
          close_hour: this.closeHour,
          blocked_dates: this.blockedDates,
        })
      } finally {
        this.saving = false
      }
    },

    toggleDay(i) {
      const idx = this.workingDays.indexOf(i)
      if (idx >= 0) this.workingDays.splice(idx, 1)
      else this.workingDays.push(i)
      this._save()
    },
    setHours(open, close) {
      this.openHour = Number(open)
      this.closeHour = Number(close)
      this._save()
    },
    blockDate(iso) {
      if (iso && !this.blockedDates.includes(iso)) {
        this.blockedDates.push(iso)
        this._save()
      }
    },
    unblockDate(iso) {
      this.blockedDates = this.blockedDates.filter((d) => d !== iso)
      this._save()
    },
  },
})
