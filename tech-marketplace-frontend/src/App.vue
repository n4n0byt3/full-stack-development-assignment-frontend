<!-- src/App.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top nav -->
    <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <RouterLink to="/" class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
              <span class="h-3 w-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/50" />
            </span>
            <span class="text-lg font-semibold tracking-tight">
              Tech<span class="text-indigo-400">Market</span>
            </span>
          </RouterLink>
        </div>

        <nav class="flex items-center gap-3 text-sm text-slate-300">
          <RouterLink
            to="/drafts"
            class="hidden sm:inline-flex items-center rounded-md px-2 py-1 hover:bg-slate-900/80"
          >
            Drafts
          </RouterLink>

          <template v-if="isAuthenticated">
            <span class="hidden sm:inline text-slate-400">
              User #{{ userId }}
            </span>
            <button
              class="rounded-md bg-slate-800 px-3 py-1 text-xs font-medium hover:bg-slate-700"
              @click="handleLogout"
            >
              Logout
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="rounded-md px-3 py-1 text-xs font-medium hover:bg-slate-900/80"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-md bg-indigo-500 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-400"
            >
              Register
            </RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <!-- Main router view -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const { isAuthenticated, userId, logout } = useAuth()

async function handleLogout() {
  await logout()
  router.push('/')
}
</script>
