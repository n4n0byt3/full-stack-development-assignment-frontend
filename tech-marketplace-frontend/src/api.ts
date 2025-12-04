// src/api.ts
import axios, { AxiosHeaders } from 'axios'
import type {
  Category,
  ItemSummary,
  ItemDetail,
  LoginResponse,
  CreateItemRequest,
  CategoryFilterParams,
} from './types'

// Change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:3333'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Attach token from localStorage (simple for now)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token')
  if (token) {
    const headerName = 'X-Authorization'
    // Ensure headers exists and is typed correctly with Axios v1
    if (!config.headers) {
      config.headers = new AxiosHeaders()
    }
    if (typeof (config.headers as any).set === 'function') {
      ;(config.headers as any).set(headerName, token)
    } else {
      ;(config.headers as Record<string, any>)[headerName] = token
    }
  }
  return config
})

// --- Auth ---

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/login', { email, password })
  return res.data
}

export async function logout(): Promise<void> {
  await api.post('/logout')
}

// --- Categories ---

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>('/categories')
  return res.data
}

// --- Items ---

export async function searchItems(params: CategoryFilterParams = {}): Promise<ItemSummary[]> {
  const res = await api.get<ItemSummary[]>('/search', { params })
  return res.data
}

export async function getItemById(itemId: number): Promise<ItemDetail> {
  const res = await api.get<ItemDetail>(`/item/${itemId}`)
  return res.data
}

export async function createItem(payload: CreateItemRequest): Promise<{ item_id: number }> {
  const res = await api.post<{ item_id: number }>('/item', payload)
  return res.data
}

export default api
