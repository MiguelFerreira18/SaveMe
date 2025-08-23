<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  getToday: {
    type: Function,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function incrementAYear(dateStr) {
  const date = new Date(dateStr)
  date.setFullYear(date.getFullYear() + 1)
  const currentDatePlusYear = date.toISOString().slice(0, 10)
  return currentDatePlusYear
}

function updateDate(value) {
  emit('update:modelValue', value.target.value)
}
</script>

<template>
  <input
    type="date"
    :name="name"
    :id="name"
    :value="props.modelValue"
    min="1927-01-01"
    :max="incrementAYear(props.getToday())"
    @input="updateDate"
    class="w-full max-w-md p-2 border border-gray-300 rounded text-center text-base"
  />
</template>
<style scoped></style>
