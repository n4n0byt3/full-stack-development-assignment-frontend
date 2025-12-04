// src/types.ts

// --- Core backend types (aligned with your API) ---

export interface Category {
  category_id: number
  name: string
}

export interface ItemSummary {
  item_id: number
  name: string
  description: string
  start_date: number
  end_date: number
  creator_id: number
  first_name: string
  last_name: string
}

export interface ItemDetail extends ItemSummary {
  starting_bid: number
  current_bid: number
  current_bid_holder: {
    user_id: number
    first_name: string
    last_name: string
  } | null
  categories: Category[]
}

export interface LoginResponse {
  user_id: number
  session_token: string
}

export interface CreateItemRequest {
  name: string
  description: string
  starting_bid: number
  end_date: number | string
  categories?: string[]
}

export interface CategoryFilterParams {
  q?: string
  status?: 'OPEN' | 'BID' | 'ARCHIVE'
  category_id?: string // comma-separated ids, e.g. "1,2"
  limit?: number
  offset?: number
}
