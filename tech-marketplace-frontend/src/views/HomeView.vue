<!-- src/views/HomeView.vue -->
<template>
  <div class="mx-auto max-w-6xl px-4 py-6">
    <!-- Heading + actions -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-semibold text-slate-50">Marketplace</h1>
        <p class="text-xs text-slate-400">
          Discover and bid on tech items.
        </p>
      </div>

      <RouterLink
        v-if="isAuthenticated"
        to="/sell"
        class="inline-flex items-center rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium
               text-white shadow shadow-indigo-500/40 hover:bg-indigo-400"
      >
        + Post an item
      </RouterLink>
    </div>

    <div class="grid gap-6 md:grid-cols-[220px,1fr]">
      <!-- Sidebar -->
      <aside class="space-y-4">
        <!-- Search -->
        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-300">
            Search items
          </label>
          <div class="flex gap-1">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search by name or description..."
              class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-100
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              @keyup.enter="loadItems"
            />
            <button
              type="button"
              class="rounded-lg bg-slate-800 px-2 text-xs text-slate-100 hover:bg-slate-700"
              @click="loadItems"
            >
              Go
            </button>
          </div>
        </div>

        <!-- Status filter -->
        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-300">
            Status
          </label>
          <select
            v-model="status"
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-100
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
            @change="loadItems"
          >
            <option value="">All</option>
            <option value="OPEN">My open auctions</option>
            <option value="BID">Auctions I’m bidding on</option>
            <option value="ARCHIVE">My ended auctions</option>
          </select>
          <p class="mt-1 text-[10px] text-slate-500">
            OPEN/BID/ARCHIVE filters require login.
          </p>
        </div>

        <!-- Categories -->
        <div>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-[11px] font-medium text-slate-300">Categories</span>
            <button
              type="button"
              class="text-[10px] text-indigo-400 hover:text-indigo-300"
              @click="clearCategoryFilter"
              v-if="selectedCategories.length"
            >
              Clear
            </button>
          </div>
          <div class="max-h-60 space-y-1 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/60 p-2">
            <p v-if="loadingCategories" class="text-[11px] text-slate-500">
              Loading categories…
            </p>
            <p v-else-if="categories.length === 0" class="text-[11px] text-slate-500">
              No categories yet.
            </p>
            <label
              v-for="cat in categories"
              :key="cat.category_id"
              class="flex items-center gap-2 text-[11px] text-slate-300"
            >
              <input
                type="checkbox"
                class="h-3 w-3 rounded border-slate-600 bg-slate-900 text-indigo-500"
                :value="cat.category_id"
                v-model="selectedCategories"
                @change="loadItems"
              />
              <span>{{ cat.name }}</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Grid -->
      <section>
        <div class="mb-2 flex items-center justify-between text-[11px] text-slate-500">
          <span v-if="loadingItems">Loading items…</span>
          <span v-else>Showing {{ items.length }} items</span>
        </div>

        <div
          v-if="!loadingItems && items.length === 0"
          class="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center text-xs text-slate-400"
        >
          No items found. Try adjusting your search or filters.
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in items"
            :key="item.item_id"
            class="group flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs
                   shadow-sm shadow-black/30 transition hover:border-indigo-500/80 hover:shadow-indigo-500/30"
          >
            <h2 class="mb-1 line-clamp-2 text-sm font-semibold text-slate-50">
              {{ item.name }}
            </h2>
            <p class="mb-2 line-clamp-3 text-[11px] text-slate-400">
              {{ item.description }}
            </p>

            <dl class="mt-auto space-y-1 text-[11px] text-slate-400">
              <div class="flex justify-between">
                <dt>Starts:</dt>
                <dd>{{ formatDate(item.start_date) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt>Ends:</dt>
                <dd>{{ formatDate(item.end_date) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt>Seller:</dt>
                <dd>
                  <RouterLink
                    :to="`/users/${item.creator_id}`"
                    class="text-indigo-400 hover:text-indigo-300"
                  >
                    {{ item.first_name }} {{ item.last_name }}
                  </RouterLink>
                </dd>
              </div>
            </dl>

            <RouterLink
              :to="`/item/${item.item_id}`"
              class="mt-3 inline-flex items-center justify-center rounded-lg bg-slate-800 px-3 py-1.5
                     text-[11px] font-medium text-slate-50 hover:bg-indigo-500/90"
            >
              View details
            </RouterLink>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { fetchCategories, searchItems } from '../api'
import type { Category, ItemSummary, CategoryFilterParams } from '../types'

const { isAuthenticated } = useAuth()

const searchQuery = ref('')
const status = ref<'' | CategoryFilterParams['status']>('')

const items = ref<ItemSummary[]>([])
const loadingItems = ref(false)

const categories = ref<Category[]>([])
const loadingCategories = ref(false)
const selectedCategories = ref<number[]>([])

function formatDate(ts: number) {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return 'Unknown'
  return d.toLocaleString()
}

async function loadCategories() {
  loadingCategories.value = true
  try {
    categories.value = await fetchCategories()
  } catch (e) {
    console.error('Failed to load categories', e)
  } finally {
    loadingCategories.value = false
  }
}

function buildCategoryQuery(): string | undefined {
  if (!selectedCategories.value.length) return undefined
  return selectedCategories.value.join(',')
}

async function loadItems() {
  loadingItems.value = true
  try {
    const params: CategoryFilterParams = {
      limit: 30,
      offset: 0,
    }

    if (searchQuery.value.trim()) {
      params.q = searchQuery.value.trim()
    }

    if (status.value) {
      params.status = status.value
    }

    const cat = buildCategoryQuery()
    if (cat) {
      params.category_id = cat
    }

    items.value = await searchItems(params)
  } catch (e) {
    console.error('Failed to load items', e)
    items.value = []
  } finally {
    loadingItems.value = false
  }
}

function clearCategoryFilter() {
  selectedCategories.value = []
  loadItems()
}

onMounted(() => {
  loadCategories()
  loadItems()
})
</script>
