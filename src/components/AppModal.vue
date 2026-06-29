<script setup>
import { watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  wide: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

watch(
  () => props.open,
  (o) => {
    document.body.style.overflow = o ? 'hidden' : ''
  },
)

const onKey = (e) => {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="open" class="scrim" @click="emit('close')" @keydown="onKey"></div>
    </transition>
    <transition name="pop">
      <div v-if="open" class="modal" :class="{ 'modal--wide': wide }" role="dialog" aria-modal="true" @keydown="onKey">
        <header class="modal__head">
          <h3>{{ title }}</h3>
          <button class="modal__x" type="button" aria-label="Close" @click="emit('close')">✕</button>
        </header>
        <div class="modal__body">
          <slot />
        </div>
        <footer v-if="$slots.footer" class="modal__foot">
          <slot name="footer" />
        </footer>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(20, 17, 15, 0.4);
  backdrop-filter: blur(2px);
}
.modal {
  position: fixed;
  z-index: 51;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(34rem, 94vw);
  max-height: 92dvh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lift);
}
.modal--wide {
  width: min(46rem, 94vw);
}
.modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--line);
}
.modal__head h3 {
  font-size: 1.05rem;
}
.modal__x {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  color: var(--ink-soft);
}
.modal__x:hover {
  background: var(--paper-warm);
}
.modal__body {
  padding: 1.25rem;
  overflow-y: auto;
}
.modal__foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding: 0.9rem 1.25rem;
  border-top: 1px solid var(--line);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.18s var(--ease), transform 0.18s var(--ease);
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translate(-50%, -48%) scale(0.97);
}
</style>
