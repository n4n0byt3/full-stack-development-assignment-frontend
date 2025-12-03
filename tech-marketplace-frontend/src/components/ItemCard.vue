<template>
  <div
    class="group rounded-xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/60 hover:bg-slate-900 transition-colors p-4 flex flex-col justify-between"
  >
    <div>
      <h3 class="text-sm font-semibold mb-1 line-clamp-2 group-hover:text-cyan-300">
        {{ item.name }}
      </h3>
      <p class="text-xs text-slate-400 line-clamp-3 mb-2">
        {{ item.description }}
      </p>
    </div>

    <div class="mt-3 flex items-center justify-between text-xs">
      <div class="flex flex-col">
        <span class="text-slate-400">Ends</span>
        <span class="font-mono text-slate-200">
          {{ new Date(item.end_date).toLocaleString() }}
        </span>
      </div>
      <RouterLink
        :to="`/item/${item.item_id}`"
        class="px-3 py-1 rounded-md bg-cyan-500 text-slate-900 font-semibold text-xs hover:bg-cyan-400"
      >
        View
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiItemSummary } from '../api';
import { RouterLink } from 'vue-router';

defineProps<{
  item: ApiItemSummary;
}>();
</script>
