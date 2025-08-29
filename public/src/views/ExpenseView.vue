<script setup>
import TableGen from '@/components/table/TableGen.vue'
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue'
import Modal from '@/components/modal/Modal.vue'
import { onMounted, computed, reactive, ref } from 'vue'
import { Post, Get } from '@/lib/requests'
import { useToast } from '@/components/Toast/useToast'
import Toast from '@/components/Toast/Toast.vue'
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar.vue'
import LoadingSpinner from '@/components/spinner/LoadingSpinner.vue'
import NoValue from '@/components/error/NoValue.vue'
import ErrorServer from '@/components/error/ErrorServer.vue'

const { showToast } = useToast()

const isLoading = ref({
  currencies: true,
  categories: true,
  expense: true,
})
const hasErrors = ref({
  currencies: false,
  categories: false,
  expense: false,
})

onMounted(() => {
  getCurrencies()
  getCategories()
  getExpense()
})

async function getCurrencies() {
  const response = await Get('/api/currency/all')

  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
    hasErrors.value.currencies = true
    isLoading.value.currencies = false
  } else if (!response.data.ok) {
    showToast('Failed to fetch currencies. Server refused connection', 'error')
    hasErrors.value.currencies = true
    isLoading.value.currencies = false
  } else {
    isLoading.value.currencies = false
    const data = await response.data.json()
    currency.value = data
    currencyOption.value = data[0].id
    console.log(data);
  }
}
async function getCategories(){
  const response = await Get('/api/category/all')
  if(!response.ok){
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
    hasErrors.value.categories = true
    isLoading.value.categories = false
  }else if(!response.data.ok){
    hasErrors.value.categories = true
    isLoading.value.categories = false
  } else {
    isLoading.value.categories = false
    const data = await response.data.json()
    category.value = data
    categoryOption.value = data[0].id
  }
}
async function getExpense() {
  const response = await Get('/api/expense/all')

  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
    hasErrors.value.expense = true
    isLoading.value.expense = false
  } else if (!response.data.ok) {
    showToast('Failed to fetch expenses. Server refused connection', 'error')
    hasErrors.value.expense = true
    isLoading.value.expense = false
  } else {
    isLoading.value.expense = false
    const data = await response.data.json()
    expenses.value = data.map((i) => ({
      ...i,
      date: new Date(i.date[0], i.date[1] - 1, expense.date[2]).toISOString().slice(0, 10),
    }))
  }
}

const expenses = ref([
  {
    id: 1,
    symbol: '€',
    category: 'monthly',
    description: 'anyDescription',
    amount: 120,
    userId: '92a167e6-f909-4ee5-9443-1809e93fa092',
    date: '2025-08-21',
  },
  {
    id: 2,
    symbol: '€',
    category: 'monthly',
    description: 'anyDescription2',
    amount: 130,
    userId: '92a167e6-f909-4ee5-9443-1809e93fa092',
    date: '2025-08-21',
  },
])

const currentPage = ref(1)

const searchQuery = ref('')
const currencyOption = ref(1)
const currency = ref([])
const category = ref([])
const categoryOption = ref(1)
const dateOption = ref(getToday())
function getToday() {
  const date = new Date()
  const currentDate = date.toISOString().slice(0, 10)
  return currentDate
}
const filteredData = computed(() => {
  if (isLoading.value.currencies || isLoading.value.expense || isLoading.value.categories) {
    return []
  }
  if (!currency.value || currency.value.length === 0 || !category.value || category.value.length
    === 0) {
    return []
  }

  const searchLower = searchQuery.value.toLowerCase()
  const currencySymbol = currency.value.find((currency) => currency.id == currencyOption.value).symbol
  const categoryName = category.value.find((category) => category.id ==
    categoryOption.value).name.toLowerCase()
  const compareDate = (a, b) => {
    const date = new Date(a)
    const compDate = new Date(b)

    return date.getFullYear() == compDate.getFullYear() && date.getMonth() == compDate.getMonth()
  }

  return expenses.value.filter(
    (item) =>
      (item.description.toLowerCase().includes(searchLower) ||
        item.symbol.toLowerCase().includes(searchLower) ||
        item.amount.toString().toLowerCase().includes(searchLower)) &&
      item.symbol.toLowerCase().includes(currencySymbol) &&
      item.category.toLowerCase().includes(categoryName) &&
      compareDate(item.date.toLowerCase(), dateOption.value.toLowerCase()),
  )
})

