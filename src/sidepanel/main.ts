import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Sidepanel from '../ui/Sidepanel.vue'

const app = createApp(Sidepanel)
app.use(createPinia())
app.mount('#app')