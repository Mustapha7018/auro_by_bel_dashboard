<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore, orderPaid } from '@/store/orders'
import { useBookingsStore } from '@/store/bookings'
import { useCustomersStore } from '@/store/customers'
import { money } from '@/utils'
import LineChart from '@/components/LineChart.vue'
import BarChart from '@/components/BarChart.vue'

const orders = useOrdersStore()
const bookings = useBookingsStore()
const customers = useCustomersStore()

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const keyOf = (d) => `${d.getFullYear()}-${d.getMonth()}`

// last 6 month buckets, oldest → newest
const months = computed(() => {
  const out = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push({ key: keyOf(d), label: MONTHS[d.getMonth()] })
  }
  return out
})

const metric = ref('revenue')
const metrics = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'customers', label: 'New customers' },
  { id: 'bookings', label: 'Bookings' },
]

const bucket = (key, items, dateField, valueFn) =>
  items
    .filter((it) => keyOf(new Date(it[dateField])) === key)
    .reduce((s, it) => s + valueFn(it), 0)

const lineData = computed(() =>
  months.value.map((m) => {
    let value = 0
    if (metric.value === 'revenue') {
      // sum each payment that landed in the month
      value = orders.items
        .filter((o) => o.status !== 'cancelled')
        .flatMap((o) => o.payments || [])
        .filter((p) => keyOf(new Date(p.ts)) === m.key)
        .reduce((s, p) => s + p.amount, 0)
    } else if (metric.value === 'customers') {
      value = bucket(m.key, customers.items, 'joined', () => 1)
    } else {
      value = bucket(m.key, bookings.items, 'date', () => 1)
    }
    return { label: m.label, value }
  }),
)

const lineFormat = computed(() => (metric.value === 'revenue' ? money : (v) => v))

// most ordered items (by quantity, non-cancelled)
const topItems = computed(() => {
  const tally = {}
  orders.items
    .filter((o) => o.status !== 'cancelled')
    .forEach((o) => o.items.forEach((it) => { tally[it.name] = (tally[it.name] || 0) + it.qty }))
  return Object.entries(tally)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
})

// top customers by amount paid
const topCustomers = computed(() =>
  customers.items
    .map((c) => ({
      label: c.name,
      value: orders.forCustomer(c.id).filter((o) => o.status !== 'cancelled').reduce((s, o) => s + orderPaid(o), 0),
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5),
)

const lineTotal = computed(() => lineData.value.reduce((s, d) => s + d.value, 0))
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Analytics</h1>
        <p>Last 6 months across the studio.</p>
      </div>
    </div>

    <div class="card card--pad" style="margin-bottom: 1.25rem">
      <div class="toolbar">
        <p class="panel-title" style="margin: 0">
          {{ metrics.find((m) => m.id === metric).label }} ·
          <strong style="color: var(--ink)">{{ metric === 'revenue' ? money(lineTotal) : lineTotal }}</strong>
          total
        </p>
        <span class="spacer"></span>
        <div class="seg">
          <button v-for="m in metrics" :key="m.id" :class="{ 'is-active': metric === m.id }" @click="metric = m.id">{{ m.label }}</button>
        </div>
      </div>
      <LineChart
        :data="lineData"
        :format="lineFormat"
        :color="metric === 'revenue' ? 'var(--accent)' : metric === 'customers' ? 'var(--gold-deep)' : 'var(--green)'"
      />
    </div>

    <div class="grid grid--2">
      <div class="card card--pad">
        <p class="panel-title">Most ordered items</p>
        <BarChart :data="topItems" color="var(--gold)" />
      </div>
      <div class="card card--pad">
        <p class="panel-title">Top customers by spend</p>
        <BarChart :data="topCustomers" color="var(--rose)" :format="money" />
      </div>
    </div>
  </div>
</template>
