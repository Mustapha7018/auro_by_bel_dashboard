<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SidebarNav from '@/components/SidebarNav.vue'
import LoginView from '@/components/LoginView.vue'
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
  <div v-if="!auth.ready" class="loading">Loading…</div>

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
</template>

<style scoped>
.loading {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  color: var(--ink-faint);
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
