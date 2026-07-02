<script setup>
import { ref, watch } from 'vue'
import { api } from '@/lib/api'
import AppModal from './AppModal.vue'

const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const confirmText = ref('')
const busy = ref(false)
const error = ref('')

watch(
  () => props.open,
  (o) => {
    if (o) {
      confirmText.value = ''
      error.value = ''
    }
  },
)

const submit = async () => {
  if (confirmText.value.trim().toUpperCase() !== 'RESET') {
    error.value = 'Type RESET to confirm.'
    return
  }
  busy.value = true
  error.value = ''
  try {
    await api.resetActivity()
    // reload so every page reflects the cleared data
    window.location.reload()
  } catch (e) {
    error.value = e.message || 'Could not reset.'
    busy.value = false
  }
}
</script>

<template>
  <AppModal :open="open" title="Reset test data" @close="emit('close')">
    <p style="color: var(--ink-soft); margin-bottom: 0.4rem">
      This permanently deletes <strong>all products, orders, payments, bookings and customers</strong>.
      Your collections, availability and login are kept.
    </p>
    <p style="color: var(--red); font-size: 0.8rem; margin-bottom: 1rem">This can't be undone.</p>

    <div class="field">
      <label>Type <strong>RESET</strong> to confirm</label>
      <input v-model="confirmText" class="input" placeholder="RESET" @keyup.enter="submit" />
    </div>
    <p v-if="error" style="color: var(--red); font-size: 0.8rem; margin-bottom: 0.6rem">{{ error }}</p>

    <div style="display: flex; justify-content: flex-end; gap: 0.6rem">
      <button type="button" class="btn" @click="emit('close')">Cancel</button>
      <button type="button" class="btn btn--danger" :disabled="busy" @click="submit">
        {{ busy ? 'Resetting…' : 'Reset everything' }}
      </button>
    </div>
  </AppModal>
</template>
