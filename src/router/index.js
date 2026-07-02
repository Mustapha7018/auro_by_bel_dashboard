import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'overview', component: () => import('@/views/OverviewView.vue'), meta: { title: 'Overview' } },
  { path: '/products', name: 'products', component: () => import('@/views/ProductsView.vue'), meta: { title: 'Products' } },
  { path: '/bookings', name: 'bookings', component: () => import('@/views/BookingsView.vue'), meta: { title: 'Bookings' } },
  { path: '/availability', name: 'availability', component: () => import('@/views/AvailabilityView.vue'), meta: { title: 'Availability' } },
  { path: '/inventory', name: 'inventory', component: () => import('@/views/InventoryView.vue'), meta: { title: 'Inventory' } },
  { path: '/orders', name: 'orders', component: () => import('@/views/OrdersView.vue'), meta: { title: 'Orders' } },
  { path: '/customers', name: 'customers', component: () => import('@/views/CustomersView.vue'), meta: { title: 'Customers' } },
  { path: '/analytics', name: 'analytics', component: () => import('@/views/AnalyticsView.vue'), meta: { title: 'Analytics' } },
  { path: '/gallery', name: 'gallery', component: () => import('@/views/GalleryView.vue'), meta: { title: 'Gallery' } },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
