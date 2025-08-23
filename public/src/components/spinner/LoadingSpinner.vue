<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div v-if="isLoading" class="flex flex-row min-h-screen justify-center items-center p-8">
    <div class="animate-spin rounded-full h-18 w-18 border-b-2 border-blue-500"></div>
    <p v-if="message" class="mt-4 text-gray-600">{{ message }}</p>
  </div>
</template>