function resetSearch() {
  searchQuery.value = ''
  dateOption.value = getToday()
  currencyOption.value = 1
  categoryOption.value = 1
}

const openModal = ref(false)

const expense = reactive({
  currencyId: 1,
  categoryId: 1,
  date: getToday(),
  amount: 0.0,
  description: '',
})

async function handleExpenseCreation() {
  const response = await Post('/api/expense', expense)
  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
  } else if (!response.data.ok) {
    showToast('Server rejected request', 'error')
  } else {
    showToast('Expense was added successfully', 'success')
    expense.currencyId = 1
    expense.categoryId = 1
    expense.amount = 0.0
    expense.description = ''
    expense.date = getToday()
  }
}
</script>

<template>
  <Toast />
  <LoadingSpinner
    v-if="isLoading.expense && isLoading.currencies && isLoading.categories"
    :isLoading="isLoading.expense && isLoading.currencies && isLoading.categories"
  />

  <ErrorServer
    v-else-if="hasErrors.currencies || hasErrors.expense || hasErrors.categories"
    errorMessage="An Error has occured on the server"
    :retry="
      () => {
        isLoading.currencies = true
        isLoading.expense = true
        getCurrencies()
        getCategories()
        getExpense()
      }
    "
  />

  <div v-else>
    <h1>Expense View</h1>
    <div class="flex flex-col md:flex-row pl-4 pr-5 py-2 gap-2 md:items-baseline">
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
            <MonthlyCalendar v-model="dateOption" name="calendar" :getToday="getToday" />
          </div>
          <div class="w-full sm:w-auto md:w-15 flex items-end">
            <CurrencyDropdown v-model="currencyOption" label="currencies" display-property="symbol" :data="currency" />
          </div>
          <div class="w-full sm:w-auto md:w-30 flex items-end">
            <CurrencyDropdown v-model="categoryOption" label="categories" display-property="name" :data="category" />
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
    <NoValue
      v-if="filteredData.length === 0"
      size="text-3xl"
      text="You don't have any expense added.
      Make sure to add your sources of expense"
    />
    <TableGen
      v-else
      :total="filteredData.reduce((acc, i) => acc + i.amount, 0)"
      :data="filteredData"
      :columns="['description','category' ,'amount', 'symbol']"
      :isNumeric="true"
      :pageSize="15"
      v-model:current-page="currentPage"
    />
    <Modal :isOpen="openModal" @close="openModal = false">
      <div>
        <h2 class="text-xl font-bold mb-4">Insert Expense Source</h2>
        <input
          v-model="expense.description"
          type="text"
          placeholder="Description"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          v-model="expense.amount"
          type="text"
          placeholder="Amount"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <div class="flex mb-3 gap-1 w-full">
          <div class="w-full flex items-end">
            <MonthlyCalendar v-model="expense.date" name="calendar" :getToday="getToday" />
          </div>
          <div class="w-20 flex items-end">
            <CurrencyDropdown v-model="expense.currencyId" label="currencies" display-property="symbol" :data="currency" />
          </div>
          <div class="w-50 flex items-end">
            <CurrencyDropdown v-model="expense.categoryId" label="categories"
              display-property="name" :data="category" />
          </div>
        </div>
        <button
          @click="handleExpenseCreation"
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 active:bg-green-700 transition"
        >
          Confirm
        </button>
      </div>
    </Modal>
  </div>
</template>


