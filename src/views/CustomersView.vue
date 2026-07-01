<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCustomersStore } from '@/store/customers'
import { normalizeBooking } from '@/store/bookings'
import { money, shortDate, dayMonth } from '@/utils'
import AppModal from '@/components/AppModal.vue'

const customers = useCustomersStore()

const detailOpen = ref(false)
const detail = ref(null) // { customer, orders, bookings }

onMounted(() => customers.load())

// server already returns orders/bookings counts + spent per customer
const rows = computed(() => [...customers.items].sort((a, b) => b.spent - a.spent))

const openDetail = async (c) => {
  detailOpen.value = true
  detail.value = null
  try {
    const d = await customers.detail(c.id)
    detail.value = { customer: d.customer, orders: d.orders, bookings: d.bookings.map(normalizeBooking) }
  } catch {
    detail.value = { customer: c, orders: [], bookings: [] }
  }
}

const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Customers</h1>
        <p>{{ customers.count }} clients</p>
      </div>
    </div>

    <div class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Contact</th>
            <th>Joined</th>
            <th>Orders</th>
            <th>Bookings</th>
            <th>Total spent</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in rows" :key="c.id" style="cursor: pointer" @click="openDetail(c)">
            <td>
              <div class="cell-product">
                <span class="cust-avatar">{{ initials(c.name) }}</span>
                <span class="cell-strong">{{ c.name }}</span>
              </div>
            </td>
            <td>
              <div>{{ c.email }}</div>
              <div class="cell-muted" style="font-size: 0.74rem">{{ c.phone }}</div>
            </td>
            <td>{{ shortDate(c.joined) }}</td>
            <td>{{ c.orders }}</td>
            <td>{{ c.bookings }}</td>
            <td class="cell-strong">{{ money(c.spent) }}</td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="6"><p class="empty">No customers yet — they'll appear here after their first order or booking.</p></td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal :open="detailOpen" :title="detail?.customer?.name || 'Customer'" @close="detailOpen = false">
      <template v-if="detail">
        <p class="cell-muted" style="margin-bottom: 1rem">{{ detail.customer.email }} · {{ detail.customer.phone }}</p>

        <p class="panel-title">Orders ({{ detail.orders.length }})</p>
        <ul class="mini">
          <li v-for="o in detail.orders" :key="o.id">
            <span>{{ shortDate(o.createdAt) }} · {{ o.items.length }} item(s)</span>
            <span><span class="pill" :class="{ 'pill--green': o.status==='delivered', 'pill--amber': o.status==='processing', 'pill--red': o.status==='cancelled' }">{{ o.status }}</span> {{ money(o.paid) }}</span>
          </li>
          <li v-if="!detail.orders.length" class="cell-muted">None yet.</li>
        </ul>

        <p class="panel-title" style="margin-top: 1.2rem">Appointments ({{ detail.bookings.length }})</p>
        <ul class="mini">
          <li v-for="b in detail.bookings" :key="b.id">
            <span>{{ b.service }} · {{ dayMonth(b.date) }} {{ b.time }}</span>
            <span class="pill" :class="{ 'pill--green': b.status==='confirmed'||b.status==='completed', 'pill--amber': b.status==='requested', 'pill--red': b.status==='cancelled' }">{{ b.status }}</span>
          </li>
          <li v-if="!detail.bookings.length" class="cell-muted">None yet.</li>
        </ul>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.cust-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: var(--rose-soft);
  color: var(--rose);
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex: 0 0 auto;
}
.mini {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.mini li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  font-size: 0.82rem;
}
</style>
