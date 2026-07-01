<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/store/products'
import { money } from '@/utils'
import AppModal from '@/components/AppModal.vue'
import ProductForm from '@/components/ProductForm.vue'
import ProductThumb from '@/components/ProductThumb.vue'

const products = useProductsStore()

const search = ref('')
const filter = ref('all') // all | shop | appointment
const modalOpen = ref(false)
const editing = ref(null)
const saving = ref(false)

onMounted(() => products.load())

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return products.items.filter((p) => {
    if (filter.value !== 'all' && p.mode !== filter.value) return false
    if (!q) return true
    return p.name.toLowerCase().includes(q) || p.tags.join(' ').includes(q)
  })
})

const openCreate = () => {
  editing.value = null
  modalOpen.value = true
}
const openEdit = (p) => {
  editing.value = p
  modalOpen.value = true
}
const onSave = async (payload) => {
  saving.value = true
  try {
    if (editing.value) await products.update(editing.value.id, payload)
    else await products.add(payload)
    modalOpen.value = false
  } catch (e) {
    alert(e.message || 'Could not save the product.')
  } finally {
    saving.value = false
  }
}
const onDelete = async (p) => {
  if (confirm(`Delete “${p.name}”?`)) {
    try {
      await products.remove(p.id)
    } catch (e) {
      alert(e.message || 'Could not delete.')
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Products</h1>
        <p>{{ products.count }} items · {{ products.shopItems.length }} sold through the cart</p>
      </div>
      <button class="btn btn--primary" @click="openCreate">+ Add product</button>
    </div>

    <div class="toolbar">
      <input v-model="search" class="input" style="max-width: 18rem" placeholder="Search name or tag…" />
      <div class="seg">
        <button :class="{ 'is-active': filter === 'all' }" @click="filter = 'all'">All</button>
        <button :class="{ 'is-active': filter === 'shop' }" @click="filter = 'shop'">Products</button>
        <button :class="{ 'is-active': filter === 'appointment' }" @click="filter = 'appointment'">Services</button>
      </div>
    </div>

    <div class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th>Sells as</th>
            <th>Price</th>
            <th>Stock</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td>
              <div class="cell-product">
                <ProductThumb :name="p.name" :type="p.type" :image="p.image" />
                <div>
                  <div class="cell-strong">{{ p.name }}</div>
                  <div class="cell-muted" style="font-size: 0.74rem">{{ p.categoryName }}</div>
                </div>
              </div>
            </td>
            <td><span class="pill pill--grey">{{ p.type }}</span></td>
            <td>
              <span v-if="p.mode === 'appointment'" class="pill pill--rose">Booking</span>
              <span v-else-if="p.status === 'preorder'" class="pill pill--gold">Pre-order</span>
              <span v-else class="pill pill--green">Buy now</span>
            </td>
            <td>
              <span class="price">
                <span v-if="p.compareAt && p.compareAt > p.price" class="price-old">{{ money(p.compareAt) }}</span>
                <span :class="{ 'price-sale': p.compareAt && p.compareAt > p.price }">{{ money(p.price) }}</span>
              </span>
            </td>
            <td>
              <span v-if="p.mode === 'shop'" :class="{ 'cell-muted': p.status === 'preorder' }">
                {{ p.status === 'preorder' ? '—' : p.stock }}
              </span>
              <span v-else class="cell-muted">n/a</span>
            </td>
            <td>
              <div class="row-actions">
                <button class="btn btn--sm" @click="openEdit(p)">Edit</button>
                <button class="btn btn--sm btn--danger" @click="onDelete(p)">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="6"><p class="empty">No products match.</p></td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppModal :open="modalOpen" :title="editing ? 'Edit product' : 'Add product'" wide @close="modalOpen = false">
      <ProductForm :product="editing" @save="onSave" @cancel="modalOpen = false" />
    </AppModal>
  </div>
</template>
