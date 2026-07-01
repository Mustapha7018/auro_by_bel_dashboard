<script setup>
import { computed, onMounted } from 'vue'
import { useOrdersStore, orderPaid } from '@/store/orders'
import { useBookingsStore } from '@/store/bookings'
import { useProductsStore } from '@/store/products'
import { useCustomersStore } from '@/store/customers'
import { money, dayMonth, shortDate } from '@/utils'

const orders = useOrdersStore()
const bookings = useBookingsStore()
const products = useProductsStore()
const customers = useCustomersStore()

onMounted(() => {
  orders.load()
  bookings.load()
  products.load()
  customers.load()
})

const stats = computed(() => [
  { label: 'Revenue collected', value: money(orders.revenue), sub: `${money(orders.outstanding)} outstanding`, accent: 'green' },
  { label: 'Orders processing', value: orders.processingCount, sub: `${orders.items.length} total`, accent: 'amber', to: '/orders' },
  { label: 'Upcoming bookings', value: bookings.upcoming.length, sub: `${bookings.pending} awaiting confirmation`, accent: 'rose', to: '/bookings' },
  { label: 'Low stock', value: products.lowStock.length, sub: `${products.shopItems.length} products`, accent: 'red', to: '/inventory' },
])

const recentOrders = computed(() => orders.sorted.slice(0, 5))
const nextBookings = computed(() => bookings.upcoming.slice(0, 5))
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Hi Bel 👋</h1>
        <p>
          Here's what's happening across the studio<template v-if="customers.count"> — {{ customers.count }} client{{ customers.count === 1 ? '' : 's' }} and counting</template>.
        </p>
      </div>
    </div>

    <div class="grid grid--stats" style="margin-bottom: 1.25rem">
      <component
        :is="s.to ? 'RouterLink' : 'div'"
        v-for="s in stats"
        :key="s.label"
        :to="s.to"
        class="stat card card--pad"
      >
        <span class="stat__dot" :class="`stat__dot--${s.accent}`"></span>
        <p class="stat__label">{{ s.label }}</p>
        <p class="stat__value">{{ s.value }}</p>
        <p class="stat__sub">{{ s.sub }}</p>
      </component>
    </div>

    <div class="grid grid--2">
      <div class="card card--pad">
        <p class="panel-title">Upcoming bookings</p>
        <ul class="list">
          <li v-for="b in nextBookings" :key="b.id">
            <div>
              <div class="cell-strong">{{ b.customerName }}</div>
              <div class="cell-muted" style="font-size: 0.76rem">{{ b.service }}</div>
            </div>
            <div style="text-align: right">
              <div>{{ dayMonth(b.date) }} · {{ b.time }}</div>
              <span class="pill" :class="b.status === 'confirmed' ? 'pill--green' : 'pill--amber'">{{ b.status }}</span>
            </div>
          </li>
          <li v-if="!nextBookings.length" class="cell-muted">No upcoming bookings.</li>
        </ul>
        <RouterLink to="/bookings" class="seeall">View all bookings →</RouterLink>
      </div>

      <div class="card card--pad">
        <p class="panel-title">Recent orders</p>
        <ul class="list">
          <li v-for="o in recentOrders" :key="o.id">
            <div>
              <div class="cell-strong">{{ o.customerName }}</div>
              <div class="cell-muted" style="font-size: 0.76rem">{{ shortDate(o.createdAt) }} · {{ o.items.length }} item(s)</div>
            </div>
            <div style="text-align: right">
              <div class="cell-strong">{{ money(orderPaid(o)) }}</div>
              <span class="pill" :class="{ 'pill--green': o.status==='delivered', 'pill--amber': o.status==='processing', 'pill--red': o.status==='cancelled' }">{{ o.status }}</span>
            </div>
          </li>
          <li v-if="!recentOrders.length" class="cell-muted">No orders yet.</li>
        </ul>
        <RouterLink to="/orders" class="seeall">View all orders →</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat {
  display: block;
  position: relative;
  transition: transform 0.15s var(--ease), box-shadow 0.15s var(--ease);
}
a.stat:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lift);
}
.stat__dot {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
}
.stat__dot--green { background: var(--green); }
.stat__dot--amber { background: var(--amber); }
.stat__dot--rose { background: var(--rose); }
.stat__dot--red { background: var(--red); }
.stat__label {
  font-size: 0.74rem;
  color: var(--ink-faint);
}
.stat__value {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0.3rem 0 0.15rem;
}
.stat__sub {
  font-size: 0.74rem;
  color: var(--ink-faint);
}

.list {
  display: flex;
  flex-direction: column;
}
.list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--line-soft);
  font-size: 0.85rem;
}
.list li:last-child {
  border-bottom: none;
}
.seeall {
  display: inline-block;
  margin-top: 0.8rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--gold-deep);
}
.seeall:hover {
  text-decoration: underline;
}
</style>
