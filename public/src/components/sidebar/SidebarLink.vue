<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { collapsed } from './state'

const props = defineProps({
  to: { type: String, required: true },
  icon: { type: String, required: true },
})

const route = useRoute()
const isActive = computed(() => route.path === props.to)
</script>

<template>
  <RouterLink :to="to" class="link flex items-center mt-3 text-xl" :class="{ active: isActive }">
    <i class="icon" :class="icon"></i>
    <Transition name="fade">
      <span v-if="!collapsed">
        <slot></slot>
      </span>
    </Transition>
  </RouterLink>
</template>

<style scoped>
.icon {
  padding-left: 0.15rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.link {
  cursor: pointer;
  position: relative;
  font-weight: 400;
  border-radius: 0.25em;
  height: 1.5em;

  color: white;
  text-decoration: none;
}

.link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.link.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.link .icon {
  flex-shrink: 0;
  width: 25px;
  margin-right: 10px;
}
</style>
