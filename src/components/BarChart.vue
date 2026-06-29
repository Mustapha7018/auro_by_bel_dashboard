<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] }, // [{ label, value }]
  color: { type: String, default: 'var(--gold)' },
  format: { type: Function, default: (v) => v },
})

const max = computed(() => Math.max(1, ...props.data.map((d) => d.value)))
const pct = (v) => `${Math.max(2, (v / max.value) * 100)}%`
</script>

<template>
  <div class="bc">
    <div v-for="(d, i) in data" :key="i" class="bc__row">
      <span class="bc__label" :title="d.label">{{ d.label }}</span>
      <span class="bc__track">
        <span class="bc__fill" :style="{ width: pct(d.value), background: color }"></span>
      </span>
      <span class="bc__value">{{ format(d.value) }}</span>
    </div>
    <p v-if="!data.length" class="empty" style="padding: 1.5rem 0">No data yet.</p>
  </div>
</template>

<style scoped>
.bc {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.bc__row {
  display: grid;
  grid-template-columns: 9rem 1fr auto;
  align-items: center;
  gap: 0.7rem;
}
.bc__label {
  font-size: 0.8rem;
  color: var(--ink-soft);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bc__track {
  height: 0.7rem;
  background: var(--line-soft);
  border-radius: 999px;
  overflow: hidden;
}
.bc__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s var(--ease);
}
.bc__value {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}
@media (max-width: 540px) {
  .bc__row {
    grid-template-columns: 6rem 1fr auto;
  }
}
</style>
