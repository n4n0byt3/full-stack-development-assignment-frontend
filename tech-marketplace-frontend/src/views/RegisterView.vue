<!-- src/views/RegisterView.vue -->
<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/40">
      <h1 class="text-xl font-semibold text-slate-50 mb-1">
        Create an account
      </h1>
      <p class="text-xs text-slate-400 mb-6">
        Sign up to start selling and bidding on tech.
      </p>

      <div
        v-if="formError"
        class="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-200"
      >
        {{ formError }}
      </div>

      <form @submit.prevent="onSubmit" class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-[11px] font-medium text-slate-300">First name</label>
            <input
              v-model.trim="firstName"
              type="text"
              required
              class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
            />
          </div>
          <div>
            <label class="mb-1 block text-[11px] font-medium text-slate-300">Last name</label>
            <input
              v-model.trim="lastName"
              type="text"
              required
              class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
            />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-300">Email</label>
          <input
            v-model.trim="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                   placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
        </div>

        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-300">Password</label>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            required
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                   placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
          <p class="mt-1 text-[10px] text-slate-500">
            8–20 chars, with at least one number and both upper & lower case letters.
          </p>
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-3 py-2
                 text-sm font-medium text-white shadow-md shadow-indigo-500/40 transition
                 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="!submitting">Create account</span>
          <span v-else>Creating…</span>
        </button>
      </form>

      <p class="mt-4 text-[11px] text-slate-500">
        Already have an account?
        <RouterLink to="/login" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
          Sign in
        </RouterLink>
        .
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '../api'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const submitting = ref(false)
const formError = ref<string | null>(null)

async function onSubmit() {
  formError.value = null

  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    formError.value = 'Please fill in all fields.'
    return
  }

  submitting.value = true
  try {
    // create user
    await api.post('/users', {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
    })

    // immediately log in
    await login(email.value, password.value)
    router.push('/')
  } catch (err: any) {
    const msg =
      err?.response?.data?.error_message ||
      'Registration failed. Please check your details and try again.'
    formError.value = msg
  } finally {
    submitting.value = false
  }
}
</script>
