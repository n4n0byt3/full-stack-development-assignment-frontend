<!-- src/App.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top nav -->
    <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
            <span class="h-3 w-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/50" />
          </span>
          <span class="text-lg font-semibold tracking-tight">
            Tech<span class="text-indigo-400">Market</span>
          </span>
        </div>
        <nav class="flex items-center gap-4 text-sm text-slate-300">
          <span class="hidden sm:inline">Signed out</span>
        </nav>
      </div>
    </header>

    <!-- Main router view -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// nothing yet, simple shell
</script>
