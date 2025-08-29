import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import IncomeView from '@/views/IncomeView.vue'
import CurrencyView from '@/views/CurrencyView.vue'
import { IsJWTExpired } from '@/lib/jwtUtils'
import { isProduction } from '@/lib/config'
import { useAuth } from '@/composables/useAuth'
import CategoryView from '@/views/CategoryView.vue'
import ExpenseView from '@/views/ExpenseView.vue'

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
                        meta: { requiresAuth: true },
                        children: [
                                {
                                        path: '/currency',
                                        name: 'currency',
                                        component: CurrencyView,
                                        meta: { requiresAuth: true },
                                },
                                {
                                        path: '/income',
                                        name: 'income',
                                        component: IncomeView,
                                        meta: { requiresAuth: true },
                                },
                                {
                                        path: '/expense',
                                        name: 'expense',
                                        component: ExpenseView,
                                        meta: { requiresAuth: true }
                                },
                                {
                                        path: '/category',
                                        name: 'category',
                                        component: CategoryView,
                                        meta: { requiresAuth: true }
                                },

                        ],
                },
        ],
})

router.beforeEach(async (to, from, next) => {
        const { checkAuthStatus } = useAuth()

        if (!to.meta.requiresAuth) {
                next()
                return
        }

        const isAuthenticated = await checkAuthStatus()
        if (isAuthenticated) {
                next()
        } else {
                next('/login')
        }
})

export default router
