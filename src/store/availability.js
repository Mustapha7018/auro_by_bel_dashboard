import { defineStore } from 'pinia'
import { seedAvailability } from '@/data/seed'

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
  state: () => ({ ...seedAvailability }),

  actions: {
    toggleDay(i) {
      const idx = this.workingDays.indexOf(i)
      if (idx >= 0) this.workingDays.splice(idx, 1)
      else this.workingDays.push(i)
    },
    setHours(open, close) {
      this.openHour = Number(open)
      this.closeHour = Number(close)
    },
    blockDate(iso) {
      if (iso && !this.blockedDates.includes(iso)) this.blockedDates.push(iso)
    },
    unblockDate(iso) {
      this.blockedDates = this.blockedDates.filter((d) => d !== iso)
    },
  },
})
