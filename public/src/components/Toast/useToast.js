import { ref } from "vue";


const toasts = ref([])


export function useToast() {
        /**
         * function to utilize a toast
         * @param {string} message - The message to show on screen
         * @param {string} type - The type of the message being sent {success,error,info}
         *
        **/
        const showToast = (message, type = 'info') => {
                const id = Date.now()
                toasts.value.push({ id, message, type, show: true })

                setTimeout(() => {
                        const toastIndex = toasts.value.findIndex((t) => t.id === id)
                        if (toastIndex !== -1) {
                                toasts.value[toastIndex].show = false
                        }

                        setTimeout(() => {
                                toasts.value = toasts.value.filter((toast) => toast.id !== id)
                        }, 300)
                }, 3000)
        }

        return {
                toasts,
                showToast
        }
}
