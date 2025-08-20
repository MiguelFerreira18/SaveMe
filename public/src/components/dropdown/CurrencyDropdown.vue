<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

function updateOption(val) {
  emit('update:modelValue', val)
}
</script>

<template>
  <select
    :name="label"
    :id="label"
    class="w-full max-w-md p-2 border border-gray-300 rounded text-center text-base"
  >
    <option
      v-for="currency in data"
      :key="currency.id"
      :value="currency.id"
      @click="updateOption(currency.id)"
    >
      {{ currency.symbol }}
    </option>
  </select>
</template>
<style scoped></style>
