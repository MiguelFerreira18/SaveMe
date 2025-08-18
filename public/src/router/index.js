import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import CurrencyView from '@/views/CurrencyView.vue'
import { IsJWTExpired } from '@/lib/jwtUtils'
import { isProduction } from '@/lib/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: isProduction ? true : false },
      children: [
        {
          path: '/currency',
          name: 'currency',
          component: CurrencyView,
          meta: { requiresAuth: isProduction ? true : false },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = token
  const isOutDated = IsJWTExpired(token)
  if (to.meta.requiresAuth && !isAuthenticated && !isOutDated) {
    next('/')
  } else {
    next()
  }
})

export default router
