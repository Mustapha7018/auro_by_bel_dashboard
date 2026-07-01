<script setup>
import { useToastsStore } from '@/store/toasts'

const toasts = useToastsStore()

const icon = (t) => ({ success: '✓', error: '!', info: 'i' })[t] || 'i'
</script>

<template>
  <teleport to="body">
    <div class="toasts" aria-live="polite">
      <transition-group name="toast">
        <div
          v-for="t in toasts.items"
          :key="t.id"
          class="toast"
          :class="`toast--${t.type}`"
          role="status"
          @click="toasts.remove(t.id)"
        >
          <span class="toast__icon">{{ icon(t.type) }}</span>
          <span class="toast__msg">{{ t.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<style scoped>
.toasts {
  position: fixed;
  right: 1.1rem;
  bottom: 1.1rem;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  max-width: min(24rem, 92vw);
}
.toast {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--paper);
  border: 1px solid var(--line);
  border-left: 3px solid var(--ink-faint);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lift);
  padding: 0.7rem 0.85rem;
  font-size: 0.85rem;
  cursor: pointer;
}
.toast__icon {
  width: 1.3rem;
  height: 1.3rem;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fff;
  background: var(--ink-faint);
}
.toast--success {
  border-left-color: var(--green);
}
.toast--success .toast__icon {
  background: var(--green);
}
.toast--error {
  border-left-color: var(--red);
}
.toast--error .toast__icon {
  background: var(--red);
}
.toast--info {
  border-left-color: var(--accent);
}
.toast--info .toast__icon {
  background: var(--accent);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s var(--ease), transform 0.25s var(--ease);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>
