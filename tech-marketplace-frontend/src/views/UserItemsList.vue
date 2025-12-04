<!-- src/components/UserItemsList.vue -->
<template>
  <section class="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-sm font-semibold text-slate-50">{{ title }}</h2>
      <span class="text-[11px] text-slate-500">{{ items.length }} item(s)</span>
    </div>

    <div v-if="items.length === 0" class="text-[11px] text-slate-400">
      None.
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="it in items"
        :key="it.item_id"
        class="flex items-center justify-between rounded-lg bg-slate-900/80 px-3 py-2"
      >
        <div class="pr-2">
          <RouterLink
            :to="`/item/${it.item_id}`"
            class="text-[11px] font-medium text-indigo-300 hover:text-indigo-200"
          >
            {{ it.name }}
          </RouterLink>
          <p class="line-clamp-1 text-[10px] text-slate-500">
            {{ it.description }}
          </p>
        </div>
        <div class="text-[10px] text-slate-500">
          Ends: {{ formatDate(it.end_date) }}
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface UserItem {
  item_id: number
  name: string
  description: string
  end_date: number
  creator_id: number
  first_name: string
  last_name: string
}

interface Props {
  title: string
  items: UserItem[]
}

const props = defineProps<Props>()

function formatDate(ts: number) {
  return new Date(ts).toLocaleString()
}
</script>
