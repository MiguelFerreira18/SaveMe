<script setup>
const props = defineProps({
  errorMessage: {
    type:String,
    required: true
  },
  retry:{
    type: Function,
    required: true
}
})

</script>


<template>
  <div class="flex flex-col min-h-screen justify-center items-center p-8">
  <h2 class="text-xl">Something went wrong</h2>
  <p>{{ errorMessage }}</p>
    <button class="bg-blue-500 text-white px-4 py-2 text-xl rounded w-20 hover:bg-blue-600
      active:bg-blue-700 transition" @click="retry()">Retry</button>
</div>
</template>
