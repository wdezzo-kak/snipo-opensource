import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Sidepanel from './Sidepanel.vue'

export function createUI() {
  const app = createApp(Sidepanel)
  app.use(createPinia())
  return app
}