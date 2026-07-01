<script setup>
import { ref, onMounted } from 'vue'
import { useAvailabilityStore, WEEKDAYS } from '@/store/availability'
import { shortDate } from '@/utils'

const av = useAvailabilityStore()
const newDate = ref('')

onMounted(() => av.load())

const hours = Array.from({ length: 24 }, (_, h) => h)
const fmtHour = (h) => `${String(h).padStart(2, '0')}:00`

const addBlock = () => {
  if (newDate.value) {
    av.blockDate(newDate.value) // already YYYY-MM-DD from <input type="date">
    newDate.value = ''
  }
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Availability</h1>
        <p>Set the days and hours clients can book, and block off specific dates.</p>
      </div>
    </div>

    <div class="grid grid--2">
      <div class="card card--pad">
        <p class="panel-title">Working days</p>
        <div class="days">
          <button
            v-for="d in WEEKDAYS"
            :key="d.i"
            type="button"
            class="day"
            :class="{ 'is-on': av.workingDays.includes(d.i) }"
            @click="av.toggleDay(d.i)"
          >
            {{ d.label }}
          </button>
        </div>

        <p class="panel-title" style="margin-top: 1.5rem">Opening hours</p>
        <div class="field-row">
          <div class="field">
            <label>Opens</label>
            <select class="select" :value="av.openHour" @change="av.setHours($event.target.value, av.closeHour)">
              <option v-for="h in hours" :key="h" :value="h">{{ fmtHour(h) }}</option>
            </select>
          </div>
          <div class="field">
            <label>Closes</label>
            <select class="select" :value="av.closeHour" @change="av.setHours(av.openHour, $event.target.value)">
              <option v-for="h in hours" :key="h" :value="h">{{ fmtHour(h) }}</option>
            </select>
          </div>
        </div>
        <p class="hint">Last appointment starts at {{ fmtHour(av.closeHour - 1) }}.</p>
      </div>

      <div class="card card--pad">
        <p class="panel-title">Blocked dates</p>
        <div class="toolbar">
          <input v-model="newDate" type="date" class="input" style="max-width: 12rem" />
          <button class="btn btn--primary btn--sm" @click="addBlock">Block date</button>
        </div>

        <ul v-if="av.blockedDates.length" class="blocks">
          <li v-for="d in av.blockedDates" :key="d">
            <span>{{ shortDate(d) }}</span>
            <button class="btn btn--sm btn--danger" @click="av.unblockDate(d)">Remove</button>
          </li>
        </ul>
        <p v-else class="empty" style="padding: 1.5rem 0">No blocked dates — fully open.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.days {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.day {
  width: 3.2rem;
  padding: 0.55rem 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--ink-faint);
}
.day.is-on {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}
.blocks {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.blocks li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.7rem;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}
</style>
