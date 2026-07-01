<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/lib/api'
import { money } from '@/utils'
import LineChart from '@/components/LineChart.vue'
import BarChart from '@/components/BarChart.vue'

const data = ref(null)

onMounted(async () => {
  try {
    data.value = await api.analytics()
  } catch {
    data.value = { revenue: [], customers: [], bookings: [], topItems: [], topCustomers: [] }
  }
})

const metric = ref('revenue')
const metrics = [
  { id: 'revenue', label: 'Revenue' },
  { id: 'customers', label: 'New customers' },
  { id: 'bookings', label: 'Bookings' },
]

const lineData = computed(() => (data.value ? data.value[metric.value] || [] : []))
const topItems = computed(() => (data.value ? data.value.topItems : []))
const topCustomers = computed(() => (data.value ? data.value.topCustomers : []))
const lineFormat = computed(() => (metric.value === 'revenue' ? money : (v) => v))
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
