<!-- src/views/HomeView.vue -->
<template>
  <div class="max-w-6xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-[260px,1fr]">
    <!-- Sidebar -->
    <aside class="space-y-4">
      <section class="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 class="text-sm font-semibold text-slate-200 mb-3">
          Categories
        </h2>
        <ul class="space-y-1 text-sm">
          <li v-for="cat in categories" :key="cat.id">
            <button
              class="w-full text-left px-2 py-1 rounded-md transition hover:bg-slate-800"
              :class="cat.id === selectedCategoryId ? 'bg-slate-800 text-indigo-300' : 'text-slate-300'"
              @click="selectedCategoryId = cat.id"
            >
              {{ cat.name }}
            </button>
          </li>
        </ul>
      </section>
    </aside>

    <!-- Main content -->
    <section class="space-y-4">
      <!-- Search bar -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div class="relative flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for phones, laptops, GPUs..."
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100
                   placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
            ⌕
          </span>
        </div>
        <button
          class="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium
                 text-white shadow-md shadow-indigo-500/40 transition hover:bg-indigo-400"
        >
          Search
        </button>
      </div>

      <!-- Products grid -->
      <div
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="item in mockItems"
          :key="item.id"
          class="group rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition
                 hover:border-indigo-500/70 hover:bg-slate-900"
        >
          <div class="mb-3 h-32 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span class="text-4xl">
              {{ item.emoji }}
            </span>
          </div>
          <h3 class="text-sm font-semibold text-slate-100 line-clamp-2">
            {{ item.name }}
          </h3>
          <p class="mt-1 text-xs text-slate-400 line-clamp-2">
            {{ item.description }}
          </p>
          <div class="mt-3 flex items-center justify-between text-xs">
            <span class="font-semibold text-indigo-300">
              £{{ item.startingBid.toFixed(2) }}
            </span>
            <span class="text-slate-500">
              Ends {{ item.endsIn }}
            </span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Category = { id: number | null; name: string }

const categories = ref<Category[]>([
  { id: null, name: 'All tech' },
  { id: 1, name: 'Phones' },
  { id: 2, name: 'Laptops' },
  { id: 3, name: 'PC Components' },
  { id: 4, name: 'Headphones & Audio' },
  { id: 5, name: 'Accessories' },
])

const selectedCategoryId = ref<number | null>(null)
const searchQuery = ref('')

const mockItems = ref([
  {
    id: 1,
    name: 'RTX 4070 Ti Gaming GPU',
    description: '12GB GDDR6X, perfect for 1440p high refresh gaming builds.',
    startingBid: 420,
    endsIn: 'in 3h',
    emoji: '🖥️',
  },
  {
    id: 2,
    name: 'M1 MacBook Air 16GB / 512GB',
    description: 'Ultra-portable dev machine with insane battery life.',
    startingBid: 650,
    endsIn: 'in 1d',
    emoji: '💻',
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Flagship ANC, amazing for deep work and travel.',
    startingBid: 220,
    endsIn: 'in 5h',
    emoji: '🎧',
  },
])
</script>
