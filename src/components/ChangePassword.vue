<script setup>
import { ref, watch } from 'vue'
import { api } from '@/lib/api'
import { useToastsStore } from '@/store/toasts'
import AppModal from './AppModal.vue'

const toasts = useToastsStore()

const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const current = ref('')
const next = ref('')
const confirm = ref('')
const busy = ref(false)
const error = ref('')
const done = ref(false)

watch(
  () => props.open,
  (o) => {
    if (o) {
      current.value = ''
      next.value = ''
      confirm.value = ''
      error.value = ''
      done.value = false
    }
  },
)

const submit = async () => {
  error.value = ''
  if (next.value.length < 6) {
    error.value = 'New password must be at least 6 characters.'
    return
  }
  if (next.value !== confirm.value) {
    error.value = 'New passwords do not match.'
    return
  }
  busy.value = true
  try {
    await api.changePassword({ current_password: current.value, new_password: next.value })
    toasts.success('Password updated.')
    done.value = true
  } catch (e) {
    error.value = e.message || 'Could not change password.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <AppModal :open="open" title="Change password" @close="emit('close')">
    <div v-if="done" class="cp-done">
      <p class="cp-tick">✓</p>
      <p>Password updated.</p>
      <button class="btn btn--primary" type="button" @click="emit('close')">Done</button>
    </div>
    <form v-else @submit.prevent="submit">
      <div class="field">
        <label>Current password</label>
        <input v-model="current" type="password" class="input" autocomplete="current-password" required />
      </div>
      <div class="field">
        <label>New password</label>
        <input v-model="next" type="password" class="input" autocomplete="new-password" minlength="6" required />
      </div>
      <div class="field">
        <label>Confirm new password</label>
        <input v-model="confirm" type="password" class="input" autocomplete="new-password" required />
      </div>
      <p v-if="error" class="cp-error">{{ error }}</p>
      <div style="display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.3rem">
        <button type="button" class="btn" @click="emit('close')">Cancel</button>
        <button type="submit" class="btn btn--primary" :disabled="busy">{{ busy ? 'Saving…' : 'Update password' }}</button>
      </div>
    </form>
  </AppModal>
</template>

<style scoped>
.cp-error {
  color: var(--red);
  font-size: 0.82rem;
  margin-bottom: 0.4rem;
}
.cp-done {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 0;
}
.cp-tick {
  width: 2.6rem;
  height: 2.6rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--green-soft);
  color: var(--green);
  font-size: 1.1rem;
}
</style>
