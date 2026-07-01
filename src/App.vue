<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SidebarNav from '@/components/SidebarNav.vue'
import LoginView from '@/components/LoginView.vue'
import ToastHost from '@/components/ToastHost.vue'
import ConfirmHost from '@/components/ConfirmHost.vue'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const route = useRoute()
const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const title = computed(() => route.meta.title || 'Dashboard')

onMounted(() => auth.init())
</script>

<template>
  <div v-if="!auth.ready" class="boot">
    <div class="boot__inner">
      <p class="boot__mark">Aura <span>by</span> Bel</p>
      <p class="boot__msg">Loading the studio…</p>
    </div>
  </div>

  <LoginView v-else-if="!auth.authed" />

  <div v-else class="app">
    <SidebarNav />
    <div class="app__main">
      <header class="topbar">
        <h2>{{ title }}</h2>
        <span class="topbar__date">{{ today }}</span>
      </header>
      <RouterView />
    </div>
  </div>

  <ToastHost />
  <ConfirmHost />
</template>

<style scoped>
.boot {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
}
.boot__inner {
  text-align: center;
}
.boot__mark {
  font-size: 1.5rem;
  font-weight: 600;
}
.boot__mark span {
  font-style: italic;
  font-weight: 400;
  color: var(--ink-faint);
}
.boot__msg {
  margin-top: 0.7rem;
  color: var(--ink-faint);
  font-size: 0.9rem;
  animation: pulse 1.4s var(--ease) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
.app__main {
  margin-left: var(--sidebar-w);
  min-height: 100dvh;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem clamp(1.25rem, 3vw, 2.25rem);
  background: rgba(244, 242, 239, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.topbar h2 {
  font-size: 1rem;
}
.topbar__date {
  font-size: 0.78rem;
  color: var(--ink-faint);
}

@media (max-width: 800px) {
  .app__main {
    margin-left: 0;
  }
}
</style>
