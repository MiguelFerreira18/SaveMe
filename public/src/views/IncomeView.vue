<script setup>
import TableGen from '@/components/table/TableGen.vue'
import CurrencyDropdown from '@/components/dropdown/CurrencyDropdown.vue'
import Modal from '@/components/modal/Modal.vue'
import { onMounted,computed, reactive, ref } from 'vue'
import { Post,Get } from '@/lib/requests'
import { useToast } from '@/components/Toast/useToast'
import Toast from '@/components/Toast/Toast.vue'
import MonthlyCalendar from '@/components/calendar/MonthlyCalendar.vue'
import LoadingSpinner from '@/components/spinner/LoadingSpinner.vue'
import NoValue from '@/components/error/NoValue.vue'
import ErrorServer from '@/components/error/ErrorServer.vue'

const { showToast } = useToast()

const isLoading = ref({
  currencies: true,
  income: true
})
const hasErrors = ref({
  currencies: false,
  income: false
})

onMounted(() => {
  getCurrencies()
  getIncomes()
})

async function getCurrencies(){
  const response = await Get("/api/currency/all")

  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
    hasErrors.value.currencies = true
    isLoading.value.currencies = false
  }else if(!response.data.ok){
    showToast('Failed to fetch currencies. Server refused connection','error')
    hasErrors.value.currencies = true
    isLoading.value.currencies = false
  }else{
    isLoading.value.currencies = false
    const data = await response.data.json()
    currency.value = data
    option.value = data[0].id
  }
}
async function getIncomes(){
  const response = await Get("/api/income/all")

  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
    hasErrors.value.income = true
    isLoading.value.income = false
  }else if(!response.data.ok){
    showToast('Failed to fetch income. Server refused connection','error')
    hasErrors.value.income = true
    isLoading.value.income = false
  }else{
    isLoading.value.income = false
    const data = await response.data.json()
    incomes.value = data.map((i) => ({
      ...i,
      date: new Date(i.date[0],i.date[1]-1,income.date[2]).toISOString().slice(0,10)
    }))
  }
}

const incomes = ref([
  {
    id: 1,
    symbol: '€',
    description: 'anyDescription',
    amount: 120,
    userId: '92a167e6-f909-4ee5-9443-1809e93fa092',
    date: '2025-08-21'
  },
  {
    id: 2,
    symbol: '€',
    description: 'anyDescription2',
    amount: 130,
    userId: '92a167e6-f909-4ee5-9443-1809e93fa092',
    date: '2025-08-21'
  },
])

const currentPage = ref(1)

const searchQuery = ref('')
const option = ref(1)
const currency = ref([
])
const dateOption = ref(getToday())
function getToday() {
  const date = new Date()
  const currentDate = date.toISOString().slice(0, 10)
  return currentDate
}
const filteredData = computed(() => {
  if (isLoading.value.currencies || isLoading.value.income) {
    return []
  }
    if ((!currency.value || currency.value.length === 0)) {
    return []
  }

  const searchLower = searchQuery.value.toLowerCase()
  const currencySymbol = currency.value.find( (currency) => currency.id == option.value).symbol
  const compareDate = (a,b) => {
    const date = new Date(a)
    const compDate = new Date(b)

    return date.getFullYear() == compDate.getFullYear() && date.getMonth() == compDate.getMonth()
  }


  return incomes.value.filter(
    (item) =>
      (item.description.toLowerCase().includes(searchLower) ||
      item.symbol.toLowerCase().includes(searchLower) ||
      item.amount.toString().toLowerCase().includes(searchLower)) &&
    item.symbol.toLowerCase().includes(currencySymbol) &&
    compareDate(item.date.toLowerCase(),dateOption.value.toLowerCase())
  )

})

function resetSearch() {
  searchQuery.value = ''
  dateOption.value = getToday()
  option.value = 1
}

const openModal = ref(false)

const income = reactive({
  symbol: 0,
  date: getToday(),
  amount: 0.0,
  description: '',
})

async function handleIncomeCreation(){
  const response = await Post("/api/income",income)
  if (!response.ok) {
    showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
  }else if(!response.data.ok){
    showToast("Server rejected request", 'error')
  }else{
    showToast('Income was added successfully','success')
    income.symbol = ''
    income.amount = 0.0
    income.description = ''
    income.date = getToday()
  }
}
</script>

<template>
  <Toast />
    <LoadingSpinner v-if="(isLoading.income && isLoading.currencies)" :isLoading="isLoading.income && isLoading.currencies" />

  <ErrorServer v-else-if="hasErrors.currencies || hasErrors.income" errorMessage="An Error has occured on the server" :retry="() =>
    {
    isLoading.currencies = true
    isLoading.income = true
    getCurrencies()
    getIncomes()
  }"/>

  <div v-else>
  <h1>Income View</h1>
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
          <CurrencyDropdown v-model="option" label="currencies" :data="currency" />
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
<NoValue v-if="filteredData.length === 0" size="text-3xl" text="You don't have any income added.
      Make sure to add your sources of income"/>
  <TableGen
      v-else
      :total="filteredData.reduce((acc,i)=> acc + i.amount,0)"
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
        v-model="income.description"
        type="text"
        placeholder="Description"
        class="w-full mb-3 p-2 border border-gray-300 rounded"
      />
      <input
        v-model="income.amount"
        type="text"
        placeholder="Amount"
        class="w-full mb-3 p-2 border border-gray-300 rounded"
      />
      <div class="flex mb-3 gap-1 w-full">
        <div class="w-full flex items-end">
          <MonthlyCalendar v-model="income.date" name="calendar" :getToday="getToday" />
        </div>
        <div class="w-20 flex items-end">
          <CurrencyDropdown v-model="income.amount" label="currencies" :data="currency" />
        </div>
      </div>
      <button
        @click="handleIncomeCreation"
        class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 active:bg-green-700 transition"
      >
        Confirm
      </button>
    </div>
  </Modal>
</div>
</template>

<style scoped></style>
