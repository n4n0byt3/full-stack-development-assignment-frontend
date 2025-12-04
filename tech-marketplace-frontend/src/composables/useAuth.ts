// src/composables/useAuth.ts
import { computed, ref } from 'vue'
import api from '../api'

const userId = ref<number | null>(null)
const sessionToken = ref<string | null>(null)

const isAuthenticated = computed(() => !!sessionToken.value)

// ✅ NEW: expose currentUserId as a computed
const currentUserId = computed(() => userId.value)

export function useAuth() {
  async function login(email: string, password: string) {
    const res = await api.post<{ user_id: number; session_token: string }>('/login', {
      email,
      password,
    })

    userId.value = res.data.user_id
    sessionToken.value = res.data.session_token

    api.defaults.headers.common['X-Authorization'] = res.data.session_token
  }

  async function logout() {
    try {
      if (sessionToken.value) {
        await api.post('/logout')
      }
    } catch {
      // ignore
    } finally {
      userId.value = null
      sessionToken.value = null
      delete api.defaults.headers.common['X-Authorization']
    }
  }

  return {
    userId,
    sessionToken,
    isAuthenticated,
    currentUserId,
    login,
    logout,
  }
}
