<script setup>
import VerticalNavBar from '@/components/sidebar/VerticalNavBar.vue'
import { sidebarwidth } from '@/components/sidebar/state'
</script>

<template>
  <VerticalNavBar />

  <main class="pt-5 px-2" :style="{ 'margin-left': sidebarwidth }">
    <RouterView />
  </main>
</template>

<style lang="css" scoped></style>
