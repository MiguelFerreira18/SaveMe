<script setup>
import TableGen from '@/components/table/TableGen.vue'
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue'
import Modal from '@/components/modal/Modal.vue'
import { computed, reactive, ref } from 'vue'
import { Post } from '@/lib/requests'
import { useToast } from '@/components/Toast/useToast'
import Toast from '@/components/Toast/Toast.vue'
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar.vue'

const { showToast } = useToast()

const tempData = [
  {
    id: 1,
    symbol: '€',
    description: 'anyDescription',
    amount: 120,
    userId: '92a167e6-f909-4ee5-9443-1809e93fa092',
  },
  {
    id: 2,
    symbol: '€',
    description: 'anyDescription2',
    amount: 130,
    userId: '92a167e6-f909-4ee5-9443-1809e93fa092',
  },
]

const currentPage = ref(1)

const searchQuery = ref('')
const filteredData = computed(() => {
  if (!searchQuery.value.trim()) {
    return [...tempData]
  }

  const searchLower = searchQuery.value.toLowerCase()

  return tempData.filter(
    (item) =>
      item.description.toLowerCase().includes(searchLower) ||
      item.symbol.toLowerCase().includes(searchLower) ||
      item.amount.toLowerCase().includes(searchLower),
  )
})

function resetSearch() {
  searchQuery.value = ''
}

const openModal = ref(false)

const option = ref(1) // Should default to €
const currency = [
  { id: 1, symbol: '$' },
  { id: 2, symbol: '€' },
]
const dateOption = ref(getToday())
function getToday() {
  const date = new Date()
  const currentDate = date.toISOString().slice(0, 10)
  return currentDate
}

const createIncome = reactive({
  symbol: 0,
  date: '',
  amount: 0.0,
  description: '',
})
</script>

<template>
  <Toast />
  <h1>Income View</h1>
  <div class="flex flex-col md:flex-row pr-5 py-2 gap-2 md:items-baseline">
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
      <div class="flex sm:contents gap-1 max-w-sm">
        <div class="w-full sm:w-auto md:w-35 flex items-end">
          <MonthlyCalendar v-model="dateOption" :name="calendar" :getToday="getToday" />
        </div>
        <div class="w-full sm:w-auto md:w-15 flex items-end">
          <CurrencyDropdown v-model="option" :label="currencies" :data="currency" />
        </div>
      </div>

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
  <TableGen
    :data="filteredData"
    :columns="['description', 'amount', 'symbol']"
    :isCurrency="false"
    :pageSize="15"
    v-model:current-page="currentPage"
  />
  <Modal :isOpen="openModal" @close="openModal = false">
    <div>
      <h2 class="text-xl font-bold mb-4">Insert Income Source</h2>
      <input
        v-model="createIncome.description"
        type="text"
        placeholder="Description"
        class="w-full mb-3 p-2 border border-gray-300 rounded"
      />
      <input
        v-model="createIncome.amount"
        type="text"
        placeholder="Amount"
        class="w-full mb-3 p-2 border border-gray-300 rounded"
      />
      <div class="flex mb-3 gap-1 w-full">
        <div class="w-full flex items-end">
          <MonthlyCalendar v-model="dateOption" :name="calendar" :getToday="getToday" />
        </div>
        <div class="w-20 flex items-end">
          <CurrencyDropdown v-model="option" :label="currencies" :data="currency" />
        </div>
      </div>
      <button
        @click="handleCurrencyCreation"
        class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 active:bg-green-700 transition"
      >
        Confirm
      </button>
    </div>
  </Modal>
</template>

<style scoped></style>
