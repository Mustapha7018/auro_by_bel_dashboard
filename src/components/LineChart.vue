<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] }, // [{ label, value }]
  color: { type: String, default: 'var(--gold-deep)' },
  format: { type: Function, default: (v) => v },
})

const W = 640
const H = 240
const P = { l: 10, r: 12, t: 16, b: 26 }
const plotW = W - P.l - P.r
const plotH = H - P.t - P.b

const max = computed(() => Math.max(1, ...props.data.map((d) => d.value)))

const pts = computed(() => {
  const n = props.data.length
  return props.data.map((d, i) => {
    const x = n <= 1 ? P.l + plotW / 2 : P.l + (i / (n - 1)) * plotW
    const y = P.t + plotH - (d.value / max.value) * plotH
    return { ...d, x, y }
  })
})

const linePath = computed(() => pts.value.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '))
const areaPath = computed(() => {
  if (!pts.value.length) return ''
  const base = P.t + plotH
  const first = pts.value[0]
  const last = pts.value[pts.value.length - 1]
  return `${linePath.value} L${last.x.toFixed(1)} ${base} L${first.x.toFixed(1)} ${base} Z`
})

const gridY = computed(() => [0, 0.5, 1].map((f) => P.t + plotH - f * plotH))
</script>

<template>
  <svg class="lc" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" role="img">
    <defs>
      <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="currentColor" stop-opacity="0.18" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
    </defs>

    <g :style="{ color }">
      <line v-for="(y, i) in gridY" :key="i" :x1="P.l" :x2="W - P.r" :y1="y" :y2="y" class="lc__grid" />
      <path v-if="areaPath" :d="areaPath" fill="url(#lc-fill)" />
      <path v-if="linePath" :d="linePath" class="lc__line" />
      <g v-for="(p, i) in pts" :key="i">
        <circle :cx="p.x" :cy="p.y" r="3.2" class="lc__dot" />
        <title>{{ p.label }}: {{ format(p.value) }}</title>
      </g>
    </g>

    <text v-for="(p, i) in pts" :key="'t' + i" :x="p.x" :y="H - 8" text-anchor="middle" class="lc__label">
      {{ p.label }}
    </text>
  </svg>
</template>

<style scoped>
.lc {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.lc__grid {
  stroke: var(--line);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.lc__line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.lc__dot {
  fill: var(--paper);
  stroke: currentColor;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}
.lc__label {
  fill: var(--ink-faint);
  font-size: 11px;
  font-family: var(--font);
}
</style>
