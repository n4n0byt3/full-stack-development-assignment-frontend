import { ref, computed } from 'vue';
import { apiLogin, apiLogout, ApiLoginResponse } from '../api';

const userId = ref<string | null>(localStorage.getItem('user_id'));
const token = ref<string | null>(localStorage.getItem('session_token'));

export function useAuth() {
  const isLoggedIn = computed<boolean>(() => !!token.value);

  async function login(credentials: { email: string; password: string }): Promise<ApiLoginResponse> {
    const data = await apiLogin(credentials);
    userId.value = String(data.user_id);
    token.value = data.session_token;
    return data;
  }

  async function logout(): Promise<void> {
    await apiLogout();
    userId.value = null;
    token.value = null;
  }

  return {
    userId,
    token,
    isLoggedIn,
    login,
    logout,
  };
}
