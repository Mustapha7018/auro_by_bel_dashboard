<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  type: { type: String, default: '' },
  image: { type: String, default: '' },
})

const failed = ref(false)

const initials = computed(() =>
  props.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)

const tint = computed(() => {
  const map = {
    Wig: 'var(--amber-soft)', Bundle: 'var(--amber-soft)',
    Nails: 'var(--rose-soft)', Lashes: 'var(--rose-soft)',
    Brows: 'var(--green-soft)', Pedicure: 'var(--green-soft)',
    Piercing: 'var(--line-soft)',
  }
  return map[props.type] || 'var(--line-soft)'
})
</script>

<template>
  <img v-if="image && !failed" class="thumb" :src="image" :alt="name" @error="failed = true" />
  <span v-else class="thumb thumb--initials" :style="{ background: tint }">{{ initials }}</span>
</template>

<style scoped>
.thumb--initials {
  display: grid;
  place-items: center;
  font-size: 0.66rem;
  font-weight: 700;
  color: var(--ink-soft);
}
</style>
