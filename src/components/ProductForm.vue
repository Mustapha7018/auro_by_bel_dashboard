<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useProductsStore } from '@/store/products'
import { fileToDataUrl } from '@/utils'

const PRODUCT_TYPES = ['Wig', 'Bundle', 'Nails', 'Lashes', 'Brows', 'Pedicure', 'Piercing', 'Other']

const props = defineProps({
  product: { type: Object, default: null }, // null = create
})
const emit = defineEmits(['save', 'cancel'])

const products = useProductsStore()
const categories = computed(() => products.categories)

const blank = () => ({
  name: '',
  type: 'Wig',
  category_id: '',
  mode: 'shop',
  status: 'instock',
  price: null,
  compareAt: null,
  variant: '',
  description: '',
  badge: '',
})

// deposit is always one-third of the price (computed by the backend too)
const depositPreview = computed(() => Math.round((Number(form.price) || 0) / 3))

const form = reactive(blank())
const tagsText = ref('')
const hasOptions = ref(false)
const optionLabel = ref('Length')
const optionValuesText = ref('')
const stock = ref(0)
const image = ref('')
const uploading = ref(false)
const dragging = ref(false)
const fileInput = ref(null)

const loadFile = async (file) => {
  if (!file) return
  uploading.value = true
  try {
    image.value = await fileToDataUrl(file)
  } catch {
    alert('Could not read that image.')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const onFile = (e) => loadFile(e.target.files?.[0])
const onDrop = (e) => {
  dragging.value = false
  loadFile(e.dataTransfer.files?.[0])
}

const hydrate = (p) => {
  Object.assign(form, blank(), p ? {
    name: p.name, type: p.type, category_id: p.category, mode: p.mode,
    status: p.status, price: p.price, compareAt: p.compareAt,
    variant: p.variant || '',
    description: p.description, badge: p.badge || '',
  } : {})
  if (!form.category_id) form.category_id = categories.value[0]?.id || ''
  tagsText.value = p?.tags?.join(', ') || ''
  hasOptions.value = !!p?.options
  optionLabel.value = p?.options?.label || 'Length'
  optionValuesText.value = p?.options?.values?.join(', ') || ''
  stock.value = p?.stock ?? 0
  image.value = p?.image || ''
}

watch(() => props.product, hydrate, { immediate: true })

const submit = () => {
  const payload = {
    name: form.name.trim(),
    type: form.type,
    category_id: form.category_id,
    mode: form.mode,
    status: form.mode === 'shop' ? form.status : 'instock',
    price: Number(form.price) || 0,
    compare_at: form.compareAt ? Number(form.compareAt) : null,
    variant: form.variant.trim() || null,
    description: form.description.trim(),
    badge: form.badge.trim() || null,
    tags: tagsText.value.split(',').map((t) => t.trim()).filter(Boolean),
    options:
      hasOptions.value && optionValuesText.value.trim()
        ? {
            label: optionLabel.value.trim() || 'Option',
            values: optionValuesText.value.split(',').map((v) => v.trim()).filter(Boolean),
          }
        : null,
    stock: form.mode === 'shop' ? Number(stock.value) || 0 : null,
    image: image.value || '',
  }
  emit('save', payload)
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="field">
      <label>Photo</label>
      <div
        class="dz"
        :class="{ 'dz--filled': image, 'dz--drag': dragging }"
        role="button"
        tabindex="0"
        @click="fileInput?.click()"
        @keydown.enter.prevent="fileInput?.click()"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <input ref="fileInput" type="file" accept="image/*" class="dz__input" @change="onFile" />

        <template v-if="image">
          <img :src="image" class="dz__img" alt="Product preview" />
          <div class="dz__overlay">
            <span class="dz__overlay-text">Click or drop to replace</span>
          </div>
          <button type="button" class="dz__remove" aria-label="Remove photo" @click.stop="image = ''">✕</button>
        </template>

        <div v-else class="dz__empty">
          <svg class="dz__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.6" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <p class="dz__title">{{ uploading ? 'Processing…' : 'Click to upload or drag a photo here' }}</p>
          <p class="dz__hint">JPG or PNG · resized automatically</p>
        </div>
      </div>
    </div>

    <div class="field">
      <label>Product name</label>
      <input v-model="form.name" class="input" required placeholder="e.g. HD Lace Frontal Wig" />
    </div>

    <div class="field-row">
      <div class="field">
        <label>Product type</label>
        <select v-model="form.type" class="select">
          <option v-for="t in PRODUCT_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div class="field">
        <label>Collection</label>
        <select v-model="form.category_id" class="select">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label>Variant subtitle</label>
      <input v-model="form.variant" class="input" placeholder="e.g. Body wave · 180% (shows under the name)" />
    </div>

    <div class="field">
      <label>Sells as</label>
      <div class="seg">
        <button type="button" :class="{ 'is-active': form.mode === 'shop' }" @click="form.mode = 'shop'">Product (cart)</button>
        <button type="button" :class="{ 'is-active': form.mode === 'appointment' }" @click="form.mode = 'appointment'">Service (booking)</button>
      </div>
    </div>

    <div v-if="form.mode === 'shop'" class="field">
      <label>Availability</label>
      <div class="seg">
        <button type="button" :class="{ 'is-active': form.status === 'instock' }" @click="form.status = 'instock'">Buy now</button>
        <button type="button" :class="{ 'is-active': form.status === 'preorder' }" @click="form.status = 'preorder'">Pre-order</button>
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label>Price (₵)</label>
        <input v-model="form.price" type="number" min="0" class="input" required placeholder="0" />
      </div>
      <div class="field">
        <label>Compare-at price (₵)</label>
        <input v-model="form.compareAt" type="number" min="0" class="input" placeholder="Optional — shows a sale slash" />
        <span class="hint">Original price, struck through when higher.</span>
      </div>
    </div>

    <div class="field">
      <label>Pre-order / booking deposit</label>
      <p class="hint">Automatically one-third of the price — <strong>₵{{ depositPreview.toLocaleString() }}</strong>.</p>
    </div>

    <div class="field">
      <label>Description</label>
      <textarea v-model="form.description" class="textarea" placeholder="Short description…"></textarea>
    </div>

    <div class="field">
      <label>Tags</label>
      <input v-model="tagsText" class="input" placeholder="comma separated, e.g. hd lace, body wave" />
    </div>

    <div class="field">
      <label class="optline">
        <input type="checkbox" v-model="hasOptions" />
        Has variants (e.g. wig sizes / inches)
      </label>
    </div>
    <div v-if="hasOptions" class="field-row">
      <div class="field">
        <label>Variant label</label>
        <input v-model="optionLabel" class="input" placeholder="Length" />
      </div>
      <div class="field">
        <label>Variant values</label>
        <input v-model="optionValuesText" class="input" placeholder='16", 18", 20", 22"' />
      </div>
    </div>

    <div class="field-row">
      <div v-if="form.mode === 'shop'" class="field">
        <label>Stock quantity</label>
        <input v-model="stock" type="number" min="0" class="input" placeholder="0" />
      </div>
      <div class="field">
        <label>Badge</label>
        <input v-model="form.badge" class="input" placeholder="e.g. Best seller (optional)" />
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn" @click="emit('cancel')">Cancel</button>
      <button type="submit" class="btn btn--primary">{{ product ? 'Save changes' : 'Add product' }}</button>
    </div>
  </form>
</template>

<style scoped>
.optline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.5rem;
}
.dz {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 9.5rem;
  border: 1.5px dashed var(--line);
  border-radius: var(--radius);
  background: var(--paper-warm);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.15s var(--ease), background 0.15s var(--ease);
}
.dz:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.dz--drag {
  border-color: var(--accent);
  background: var(--accent-soft);
}
.dz--filled {
  border-style: solid;
  border-color: var(--line);
  background: var(--ink);
  min-height: 11rem;
}
.dz__input {
  display: none;
}

.dz__empty {
  text-align: center;
  padding: 1.2rem;
  pointer-events: none;
}
.dz__icon {
  width: 2rem;
  height: 2rem;
  color: var(--accent);
  margin: 0 auto 0.5rem;
}
.dz__title {
  font-size: 0.85rem;
  font-weight: 600;
}
.dz__hint {
  font-size: 0.72rem;
  color: var(--ink-faint);
  margin-top: 0.15rem;
}

.dz__img {
  width: 100%;
  height: 100%;
  max-height: 16rem;
  object-fit: contain;
}
.dz__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(20, 17, 15, 0.45);
  opacity: 0;
  transition: opacity 0.15s var(--ease);
}
.dz:hover .dz__overlay {
  opacity: 1;
}
.dz__overlay-text {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.dz__remove {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--red);
  font-size: 0.8rem;
  display: grid;
  place-items: center;
  box-shadow: var(--shadow);
  z-index: 2;
}
.dz__remove:hover {
  background: #fff;
}
</style>
