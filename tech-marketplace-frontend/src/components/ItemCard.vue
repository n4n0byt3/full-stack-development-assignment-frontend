<!-- src/components/ItemCard.vue -->
<template>
  <RouterLink
    :to="`/item/${item.item_id}`"
    class="group flex flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs
           hover:border-indigo-500/60 hover:bg-slate-900 transition-colors"
  >
    <div class="mb-2 flex items-start justify-between gap-2">
      <h3 class="line-clamp-2 text-[13px] font-semibold text-slate-50 group-hover:text-indigo-300">
        {{ item.name }}
      </h3>
    </div>

    <p class="mb-3 line-clamp-2 text-[11px] text-slate-400">
      {{ item.description }}
    </p>

    <div class="mt-auto flex items-center justify-between text-[11px] text-slate-500">
      <span>Item #{{ item.item_id }}</span>
      <span>
        Ends
        <time :datetime="endDateIso">
          {{ formattedEnd }}
        </time>
      </span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { ItemSummary } from '../types'

const props = defineProps<{
  item: ItemSummary
}>()

const endDateIso = computed(() => new Date(props.item.end_date).toISOString())

const formattedEnd = computed(() => {
  const d = new Date(props.item.end_date)
  if (Number.isNaN(d.getTime())) return 'unknown'
  return d.toLocaleString()
})
</script>
