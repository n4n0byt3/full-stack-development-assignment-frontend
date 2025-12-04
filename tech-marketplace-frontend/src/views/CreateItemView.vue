<!-- src/views/CreateItemView.vue -->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-semibold text-slate-50">Create a new auction</h1>
        <p class="text-xs text-slate-400">
          Fill in the details below to list your item.
        </p>
      </div>

      <RouterLink
        to="/"
        class="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800"
      >
        ← Back to listings
      </RouterLink>
    </div>

    <div class="grid gap-6 md:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
      <!-- Form column -->
      <div>
        <div
          v-if="formError"
          class="mb-4 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-200"
        >
          {{ formError }}
        </div>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <!-- Name -->
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

          <!-- Description -->
          <div>
            <label class="mb-1 block text-[11px] font-medium text-slate-300">Description</label>
            <textarea
              v-model.trim="description"
              required
              rows="4"
              class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              placeholder="Describe the condition, specs, and anything bidders should know."
            />
          </div>

          <!-- Price + end date -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1 block text-[11px] font-medium text-slate-300">
                Starting bid (£)
              </label>
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

          <!-- Categories (Extension: backend categories) -->
          <div>
            <label class="mb-1 block text-[11px] font-medium text-slate-300">
              Categories (optional)
            </label>
            <input
              v-model="categoriesInput"
              type="text"
              class="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-100
                     placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
              placeholder="e.g. keyboard, mechanical, 65%, hot-swap"
            />
            <p class="mt-1 text-[10px] text-slate-500">
              Separate categories with commas. These will appear as filters on the home page.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="submit"
              :disabled="submitting"
              class="inline-flex items-center rounded-lg bg-indigo-500 px-4 py-2 text-xs font-medium
                     text-white shadow shadow-indigo-500/40 hover:bg-indigo-400 disabled:cursor-not-allowed
                     disabled:opacity-60"
            >
              <span v-if="!submitting">Create auction</span>
              <span v-else>Creating…</span>
            </button>

            <button
              type="button"
              class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200
                     hover:bg-slate-800"
              @click="handleSaveDraft"
            >
              Save as draft
            </button>

            <button
              type="button"
              class="rounded-lg border border-slate-800 bg-transparent px-3 py-1.5 text-[11px] text-slate-400
                     hover:border-slate-600 hover:text-slate-200"
              @click="clearForm"
            >
              Clear form
            </button>

            <span v-if="activeDraftLabel" class="text-[10px] text-slate-500">
              Editing draft: {{ activeDraftLabel }}
            </span>
          </div>
        </form>
      </div>

      <!-- Drafts column (Extension: frontend drafts) -->
      <aside class="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
        <div class="flex items-center justify-between gap-2">
          <h2 class="text-sm font-semibold text-slate-50">Saved drafts</h2>
          <button
            type="button"
            class="text-[10px] text-slate-400 hover:text-red-300"
            v-if="drafts.length"
            @click="clearDrafts"
          >
            Clear all
          </button>
        </div>

        <p v-if="drafts.length === 0" class="text-[11px] text-slate-500">
          You don’t have any saved drafts yet. Use “Save as draft” to quickly store unfinished
          listings in your browser.
        </p>

        <ul v-else class="space-y-2 max-h-72 overflow-y-auto">
          <li
            v-for="d in drafts"
            :key="d.id"
            class="flex items-start justify-between gap-2 rounded-lg bg-slate-900/70 p-2"
          >
            <div class="min-w-0">
              <p class="truncate text-[11px] font-medium text-slate-100">
                {{ d.name || 'Untitled draft' }}
              </p>
              <p class="truncate text-[10px] text-slate-500">
                {{ formatDraftTimestamp(d.updatedAt) }}
              </p>
            </div>

            <div class="flex flex-col items-end gap-1">
              <button
                type="button"
                class="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-100 hover:bg-indigo-500/90"
                @click="loadDraft(d.id)"
              >
                Load
              </button>
              <button
                type="button"
                class="text-[10px] text-red-300 hover:text-red-200"
                @click="deleteDraft(d.id)"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>

        <p class="mt-2 text-[10px] text-slate-500">
          Drafts are stored locally in this browser only and won’t affect your backend tests.
        </p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { createItem } from '../api'
import type { CreateItemRequest } from '../types'
import { useDrafts } from '../composables/useDrafts'

const router = useRouter()

// Form state
const name = ref('')
const description = ref('')
const startingBid = ref<number | null>(0)
const endDate = ref('') // datetime-local string
const categoriesInput = ref('')

// Submission state
const submitting = ref(false)
const formError = ref<string | null>(null)

// Drafts composable
const { drafts, createDraft, updateDraft, deleteDraft, clearDrafts, getDraftById } = useDrafts()
const activeDraftId = ref<string | null>(null)

const activeDraftLabel = computed(() => {
  if (!activeDraftId.value) return ''
  const d = getDraftById(activeDraftId.value)
  return d ? d.name || 'Untitled draft' : ''
})

function parseCategories(): string[] | undefined {
  const raw = categoriesInput.value.trim()
  if (!raw) return undefined
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  return parts.length ? parts : undefined
}

function clearForm() {
  name.value = ''
  description.value = ''
  startingBid.value = 0
  endDate.value = ''
  categoriesInput.value = ''
  formError.value = null
  activeDraftId.value = null
}

function formatDraftTimestamp(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Unknown'
  return d.toLocaleString()
}

function handleSaveDraft() {
  const baseData = {
    name: name.value,
    description: description.value,
    starting_bid: startingBid.value ?? 0,
    end_date: endDate.value || null,
    categoriesInput: categoriesInput.value,
  }

  if (!activeDraftId.value) {
    const draft = createDraft(baseData)
    activeDraftId.value = draft.id
  } else {
    updateDraft(activeDraftId.value, baseData)
  }
}

function loadDraft(id: string) {
  const d = getDraftById(id)
  if (!d) return
  activeDraftId.value = d.id
  name.value = d.name
  description.value = d.description
  startingBid.value = d.starting_bid
  endDate.value = typeof d.end_date === 'string' ? d.end_date : ''
  categoriesInput.value = d.categoriesInput
  formError.value = null
}

async function onSubmit() {
  formError.value = null

  if (!name.value || !description.value || startingBid.value == null || !endDate.value) {
    formError.value = 'Please fill in all required fields.'
    return
  }

  // Build payload according to backend schema
  const payload: CreateItemRequest = {
    name: name.value,
    description: description.value,
    starting_bid: startingBid.value,
    end_date: endDate.value, // backend will parse
  }

  const cats = parseCategories()
  if (cats) {
    payload.categories = cats
  }

  submitting.value = true
  try {
    const res = await createItem(payload)
    // If we were editing a draft, we can optionally remove it now
    if (activeDraftId.value) {
      deleteDraft(activeDraftId.value)
      activeDraftId.value = null
    }
    clearForm()
    router.push(`/item/${res.item_id}`)
  } catch (err) {
    const msg =
      err?.response?.data?.error_message ||
      'Failed to create auction. Please check your inputs.'
    formError.value = msg
  } finally {
    submitting.value = false
  }
}
</script>
