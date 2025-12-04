<!-- src/components/NavBar.vue -->
<template>
  <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <!-- Brand -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 text-sm font-semibold text-slate-100"
      >
        <span
          class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white"
        >
          TM
        </span>
        <span>Tech Marketplace</span>
      </RouterLink>

      <!-- Right section -->
      <div class="flex items-center gap-3 text-xs">
        <RouterLink
          v-if="isAuthenticated"
          to="/sell"
          class="hidden sm:inline-flex items-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5
                 font-medium text-slate-100 hover:border-indigo-500 hover:text-indigo-300"
        >
          Sell an item
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated && currentUserId"
          :to="`/users/${currentUserId}`"
          class="text-slate-400 hover:text-indigo-300"
        >
          User #{{ currentUserId }}
        </RouterLink>

        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-100
                 hover:bg-slate-700"
        >
          Logout
        </button>

        <RouterLink
          v-else
          to="/login"
          class="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white
                 shadow shadow-indigo-500/40 hover:bg-indigo-400"
        >
          Login
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { isAuthenticated, logout, currentUserId } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/')
}
</script>
