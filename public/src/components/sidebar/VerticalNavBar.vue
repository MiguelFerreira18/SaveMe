<script setup>
import { collapsed, sidebarwidth, toggleSidebar } from './state'
import SidebarLink from './SidebarLink.vue'
</script>

<template>
  <nav class="sidebar bg-gray-800" :style="{ width: sidebarwidth }">
    <h1 class="text-2xl flex content-center pt-2">
      <p v-if="!collapsed" class="pl-2">SaveMe!</p>
      <span
        @click="toggleSidebar"
        class="flex items-center collapse-icon"
        :class="{ 'pl-1 pr-3 ml-auto': !collapsed }"
      >
        <i
          class="fas fa-angle-double-left icon-rotate"
          :class="{
            rotated: collapsed,
          }"
        ></i>
      </span>
    </h1>
    <SidebarLink to="/dashboard" icon="fas fa-chart-bar">Dashboard</SidebarLink>
    <SidebarLink to="/income" icon="fas fa-coins">Income</SidebarLink>
    <SidebarLink to="/currency" icon="fas fa-coins">Currency</SidebarLink>
    <SidebarLink to="/" icon="fas fa-check">Login</SidebarLink>
  </nav>
</template>

<style scoped>
.sidebar {
  color: white;
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  transition: 0.3s ease;

  display: flex;
  flex-direction: column;
}

.collapse-icon {
  display: inline-block;
  color: whitesmoke;
  transition: transform 0.2s linear;
}
.icon-rotate {
  transition: transform 0.3s ease;
  transform-origin: center;
}
.icon-rotate.rotated {
  transform: rotate(180deg);
}
</style>
