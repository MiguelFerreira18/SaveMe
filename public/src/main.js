import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import { useToast } from './components/Toast/useToast'

const app = createApp(App)

app.use(router)

app.config.globalProperties.$toast = useToast().showToast

app.mount('#app')
