<!-- src/components/SidebarFilters.vue -->
<template>
  <aside class="w-64 border-r border-slate-800 bg-slate-900/60 p-4 hidden md:block">
    <h2 class="text-sm font-semibold text-slate-200 mb-3">Categories</h2>
    <div v-if="loading" class="text-xs text-slate-500">Loading categories...</div>
    <div v-else class="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
      <button
        class="w-full text-left text-xs px-2 py-1 rounded-md transition-colors"
        :class="selectedIds.length === 0 ? 'bg-cyan-500/20 text-cyan-300' : 'hover:bg-slate-800'"
        @click="toggleAll"
      >
        All categories
      </button>

      <button
        v-for="cat in categories"
        :key="cat.category_id"
        class="w-full text-left text-xs px-2 py-1 rounded-md flex items-center justify-between transition-colors"
        :class="
          selectedIds.includes(cat.category_id)
            ? 'bg-cyan-500/20 text-cyan-300'
            : 'hover:bg-slate-800'
        "
        @click="toggle(cat.category_id)"
      >
        <span>{{ cat.name }}</span>
        <span v-if="selectedIds.includes(cat.category_id)" class="text-[10px] text-cyan-400">
          •
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ApiCategory } from '../api';

const props = defineProps<{
  categories: ApiCategory[];
  selectedIds: number[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:selectedIds', value: number[]): void;
}>();

function toggle(id: number): void {
  const set = new Set(props.selectedIds);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  emit('update:selectedIds', Array.from(set));
}

function toggleAll(): void {
  emit('update:selectedIds', []);
}
</script>
