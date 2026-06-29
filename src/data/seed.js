/**
 * Seed data for the dashboard (first run only; persisted to localStorage
 * afterwards). Shapes mirror the storefront so a future API can serve both.
 *
 * money values are whole Ghana Cedis (₵).
 */

const day = (offset) => {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export const PRODUCT_TYPES = ['Wig', 'Bundle', 'Nails', 'Lashes', 'Brows', 'Pedicure', 'Piercing', 'Other']
export const CATEGORIES = [
  'Wig Installation', 'Wig Making', 'Revamping', 'Pedicure', 'Nails',
  'Lash Extensions', 'Microblading', 'Piercing', 'Wigs & Bundles',
]

export const seedProducts = [
  {
    id: 'p_frontal_wig', name: 'HD Lace Frontal Wig', type: 'Wig', category: 'Wigs & Bundles',
    mode: 'shop', status: 'instock', price: 2000, compareAt: 2400,
    description: 'Body-wave HD lace frontal, 180% density. Glueless cap.',
    tags: ['hd lace', 'body wave', 'bestseller'],
    options: { label: 'Length', values: ['18"', '20"', '22"', '26"'] },
    stock: 6, badge: 'Best seller',
  },
  {
    id: 'p_closure_wig', name: 'Glueless 5×5 Closure Wig', type: 'Wig', category: 'Wigs & Bundles',
    mode: 'shop', status: 'instock', price: 1800, compareAt: null,
    description: 'Deep-curl closure wig, 200% density.',
    tags: ['closure', 'deep curl'],
    options: { label: 'Length', values: ['16"', '18"', '20"'] },
    stock: 2, badge: 'Low stock',
  },
  {
    id: 'p_bundles', name: 'Raw SDD Bundles', type: 'Bundle', category: 'Wigs & Bundles',
    mode: 'shop', status: 'instock', price: 700, compareAt: null,
    description: 'Single-donor double-drawn straight bundles.',
    tags: ['raw hair', 'straight'],
    options: { label: 'Length', values: ['16"', '18"', '20"', '22"', '24"'] },
    stock: 14, badge: null,
  },
  {
    id: 'p_pixie', name: 'Coloured Pixie Unit', type: 'Wig', category: 'Wigs & Bundles',
    mode: 'shop', status: 'preorder', price: 1200, compareAt: null,
    description: 'Honey-blonde pre-styled pixie, made to order.',
    tags: ['pixie', 'coloured', 'made to order'],
    options: { label: 'Length', values: ['8"', '10"'] },
    stock: 0, badge: 'Made to order',
  },
  {
    id: 'p_make_frontal', name: 'Frontal Unit (Custom)', type: 'Wig', category: 'Wig Making',
    mode: 'shop', status: 'preorder', price: 850, compareAt: null,
    description: 'Hand-built frontal unit to your measurements.',
    tags: ['custom', 'wig making'],
    options: { label: 'Density', values: ['150%', '180%', '200%'] },
    stock: 0, badge: 'Made to order',
  },
  {
    id: 's_install_frontal', name: 'Frontal Install', type: 'Other', category: 'Wig Installation',
    mode: 'appointment', status: 'instock', price: 200, compareAt: null,
    description: 'Scalp-melting frontal install finished to your hairline.',
    tags: ['install', 'frontal'], options: null, stock: null, badge: 'Popular',
  },
  {
    id: 's_nails_acrylic', name: 'Acrylic Full Set', type: 'Nails', category: 'Nails',
    mode: 'appointment', status: 'instock', price: 180, compareAt: null,
    description: 'Sculpted acrylic full set.',
    tags: ['acrylic', 'full set'], options: null, stock: null, badge: null,
  },
  {
    id: 's_lash_volume', name: 'Volume Lash Set', type: 'Lashes', category: 'Lash Extensions',
    mode: 'appointment', status: 'instock', price: 250, compareAt: 300,
    description: 'Full, fluffy handmade volume fans.',
    tags: ['volume', 'lashes'], options: null, stock: null, badge: 'Sale',
  },
  {
    id: 's_brows_ombre', name: 'Ombré Powder Brows', type: 'Brows', category: 'Microblading',
    mode: 'appointment', status: 'instock', price: 800, compareAt: null,
    description: 'Soft-gradient semi-permanent brows.',
    tags: ['brows', 'ombre'], options: null, stock: null, badge: 'Popular',
  },
  {
    id: 's_pedi_spa', name: 'Luxury Spa Pedicure', type: 'Pedicure', category: 'Pedicure',
    mode: 'appointment', status: 'instock', price: 200, compareAt: null,
    description: 'Scrub, mask and massage finish.',
    tags: ['pedicure', 'spa'], options: null, stock: null, badge: null,
  },
]

export const seedCustomers = [
  { id: 'c_ama', name: 'Ama Mensah', email: 'ama.mensah@gmail.com', phone: '024 555 0142', joined: day(-90) },
  { id: 'c_akua', name: 'Akua Boateng', email: 'akua.b@gmail.com', phone: '020 555 0199', joined: day(-60) },
  { id: 'c_efua', name: 'Efua Owusu', email: 'efua.owusu@gmail.com', phone: '055 555 0123', joined: day(-30) },
  { id: 'c_nana', name: 'Nana Adjei', email: 'nana.adjei@gmail.com', phone: '027 555 0177', joined: day(-12) },
]

export const seedBookings = [
  { id: 'b1', customerId: 'c_ama', customerName: 'Ama Mensah', service: 'Frontal Install', date: day(1), time: '11:00', deposit: 70, status: 'confirmed', createdAt: day(-2) },
  { id: 'b2', customerId: 'c_akua', customerName: 'Akua Boateng', service: 'Acrylic Full Set', date: day(2), time: '14:00', deposit: 60, status: 'requested', createdAt: day(-1) },
  { id: 'b3', customerId: 'c_efua', customerName: 'Efua Owusu', service: 'Volume Lash Set', date: day(3), time: '10:00', deposit: 80, status: 'requested', createdAt: day(0) },
  { id: 'b4', customerId: 'c_nana', customerName: 'Nana Adjei', service: 'Ombré Powder Brows', date: day(-3), time: '13:00', deposit: 250, status: 'completed', createdAt: day(-7) },
  { id: 'b5', customerId: 'c_ama', customerName: 'Ama Mensah', service: 'Luxury Spa Pedicure', date: day(5), time: '15:00', deposit: 60, status: 'confirmed', createdAt: day(-1) },
]

// `total` is the full order value; `payments` is the running history Bel adds to.
// paid = sum(payments), balance = total − paid.
export const seedOrders = [
  {
    id: 'o1', customerId: 'c_ama', customerName: 'Ama Mensah', createdAt: day(-5),
    items: [{ name: 'HD Lace Frontal Wig', mode: 'full', length: '20"', qty: 1, price: 2000 }],
    total: 2000,
    payments: [{ id: 'pay1', amount: 2000, method: 'Mobile Money', note: 'Paid in full', ts: day(-5) }],
    status: 'delivered',
  },
  {
    id: 'o2', customerId: 'c_akua', customerName: 'Akua Boateng', createdAt: day(-2),
    items: [
      { name: 'Raw SDD Bundles', mode: 'full', length: '20"', qty: 3, price: 700 },
      { name: 'Coloured Pixie Unit', mode: 'preorder', length: '10"', qty: 1, price: 1200 },
    ],
    total: 3300,
    payments: [{ id: 'pay2', amount: 2500, method: 'Mobile Money', note: 'Bundles + pixie deposit', ts: day(-2) }],
    status: 'processing',
  },
  {
    id: 'o3', customerId: 'c_nana', customerName: 'Nana Adjei', createdAt: day(-1),
    items: [{ name: 'Frontal Unit (Custom)', mode: 'preorder', length: '180%', qty: 1, price: 850 }],
    total: 850,
    payments: [{ id: 'pay3', amount: 300, method: 'Cash', note: 'Deposit', ts: day(-1) }],
    status: 'processing',
  },
]

export const seedAvailability = {
  workingDays: [2, 3, 4, 5, 6], // Tue–Sat
  openHour: 9,
  closeHour: 18,
  blockedDates: [], // ISO dates Bel marks off
}
