<script setup>
import { computed, onMounted } from 'vue'
import { useProductsStore, LOW_STOCK } from '@/store/products'
import { money } from '@/utils'
import ProductThumb from '@/components/ProductThumb.vue'

const products = useProductsStore()
onMounted(() => products.load())

// only physical, buyable stock is tracked
const tracked = computed(() => products.shopItems.filter((p) => p.status === 'instock'))
const stockLevel = (p) => (p.stock <= LOW_STOCK ? (p.stock === 0 ? 'out' : 'low') : 'ok')
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Inventory</h1>
        <p>{{ products.lowStock.length }} item(s) at or below {{ LOW_STOCK }} in stock.</p>
      </div>
    </div>

    <div class="card table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>In stock</th>
            <th>Adjust</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in tracked" :key="p.id">
            <td>
              <div class="cell-product">
                <ProductThumb :name="p.name" :type="p.type" :image="p.image" />
                <div class="cell-strong">{{ p.name }}</div>
              </div>
            </td>
            <td>{{ money(p.price) }}</td>
            <td>
              <input
                class="input stock-input"
                type="number"
                min="0"
                :value="p.stock"
                @change="products.setStock(p.id, $event.target.value)"
              />
            </td>
            <td>
              <div class="row-actions" style="justify-content: flex-start">
                <button class="btn btn--icon" @click="products.adjustStock(p.id, -1)">−</button>
                <button class="btn btn--icon" @click="products.adjustStock(p.id, 1)">+</button>
              </div>
            </td>
            <td>
              <span class="pill" :class="{ 'pill--green': stockLevel(p) === 'ok', 'pill--amber': stockLevel(p) === 'low', 'pill--red': stockLevel(p) === 'out' }">
                {{ stockLevel(p) === 'ok' ? 'In stock' : stockLevel(p) === 'low' ? 'Low' : 'Out of stock' }}
              </span>
            </td>
          </tr>
          <tr v-if="!tracked.length">
            <td colspan="5"><p class="empty">No stock-tracked products. Pre-order and service items aren't counted.</p></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.stock-input {
  max-width: 5rem;
}
</style>
