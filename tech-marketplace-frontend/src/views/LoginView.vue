<!-- src/views/LoginView.vue -->
<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 class="text-lg font-semibold mb-1">
        {{ mode === 'login' ? 'Login' : 'Register' }}
      </h2>
      <p class="text-xs text-slate-400 mb-4">
        {{ mode === 'login'
          ? 'Sign in to manage your tech auctions.'
          : 'Create an account to start listing and bidding.' }}
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-3 text-sm">
        <div v-if="mode === 'register'" class="flex gap-2">
          <div class="flex-1">
            <label class="block text-xs text-slate-400 mb-1">First name</label>
            <input
              v-model="first_name"
              type="text"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div class="flex-1">
            <label class="block text-xs text-slate-400 mb-1">Last name</label>
            <input
              v-model="last_name"
              type="text"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-400 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label class="block text-xs text-slate-400 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <p v-if="error" class="text-xs text-red-400">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="submitting"
          class="w-full mt-2 px-3 py-2 rounded-md bg-cyan-500 text-slate-900 font-semibold text-sm hover:bg-cyan-400 disabled:opacity-50"
        >
          {{ submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register' }}
        </button>
      </form>

      <div class="mt-4 text-xs text-slate-400 flex justify-between">
        <button
          class="hover:text-cyan-300"
          @click="toggleMode"
        >
          {{ mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { apiRegister } from '../api';

const router = useRouter();
const { login } = useAuth();

type Mode = 'login' | 'register';

const mode = ref<Mode>('login');
const first_name = ref<string>('');
const last_name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const error = ref<string>('');
const submitting = ref<boolean>(false);

function toggleMode(): void {
  mode.value = mode.value === 'login' ? 'register' : 'login';
  error.value = '';
}

async function handleSubmit(): Promise<void> {
  submitting.value = true;
  error.value = '';
  try {
    if (mode.value === 'register') {
      await apiRegister({
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        password: password.value,
      });
    }

    await login({ email: email.value, password: password.value });
    router.push('/');
  } catch (e) {
    const err = e as Error;
    error.value = err.message || 'Something went wrong';
  } finally {
    submitting.value = false;
  }
}
</script>
