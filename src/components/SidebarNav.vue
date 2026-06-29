<script setup>
import { useBookingsStore } from '@/store/bookings'
import { useOrdersStore } from '@/store/orders'
import { useProductsStore } from '@/store/products'
import { useAuthStore } from '@/store/auth'
import AppIcon from './AppIcon.vue'

const bookings = useBookingsStore()
const orders = useOrdersStore()
const products = useProductsStore()
const auth = useAuthStore()

const links = [
  { to: '/', icon: 'overview', label: 'Overview' },
  { to: '/products', icon: 'products', label: 'Products' },
  { to: '/bookings', icon: 'bookings', label: 'Bookings' },
  { to: '/availability', icon: 'availability', label: 'Availability' },
  { to: '/inventory', icon: 'inventory', label: 'Inventory' },
  { to: '/orders', icon: 'orders', label: 'Orders' },
  { to: '/customers', icon: 'customers', label: 'Customers' },
  { to: '/analytics', icon: 'analytics', label: 'Analytics' },
]

const badge = (to) => {
  if (to === '/bookings') return bookings.pending || 0
  if (to === '/orders') return orders.processingCount || 0
  if (to === '/inventory') return products.lowStock.length || 0
  return 0
}
</script>

<template>
  <aside class="side">
    <div class="side__brand">
      <span class="side__logo">A</span>
      <div>
        <p class="side__name">Aura <em>by</em> Bel</p>
        <p class="side__sub">Studio dashboard</p>
      </div>
    </div>

    <nav class="side__nav">
      <RouterLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="side__link"
        active-class="is-active"
        exact-active-class="is-active"
      >
        <AppIcon :name="l.icon" />
        <span class="side__txt">{{ l.label }}</span>
        <span v-if="badge(l.to)" class="side__badge">{{ badge(l.to) }}</span>
      </RouterLink>
    </nav>

    <div class="side__foot">
      <span class="side__avatar">{{ auth.initials || 'B' }}</span>
      <div class="side__who">
        <p class="side__me">{{ auth.user?.name || 'Bel' }}</p>
        <p class="side__role">{{ auth.user?.role || 'Owner' }}</p>
      </div>
      <button class="side__logout" type="button" title="Sign out" aria-label="Sign out" @click="auth.signOut()">
        <AppIcon name="logout" :size="17" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
.side {
  width: var(--sidebar-w);
  height: 100dvh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--paper);
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  padding: 1.1rem 0.9rem;
}

.side__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.3rem 0.4rem 1.1rem;
  border-bottom: 1px solid var(--line-soft);
}
.side__logo {
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--accent), var(--gold));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}
.side__name {
  font-weight: 600;
  font-size: 0.92rem;
}
.side__name em {
  font-style: italic;
  font-weight: 400;
  color: var(--ink-faint);
}
.side__sub {
  font-size: 0.66rem;
  color: var(--ink-faint);
  letter-spacing: 0.04em;
}

.side__nav {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.9rem;
  flex: 1;
}
.side__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.7rem;
  border-radius: var(--radius-sm);
  font-size: 0.86rem;
  font-weight: 500;
  color: var(--ink-soft);
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
}
.side__link:hover {
  background: var(--paper-warm);
  color: var(--ink);
}
.side__link.is-active {
  background: var(--accent);
  color: #fff;
}
.side__txt {
  flex: 1;
}
.side__badge {
  min-width: 1.3rem;
  height: 1.3rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 0.66rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}
.side__link.is-active .side__badge {
  background: #fff;
  color: var(--accent);
}

.side__foot {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 0.5rem 0.2rem;
  border-top: 1px solid var(--line-soft);
}
.side__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--gold));
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.8rem;
}
.side__who {
  flex: 1;
  min-width: 0;
}
.side__me {
  font-weight: 600;
  font-size: 0.82rem;
}
.side__role {
  font-size: 0.68rem;
  color: var(--ink-faint);
}
.side__logout {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  color: var(--ink-faint);
  display: grid;
  place-items: center;
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
}
.side__logout:hover {
  background: var(--red-soft);
  color: var(--red);
}

@media (max-width: 800px) {
  .side {
    position: sticky;
    width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
    padding: 0.6rem 0.8rem;
  }
  .side__brand,
  .side__foot {
    border: none;
    padding: 0;
    flex: 0 0 auto;
  }
  .side__sub,
  .side__foot > div {
    display: none;
  }
  .side__nav {
    flex-direction: row;
    margin: 0 0 0 0.6rem;
    gap: 0.25rem;
  }
  .side__txt,
  .side__badge {
    display: none;
  }
}
</style>
