<script setup>
import { useConfirmStore } from '@/store/confirm'
import AppModal from './AppModal.vue'

const confirm = useConfirmStore()
</script>

<template>
  <AppModal :open="confirm.open" :title="confirm.title" @close="confirm.cancel()">
    <p style="color: var(--ink-soft); margin-bottom: 1.2rem">{{ confirm.message }}</p>
    <div style="display: flex; justify-content: flex-end; gap: 0.6rem">
      <button type="button" class="btn" @click="confirm.cancel()">Cancel</button>
      <button
        type="button"
        class="btn"
        :class="confirm.danger ? 'btn--danger' : 'btn--primary'"
        @click="confirm.confirm()"
      >
        {{ confirm.confirmLabel }}
      </button>
    </div>
  </AppModal>
</template>
