// src/api.ts

const API_BASE_URL = 'http://localhost:3000'; // adjust if needed

export interface ApiCategory {
  category_id: number;
  name: string;
}

export interface ApiItemSummary {
  item_id: number;
  name: string;
  description: string;
  start_date: number;
  end_date: number;
  creator_id: number;
  first_name: string;
  last_name: string;
}

export interface ApiBidHolder {
  user_id: number;
  first_name: string;
  last_name: string;
}

export interface ApiItemDetail {
  item_id: number;
  name: string;
  description: string;
  starting_bid: number;
  start_date: number;
  end_date: number;
  creator_id: number;
  first_name: string;
  last_name: string;
  current_bid: number | null;
  current_bid_holder: ApiBidHolder | null;
  categories: ApiCategory[];
}

export interface ApiQuestion {
  question_id: number;
  question_text: string;
  answer_text: string | null;
}

export interface ApiLoginResponse {
  user_id: number;
  session_token: string;
}

export interface ApiErrorBody {
  error_message?: string;
  [key: string]: unknown;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('session_token');
  return token ? { 'X-Authorization': token } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const text = await res.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const errBody = data as ApiErrorBody;
    const msg = errBody?.error_message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

// Auth
export function apiRegister(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}) {
  return request<{ user_id: number }>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiLogin(payload: {
  email: string;
  password: string;
}): Promise<ApiLoginResponse> {
  const data = await request<ApiLoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  localStorage.setItem('session_token', data.session_token);
  localStorage.setItem('user_id', String(data.user_id));

  return data;
}

export function apiLogout(): Promise<unknown> {
  return request<unknown>('/logout', {
    method: 'POST',
  }).finally(() => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_id');
  });
}

// Items
export function apiSearchItems(params: {
  q?: string;
  status?: string;
  limit?: number;
  offset?: number;
  categoryIds?: number[];
} = {}): Promise<ApiItemSummary[]> {
  const sp = new URLSearchParams();

  if (params.q) sp.set('q', params.q);
  if (params.status) sp.set('status', params.status);
  if (params.limit != null) sp.set('limit', String(params.limit));
  if (params.offset != null) sp.set('offset', String(params.offset));

  if (params.categoryIds && params.categoryIds.length > 0) {
    sp.set('category_id', params.categoryIds.join(','));
  }

  const qs = sp.toString();
  return request<ApiItemSummary[]>(`/search${qs ? `?${qs}` : ''}`);
}

export function apiGetItem(item_id: number): Promise<ApiItemDetail> {
  return request<ApiItemDetail>(`/item/${item_id}`);
}

export function apiCreateItem(payload: {
  name: string;
  description: string;
  starting_bid: number;
  end_date: number | string;
  categories?: string[];
}) {
  return request<{ item_id: number }>('/item', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Bids
export function apiCreateBid(item_id: number, amount: number) {
  return request<unknown>(`/item/${item_id}/bid`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export interface ApiBidHistoryRow {
  item_id: number;
  amount: number;
  timestamp: number;
  user_id: number;
  first_name: string | null;
  last_name: string | null;
}

export function apiGetBidHistory(item_id: number) {
  return request<ApiBidHistoryRow[]>(`/item/${item_id}/bid`);
}

// Questions
export function apiGetQuestions(item_id: number): Promise<ApiQuestion[]> {
  return request<ApiQuestion[]>(`/item/${item_id}/question`);
}

export function apiAskQuestion(item_id: number, question_text: string) {
  return request<unknown>(`/item/${item_id}/question`, {
    method: 'POST',
    body: JSON.stringify({ question_text }),
  });
}

export function apiAnswerQuestion(question_id: number, answer_text: string) {
  return request<unknown>(`/question/${question_id}`, {
    method: 'POST',
    body: JSON.stringify({ answer_text }),
  });
}

// Categories
export function apiGetCategories(): Promise<ApiCategory[]> {
  return request<ApiCategory[]>('/categories');
}
