import { ref, computed } from 'vue'

export const collapsed = ref(false)
export const toggleSidebar = () => (collapsed.value = !collapsed.value)

export const SIDEBAR_WITH = 200
export const SIDEBAR_WITH_COLLAPSED = 40
export const sidebarwidth = computed(
  () => `${collapsed.value ? SIDEBAR_WITH_COLLAPSED : SIDEBAR_WITH}px`,
)
