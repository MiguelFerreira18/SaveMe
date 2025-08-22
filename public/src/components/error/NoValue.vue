
<script setup>
const props = defineProps({
  text:{
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  }
})


</script>

<template>
  <div class="pt-10 flex justify-center items-center">
  <p :class="props.size" >{{props.text}}</p>
</div>
</template>

