<script setup>
import { ref } from 'vue'

const name = ref(localStorage.getItem('username') || 'John Doe')
</script>

<template>
  <div>Congrats {{ name }}</div>
</template>

<style lang="css" scoped></style>
