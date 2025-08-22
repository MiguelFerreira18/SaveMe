<script setup>
import { computed, defineEmits } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  isCurrency: {
    type: Boolean,
    required: false,
    default: false,
  },
  total: {
    type: Number,
    required: false,
    default: null,
  },
  pageSize: {
    type: Number,
    required: false,
    default: 10,
  },
  currentPage: {
    type: Number,
    required: false,
  },
})
const emit = defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.data.length / props.pageSize))

const paginatedData = computed(() => {
  const start = (props.currentPage - 1) * props.pageSize
  return props.data.slice(start, start + props.pageSize)
})
const getVisiblePages = computed(() => {
  const pages = []
  const current = props.currentPage
  const total = totalPages.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)

    if (current <= 3) {
      end = Math.min(total - 1, 4)
    } else if (current >= total - 2) {
      start = Math.max(2, total - 3)
    }

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i)
      }
    }
  }

  return pages
})
function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('update:currentPage', newPage)
  }
}

const goToFirstPage = () => changePage(1)
const goToLastPage = () => changePage(totalPages.value)
const goToPrevPage = () => changePage(props.currentPage - 1)
const goToNextPage = () => changePage(props.currentPage + 1)

const formatValue = (value) => {
  if (props.isCurrency && typeof value === 'number') {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }
  return value
}
</script>

<template>
  <div class="table-container p-4">
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column"
              class="px-4 py-1 text-left text-lg font-bold text-gray-500 uppercase border-b border-gray-200"
            >
              {{ column.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(item, index) in paginatedData"
            :key="item.id || index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column"
              class="text-lg px-4 py-1 whitespace-nowrap text-gray-900"
            >
              {{ formatValue(item[column]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="total" class="mt-4 p-4 bg-gray-100 rounded-lg">
      <div class="flex justify-between items-center font-semibold">
        <span class="text-xl pr-4">Total:</span>
        <div class="flex gap-8">
          <span class="text-xl pr-4">
            {{total}}
          </span>
        </div>
      </div>
    </div>

    <div
      class="flex items-center justify-between mt-6 px-4 py-3 bg-white border border-gray-300 rounded-lg"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="goToPrevPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      <div
        class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between lg:justify-center md:justify-around"
      >
        <div class="flex items-center space-x-2">
          <button
            @click="goToFirstPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
          >
            <i class="fas fa-angle-double-left"></i>
          </button>

          <button
            @click="goToPrevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-angle-left"></i>
          </button>

          <template v-if="totalPages <= 7">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </template>

          <template v-else>
            <button
              @click="changePage(1)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                1 === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
            >
              1
            </button>

            <span v-if="currentPage > 4" class="px-2 text-gray-500">...</span>

            <button
              v-for="page in getVisiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>

            <span v-if="currentPage < totalPages - 3" class="px-2 text-gray-500">...</span>

            <button
              v-if="totalPages > 1"
              @click="changePage(totalPages)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                totalPages === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
            >
              {{ totalPages }}
            </button>
          </template>

          <button
            @click="goToNextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-angle-right"></i>
          </button>

          <button
            @click="goToLastPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
          >
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
