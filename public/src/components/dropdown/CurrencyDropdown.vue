<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  displayProperty:{
    type: String,
    required: true,
  }
})
const emit = defineEmits(['update:modelValue'])

function updateOption(event) {
  const value = event.target.value
  emit('update:modelValue', value)
}

</script>

<template>
  <select
    :name="label"
    :id="label"
    @change="updateOption"
    class="w-full max-w-md p-2 border border-gray-300 rounded text-center text-base"
  >
    <option
      v-for="currency in data"
      :key="currency.id"
      :value="currency.id"
    >
      {{ currency[displayProperty] }}
    </option>
  </select>
</template>
<style scoped></style>
