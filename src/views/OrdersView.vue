<script setup>
import { ref, computed, reactive } from 'vue'
import {
  useOrdersStore, ORDER_STATUSES, PAYMENT_METHODS,
  orderPaid, orderBalance,
} from '@/store/orders'
import { money, shortDate } from '@/utils'
import AppModal from '@/components/AppModal.vue'

const orders = useOrdersStore()
const filter = ref('all')

const pillClass = (s) => ({ processing: 'pill--amber', delivered: 'pill--green', cancelled: 'pill--red' })[s]
const filtered = computed(() =>
  filter.value === 'all' ? orders.sorted : orders.sorted.filter((o) => o.status === filter.value),
)
const summary = (o) => o.items.map((i) => `${i.qty}× ${i.name}${i.length ? ` (${i.length})` : ''}`).join(', ')

// payment manager
const payOpen = ref(false)
const activeId = ref(null)
const form = reactive({ amount: null, method: 'Mobile Money', note: '' })

const active = computed(() => orders.items.find((o) => o.id === activeId.value) || null)

const openPay = (o) => {
  activeId.value = o.id
  form.amount = orderBalance(o) || null
  form.method = 'Mobile Money'
  form.note = ''
  payOpen.value = true
}
const submitPayment = () => {
  orders.addPayment(activeId.value, { ...form })
  form.amount = orderBalance(active.value) || null
  form.note = ''
}
const payTime = (ts) => new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Orders</h1>
        <p>
          {{ money(orders.revenue) }} collected · {{ money(orders.outstanding) }} outstanding ·
          {{ orders.unpaidCount }} with a balance
        </p>
      </div>
    </div>

    <div class="toolbar">
      <div class="seg">
        <button :class="{ 'is-active': filter === 'all' }" @click="filter = 'all'">All</button>
        <button v-for="s in ORDER_STATUSES" :key="s" :class="{ 'is-active': filter === s }" @click="filter = s" style="text-transform: capitalize">{{ s }}</button>
      </div>
    </div>

    <div class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Client</th>
            <th>Items</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in filtered" :key="o.id">
            <td>
              <div class="cell-strong">#{{ o.id.replace(/^o/, '').toUpperCase() }}</div>
              <div class="cell-muted" style="font-size: 0.74rem">{{ shortDate(o.createdAt) }}</div>
            </td>
            <td>{{ o.customerName }}</td>
            <td style="max-width: 16rem">{{ summary(o) }}</td>
            <td>{{ money(o.total) }}</td>
            <td class="cell-strong">{{ money(orderPaid(o)) }}</td>
            <td>
              <span v-if="orderBalance(o) > 0" class="price-sale cell-strong">{{ money(orderBalance(o)) }}</span>
              <span v-else class="pill pill--green">Paid</span>
            </td>
            <td><span class="pill" :class="pillClass(o.status)">{{ o.status }}</span></td>
            <td>
              <div class="row-actions">
                <button class="btn btn--sm" @click="openPay(o)">Payments</button>
                <button v-if="o.status === 'processing'" class="btn btn--sm btn--primary" @click="orders.setStatus(o.id, 'delivered')">Delivered</button>
                <button v-if="o.status !== 'cancelled'" class="btn btn--sm btn--danger" @click="orders.setStatus(o.id, 'cancelled')">Cancel</button>
                <button v-if="o.status === 'cancelled'" class="btn btn--sm" @click="orders.setStatus(o.id, 'processing')">Reopen</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="8"><p class="empty">No orders here.</p></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payment manager -->
    <AppModal :open="payOpen" :title="active ? `Payments · #${active.id.replace(/^o/, '').toUpperCase()}` : ''" @close="payOpen = false">
      <template v-if="active">
        <div class="paysum">
          <div><span>Total</span><strong>{{ money(active.total) }}</strong></div>
          <div><span>Paid</span><strong>{{ money(orderPaid(active)) }}</strong></div>
          <div><span>Balance</span><strong :class="{ 'price-sale': orderBalance(active) > 0 }">{{ money(orderBalance(active)) }}</strong></div>
        </div>

        <p class="panel-title" style="margin-top: 1.2rem">Record a payment</p>
        <form @submit.prevent="submitPayment">
          <div class="field-row">
            <div class="field">
              <label>Amount (₵)</label>
              <input v-model="form.amount" type="number" min="1" class="input" required placeholder="0" />
            </div>
            <div class="field">
              <label>Method</label>
              <select v-model="form.method" class="select">
                <option v-for="m in PAYMENT_METHODS" :key="m" :value="m">{{ m }}</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Note (optional)</label>
            <input v-model="form.note" class="input" placeholder="e.g. balance on collection" />
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 0.6rem">
            <button type="submit" class="btn btn--primary" :disabled="orderBalance(active) === 0">
              {{ orderBalance(active) === 0 ? 'Fully paid' : 'Add payment' }}
            </button>
          </div>
        </form>

        <p class="panel-title" style="margin-top: 1.3rem">History</p>
        <ul class="paylist">
          <li v-for="p in active.payments" :key="p.id">
            <div>
              <span class="cell-strong">{{ money(p.amount) }}</span>
              <span class="cell-muted"> · {{ p.method }}</span>
              <div v-if="p.note" class="cell-muted" style="font-size: 0.74rem">{{ p.note }}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem">
              <span class="cell-muted" style="font-size: 0.76rem">{{ payTime(p.ts) }}</span>
              <button class="btn btn--icon btn--danger" title="Remove" @click="orders.removePayment(active.id, p.id)">✕</button>
            </div>
          </li>
          <li v-if="!active.payments.length" class="cell-muted">No payments recorded yet.</li>
        </ul>
      </template>
    </AppModal>
  </div>
</template>

<style scoped>
.paysum {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.7rem;
}
.paysum > div {
  background: var(--paper-warm);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  padding: 0.7rem 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.paysum span {
  font-size: 0.7rem;
  color: var(--ink-faint);
}
.paysum strong {
  font-size: 1.1rem;
}
.paylist {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.paylist li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
}
</style>
