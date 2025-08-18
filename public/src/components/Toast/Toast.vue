<script setup>
import { useToast } from './useToast';
const { toasts } = useToast()

</script>



<template>
  <div class="fixed top-4 right-4 space-y-2 z-50">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="px-4 py-2 rounded shadow-lg text-white"
      :class="{
        'bg-green-500': toast.type === 'success',
        'bg-red-500': toast.type === 'error',
        'bg-blue-500': toast.type === 'info',
        'animate-fade-in': toast.show,
        'animate-fade-out': !toast.show,
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>
