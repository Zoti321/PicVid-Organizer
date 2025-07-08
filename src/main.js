import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import {createPinia} from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import 'animate.css'
import './style.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
