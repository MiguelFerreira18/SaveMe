<script setup>
import { ref } from 'vue'
import { Post } from '@/lib/requests'
import { IsJWTExpired, SaveJwtFieldsToLocalStorage, ParseJwt } from '@/lib/jwtUtils'
import router from '@/router'
import { useToast } from '@/components/Toast/useToast'

const { showToast } = useToast()

const isLogin = ref(true)

const loginEmail = ref('')
const loginPassword = ref('')

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerRepeatPassword = ref('')

async function handleLogin() {
  if (!loginEmail.value || !loginPassword.value) {
    showToast('Please fill in all fields.', 'error')
    return
  }
  const response = await Post('/auth/public/login', {
    email: loginEmail.value,
    password: loginPassword.value,
  })

  if (!response.ok) {
    showToast('Login failed', 'error')
  } else {
    showToast('Login successful', 'success')
  }

  const user = await response.json()
  const authHeader = response.headers.get('authorization')

  if (authHeader && !IsJWTExpired(authHeader)) {
    localStorage.setItem('userId', user.id)
    localStorage.setItem('username', user.name)
    SaveJwtFieldsToLocalStorage(ParseJwt(authHeader))
    localStorage.setItem('token', authHeader)
  }
  setTimeout(() => {
    router.push('/home')
  }, 2000)
}

async function handleRegister() {
  if (
    !registerName.value ||
    !registerEmail.value ||
    !registerPassword.value ||
    !registerRepeatPassword.value
  ) {
    showToast('Please fill in all fields.', 'error')
    return
  }

  if (registerPassword.value !== registerRepeatPassword.value) {
    showToast('Passwords do not match.', 'error')
    return
  }

    const response = await Post('/auth/public/signup', {
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value,
      repeatPassword: registerRepeatPassword.value,
    })

    if (!response.ok) {
      showToast(`failed: ${response.error.message || 'Server unreachable'}`, 'error')
    }else if(!response.data.ok){
      showToast('Server rejected request','error')
    }else{
      showToast('Registration successful! Please login.', 'success')
      isLogin.value = true
      registerName.value = ''
      registerEmail.value = ''
      registerPassword.value = ''
      registerRepeatPassword.value = ''
    }
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-6 w-80">
      <div v-if="isLogin">
        <h2 class="text-2xl font-semibold mb-4 text-center">Login</h2>
        <input
          v-model="loginEmail"
          type="email"
          placeholder="Email"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          v-model="loginPassword"
          type="password"
          placeholder="Password"
          class="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          @click="handleLogin"
          class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
        <p class="mt-4 text-center text-sm text-gray-600">
          Don't have an account?
          <span @click="isLogin = false" class="text-blue-500 hover:underline cursor-pointer"
            >Register here</span
          >
        </p>
      </div>

      <div v-else>
        <h2 class="text-2xl font-semibold mb-4 text-center">Register</h2>
        <input
          v-model="registerName"
          type="text"
          placeholder="Name"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          v-model="registerEmail"
          type="email"
          placeholder="Email"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          v-model="registerPassword"
          type="password"
          placeholder="Password"
          class="w-full mb-3 p-2 border border-gray-300 rounded"
        />
        <input
          v-model="registerRepeatPassword"
          type="password"
          placeholder="Repeat Password"
          class="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <button
          @click="handleRegister"
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Confirm
        </button>
        <p class="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <span @click="isLogin = true" class="text-blue-500 hover:underline cursor-pointer"
            >Login here</span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped></style>
