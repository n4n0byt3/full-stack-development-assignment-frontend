<!-- src/components/AuthControls.vue -->
<template>
  <div class="flex items-center gap-3">
    <span v-if="isLoggedIn" class="text-xs text-slate-400">
      Logged in as <span class="font-mono text-cyan-300">#{{ userId }}</span>
    </span>

    <RouterLink
      v-if="!isLoggedIn"
      to="/login"
      class="px-3 py-1.5 rounded-md bg-cyan-500 text-slate-900 text-xs font-semibold hover:bg-cyan-400 transition-colors"
    >
      Login / Register
    </RouterLink>

    <button
      v-else
      @click="handleLogout"
      class="px-3 py-1.5 rounded-md border border-slate-600 text-xs hover:border-cyan-400 hover:text-cyan-300 transition-colors"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { isLoggedIn, userId, logout } = useAuth();

async function handleLogout(): Promise<void> {
  try {
    await logout();
    router.push('/login');
  } catch (e) {
    console.error(e);
  }
}
</script>
