import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { persistPlugin } from './store/persist'

import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'

const pinia = createPinia()
pinia.use(persistPlugin)

createApp(App).use(pinia).use(router).mount('#app')
