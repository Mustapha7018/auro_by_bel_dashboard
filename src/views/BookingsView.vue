<script setup>
import { ref, computed } from 'vue'
import { useBookingsStore, BOOKING_STATUSES } from '@/store/bookings'
import { money, dayMonth } from '@/utils'

const bookings = useBookingsStore()
const filter = ref('all')

const pillClass = (s) =>
  ({ requested: 'pill--amber', confirmed: 'pill--green', completed: 'pill--grey', cancelled: 'pill--red' })[s]

const filtered = computed(() =>
  filter.value === 'all'
    ? bookings.sorted
    : bookings.sorted.filter((b) => b.status === filter.value),
)
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Bookings</h1>
        <p>{{ bookings.pending }} awaiting your confirmation</p>
      </div>
    </div>

    <div class="toolbar">
      <div class="seg">
        <button :class="{ 'is-active': filter === 'all' }" @click="filter = 'all'">All</button>
        <button v-for="s in BOOKING_STATUSES" :key="s" :class="{ 'is-active': filter === s }" @click="filter = s" style="text-transform: capitalize">
          {{ s }}
        </button>
      </div>
    </div>

    <div class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Service</th>
            <th>When</th>
            <th>Deposit</th>
            <th>Status</th>
            <th>Set status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in filtered" :key="b.id">
            <td class="cell-strong">{{ b.customerName }}</td>
            <td>{{ b.service }}</td>
            <td>{{ dayMonth(b.date) }} · {{ b.time }}</td>
            <td>{{ money(b.deposit) }}</td>
            <td><span class="pill" :class="pillClass(b.status)">{{ b.status }}</span></td>
            <td>
              <select class="select" style="max-width: 11rem" :value="b.status" @change="bookings.setStatus(b.id, $event.target.value)">
                <option v-for="s in BOOKING_STATUSES" :key="s" :value="s" style="text-transform: capitalize">{{ s }}</option>
              </select>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="6"><p class="empty">No bookings here.</p></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
