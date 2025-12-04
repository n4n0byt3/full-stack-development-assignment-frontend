<!-- src/views/LoginView.vue -->
<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-black/40">
      <h1 class="text-xl font-semibold text-slate-50 mb-1">
        Welcome back
      </h1>
      <p class="text-xs text-slate-400 mb-6">
        Sign in to manage your auctions and bids.
      </p>

      <!-- Error banner -->
      <div
        v-if="formError"
        class="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-200"
      >
        {{ formError }}
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Email -->
        <div class="space-y-1">
          <label for="email" class="block text-xs font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100
                   placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
            placeholder="you@example.com"
          />
        </div>

        <!-- Password -->
        <div class="space-y-1">
          <label for="password" class="block text-xs font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100
                   placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
            placeholder="••••••••"
          />
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="submitting"
          class="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-3 py-2
                 text-sm font-medium text-white shadow-md shadow-indigo-500/40 transition
                 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="!submitting">Sign in</span>
          <span v-else>Signing in…</span>
        </button>
      </form>

      <p class="mt-4 text-[11px] text-slate-500">
        Don’t have an account?
        <RouterLink to="/register" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
          Create one
        </RouterLink>
        .
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const formError = ref<string | null>(null)

async function onSubmit() {
  formError.value = null

  if (!email.value || !password.value) {
    formError.value = 'Please enter both email and password.'
    return
  }

  submitting.value = true
  try {
    await login(email.value, password.value)

    // Optional redirect behaviour: /login?redirect=/something
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err: any) {
    const msg =
      err?.response?.data?.error_message ||
      'Login failed. Please check your email and password.'
    formError.value = msg
  } finally {
    submitting.value = false
  }
}
</script>
