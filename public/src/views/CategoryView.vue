<script setup lang="js">
import TableGen from '@/components/table/TableGen.vue'
import Modal from '@/components/modal/Modal.vue'
import { computed, onMounted, ref } from 'vue'
import { Post, Get } from '@/lib/requests'
import { useToast } from '@/components/Toast/useToast'
import Toast from '@/components/Toast/Toast.vue'
import LoadingSpinner from '@/components/spinner/LoadingSpinner.vue'
import ErrorServer from '@/components/error/ErrorServer.vue'
import NoValue from '@/components/error/NoValue.vue'

const { showToast } = useToast()
const isLoading = ref({
  categories: true,
})
const hasErrors = ref({
  categories: false,
})

async function getCategories() {
  const response = await Get('/api/category/all')

  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
    hasErrors.value.categories = true
    isLoading.value.categories = false
  } else if (!response.data.ok) {
    showToast('Failed to fetch currencies. Server refused connection', 'error')
    hasErrors.value.categories = true
    isLoading.value.categories = false
  } else {
    isLoading.value.categories = false
    const data = await response.data.json()
    categories.value = data
  }
}

const categories = ref([
  // { id: 1, name: 'dollar', symbol: '$' },
  // { id: 2, name: 'euro', symbol: '€' },
  // { id: 3, name: 'pound', symbol: '£' },
  // { id: 4, name: 'yen', symbol: '¥' },
  // { id: 5, name: 'won', symbol: '₩' },
  // { id: 6, name: 'franc', symbol: '₣' },
  // { id: 7, name: 'rupee', symbol: '₹' },
  // { id: 8, name: 'currency', symbol: '¤' },
])

const currentPage = ref(1)

const searchQuery = ref('')
const filteredData = computed(() => {
  if (!isLoading.value.categories) {
    if (!searchQuery.value.trim()) {
      return categories.value
    }

    const searchLower = searchQuery.value.toLowerCase()

    return categories.value.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower),
    )
  }
  return []
})

function resetSearch() {
  searchQuery.value = ''
}

const openModal = ref(false)

const categoryName = ref('')
const categoryDescription = ref('')
async function handleCategoryCreation() {
  const category = {
    name: categoryName.value,
    description: categoryDescription.value,
  }

  const response = await Post('/api/category', category)

  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
  } else if (!response.data.ok) {
    showToast('Server rejected the request', 'error')
  } else {
    showToast('Category was added successfully', 'success')
    openModal.value = false
    categoryName.value = ''
    categoryDescription.value = ''
  }
}

onMounted(() => {
  getCategories()
})
</script>

<template>
  <Toast />
  <LoadingSpinner v-if="isLoading.categories" :isLoading="isLoading.categories" />

  <ErrorServer
    v-else-if="hasErrors.categories"
    errorMessage="An Error has occured on the server"
    :retry="
      () => {
        isLoading.categories = true
        getCategories()
      }
    "
  />
  <div v-else>
    <h1>Category View</h1>
    <div class="flex flex-col md:flex-row px-5 py-2 gap-2 md:items-baseline">
      <div class="flex flex-2 flex-col sm:flex-row gap-2">
        <span class="relative flex items-center">
          <span class="absolute left-2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            class="w-full max-w-md p-2 pl-8 border border-gray-300 rounded"
            type="text"
            placeholder="Search..."
          />
        </span>
        <button
          v-if="searchQuery"
          @click="resetSearch"
          class="bg-gray-200 text-gray-700 px-3 py-2 rounded sm:ml-2 hover:bg-gray-300 active:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>

      <button
        class="bg-blue-500 text-white px-4 py-2 text-lg rounded md:ml-auto w-full sm:w-auto hover:bg-blue-600 active:bg-blue-700 transition"
        @click="openModal = true"
      >
        Create
      </button>
    </div>
    <NoValue
      v-if="filteredData.length === 0"
      size="text-3xl"
      text="You don't have any category added.
      Make sure to add your categories"
    />
    <TableGen
      v-else
      :data="filteredData"
      :columns="['name', 'description']"
      :isNumeric="false"
      :pageSize="15"
      v-model:current-page="currentPage"
    />
    <Modal :isOpen="openModal" @close="openModal = false">
      <div>
        <h2 class="text-xl font-bold mb-4">Create a Category</h2>
        <input
          v-model="categoryName"
          type="text"
          placeholder="Category Name"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          v-model="categoryDescription"
          type="text"
          placeholder="Category Description"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <button
          @click="handleCategoryCreation"
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 active:bg-green-700 transition"
        >
          Confirm
        </button>
      </div>
    </Modal>
  </div>
</template>


