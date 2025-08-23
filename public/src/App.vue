<script setup>
import { RouterView } from 'vue-router'
import Toast from '@/components/Toast/Toast.vue'
import { useAuth } from './composables/useAuth'
import { onMounted } from 'vue'

const { checkAuthStatus } = useAuth()

onMounted(() => {
  checkAuthStatus()
})
</script>

<template>
  <RouterView />
</template>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out forwards;
}
</style>
