import { Get } from '@/lib/requests'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(null)

export function useAuth() {
        const router = useRouter()

        const checkAuthStatus = async () => {
                try {
                        const response = await Get("/auth/public/status", true)



                        if (!response.ok || response.data.status === 401 || response.data.status === 403) {
                                isAuthenticated.value = false
                                router.push('/login')
                                return false
                        }
                        if (response.data.ok) {
                                const isAuthMap = await response.data.json()
                                isAuthenticated.value = isAuthMap.authenticated
                                return isAuthenticated.value
                        }
                        isAuthenticated.value = false
                        return false

                } catch (error) {
                        isAuthenticated.value = false
                        return false
                }
        }

        return {
                isAuthenticated: computed(() => isAuthenticated.value),
                checkAuthStatus,
        }
}
