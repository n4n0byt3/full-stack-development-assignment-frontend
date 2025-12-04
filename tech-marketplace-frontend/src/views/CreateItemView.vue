<template>
  <div class="mx-auto max-w-3xl px-4 py-6">
    <h1 class="mb-1 text-lg font-semibold text-slate-50">Create a new auction</h1>
    <p class="mb-5 text-xs text-slate-400">
      Fill in the details below to list your item.
    </p>

    <div
      v-if="formError"
      class="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-200"
    >
      {{ formError }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="mb-1 block text-[11px] font-medium text-slate-300">Name</label>
        <input
          v-model.trim="name"
          type="text"
          required
          class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          placeholder="e.g. Mechanical keyboard, 65%, hot-swappable"
        />
      </div>

      <div>
        <label class="mb-1 block text-[11px] font-medium text-slate-300">Description</label>
        <!-- ✅ not self-closing -->
        <textarea
          v-model.trim="description"
          required
          rows="4"
          class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          placeholder="Describe the condition, specs, and anything bidders should know."
        ></textarea>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-300">Starting bid (£)</label>
          <input
            v-model.number="startingBid"
            type="number"
            min="0"
            required
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                   placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
        </div>

        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-300">
            End date &amp; time
          </label>
          <input
            v-model="endDate"
            type="datetime-local"
            required
            class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
          />
          <p class="mt-1 text-[10px] text-slate-500">
            Must be in the future.
          </p>
        </div>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-xs font-medium
               text-white shadow shadow-indigo-500/40 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span v-if="!submitting">Create auction</span>
        <span v-else>Creating…</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api' 

const router = useRouter()

const name = ref('')
const description = ref('')
const startingBid = ref<number | null>(0)
const endDate = ref('')

const submitting = ref(false)
const formError = ref<string | null>(null)

async function onSubmit() {
  formError.value = null

  if (!name.value || !description.value || startingBid.value == null || !endDate.value) {
    formError.value = 'Please fill in all fields.'
    return
  }

  const payload = {
    name: name.value,
    description: description.value,
    starting_bid: startingBid.value,
    end_date: endDate.value, // backend will parse string
  }

  submitting.value = true
  try {
    const res = await api.post<{ item_id: number }>('/item', payload)
    router.push(`/item/${res.data.item_id}`)
  } catch (err: any) {
    const msg =
      err?.response?.data?.error_message ||
      'Failed to create auction. Please check your inputs.'
    formError.value = msg
  } finally {
    submitting.value = false
  }
}
</script>
