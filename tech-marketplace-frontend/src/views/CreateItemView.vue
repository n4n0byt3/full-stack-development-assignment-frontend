<!-- src/views/CreateItemView.vue -->
<template>
  <div class="max-w-5xl mx-auto p-4 md:p-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Form -->
      <section class="flex-1">
        <h2 class="text-lg font-semibold mb-1">Create auction item</h2>
        <p class="text-xs text-slate-400 mb-4">
          Fill out the details and either save a local draft or publish directly to the API.
        </p>

        <form @submit.prevent="handlePublish()" class="space-y-3 text-sm">
          <div>
            <label class="block text-xs text-slate-400 mb-1">Name</label>
            <input
              v-model="name"
              type="text"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Description</label>
            <textarea
              v-model="description"
              rows="4"
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500 resize-y"
            />
          </div>

          <div class="flex gap-3">
            <div class="flex-1">
              <label class="block text-xs text-slate-400 mb-1">Starting bid</label>
              <input
                v-model.number="starting_bid"
                type="number"
                min="0"
                required
                class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div class="flex-1">
              <label class="block text-xs text-slate-400 mb-1">End date/time</label>
              <input
                v-model="end_date"
                type="datetime-local"
                required
                class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500"
              />
              <p class="text-[10px] text-slate-500 mt-1">
                Will be sent as a timestamp (ms) to the API.
              </p>
            </div>
          </div>

          <div>
            <label class="block text-xs text-slate-400 mb-1">Categories</label>
            <input
              v-model="categoriesInput"
              type="text"
              placeholder="e.g. GPU, Gaming, Accessories"
              class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            />
            <p class="text-[10px] text-slate-500 mt-1">
              Comma-separated. Items can have multiple categories.
            </p>
          </div>

          <p v-if="error" class="text-xs text-red-400">
            {{ error }}
          </p>
          <p v-if="success" class="text-xs text-emerald-400">
            {{ success }}
          </p>

          <div class="flex gap-3 mt-2">
            <button
              type="button"
              @click="handleSaveDraft"
              class="px-3 py-2 rounded-md border border-slate-700 text-xs hover:border-cyan-500"
            >
              Save draft locally
            </button>

            <button
              type="submit"
              :disabled="publishing"
              class="px-3 py-2 rounded-md bg-cyan-500 text-slate-900 text-xs font-semibold hover:bg-cyan-400 disabled:opacity-50"
            >
              {{ publishing ? 'Publishing...' : 'Publish to API' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Drafts list (Extension 3) -->
      <section class="w-full md:w-72">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold">Local drafts</h3>
          <button
            v-if="drafts.length > 0"
            @click="clearDrafts"
            class="text-[10px] text-slate-500 hover:text-red-400"
          >
            Clear all
          </button>
        </div>

        <div
          v-if="drafts.length === 0"
          class="text-xs text-slate-500 border border-dashed border-slate-700 rounded-lg p-3"
        >
          No drafts yet. Use “Save draft locally” to store items in browser storage (no API call).
        </div>

        <div
          v-else
          class="space-y-2 max-h-[60vh] overflow-y-auto pr-1"
        >
          <div
            v-for="d in drafts"
            :key="d.id"
            class="border border-slate-800 rounded-lg bg-slate-900/60 p-3 text-xs flex flex-col gap-1"
          >
            <div class="flex justify-between items-center">
              <div class="font-semibold truncate">{{ d.name || '(Untitled item)' }}</div>
              <button
                @click="deleteDraft(d.id)"
                class="text-[10px] text-slate-500 hover:text-red-400"
              >
                Delete
              </button>
            </div>
            <div class="text-[10px] text-slate-500">
              Updated: {{ new Date(d.updatedAt).toLocaleString() }}
            </div>

            <div class="mt-1 flex gap-2">
              <button
                @click="loadDraft(d)"
                class="flex-1 px-2 py-1 rounded-md border border-slate-700 hover:border-cyan-500"
              >
                Load into form
              </button>
              <button
                @click="handlePublish(d.id)"
                class="flex-1 px-2 py-1 rounded-md bg-cyan-500 text-slate-900 hover:bg-cyan-400"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { apiCreateItem } from '../api';
import { useDrafts, type ItemDraft } from '../composables/useDrafts';
import { useAuth } from '../composables/useAuth';

const { isLoggedIn } = useAuth();

const name = ref<string>('');
const description = ref<string>('');
const starting_bid = ref<number>(0);
const end_date = ref<string>('');
const categoriesInput = ref<string>('');

const error = ref<string>('');
const success = ref<string>('');
const publishing = ref<boolean>(false);

const { drafts, createDraft, deleteDraft, clearDrafts } = useDrafts();

function toCategoriesArray(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function formToPayload(): {
  name: string;
  description: string;
  starting_bid: number;
  end_date: number | null;
  categories: string[];
  categoriesInput: string;
} {
  const categories = toCategoriesArray(categoriesInput.value);
  const dt = end_date.value ? new Date(end_date.value) : null;
  const ts = dt && !Number.isNaN(dt.getTime()) ? dt.getTime() : null;

  return {
    name: name.value,
    description: description.value,
    starting_bid: starting_bid.value,
    end_date: ts,
    categories,
    categoriesInput: categoriesInput.value,
  };
}

function resetForm(): void {
  name.value = '';
  description.value = '';
  starting_bid.value = 0;
  end_date.value = '';
  categoriesInput.value = '';
}

// Save draft locally (Extension 3)
function handleSaveDraft(): void {
  const payload = formToPayload();
  createDraft(payload);
  success.value = 'Draft saved locally.';
  error.value = '';
}

function loadDraft(draft: ItemDraft): void {
  name.value = draft.name || '';
  description.value = draft.description || '';
  starting_bid.value = draft.starting_bid || 0;
  categoriesInput.value = draft.categoriesInput || '';

  if (draft.end_date) {
    const dt = new Date(draft.end_date);
    if (!Number.isNaN(dt.getTime())) {
      const iso = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      end_date.value = iso;
    }
  }
  success.value = 'Draft loaded into form.';
  error.value = '';
}

async function handlePublish(draftIdToDeleteIfAny?: string): Promise<void> {
  if (!isLoggedIn.value) {
    error.value = 'You must be logged in to publish.';
    success.value = '';
    return;
  }

  publishing.value = true;
  error.value = '';
  success.value = '';

  try {
    const payload = formToPayload();
    if (!payload.end_date) {
      throw new Error('Please choose a valid end date/time.');
    }

    await apiCreateItem({
      name: payload.name,
      description: payload.description,
      starting_bid: payload.starting_bid,
      end_date: payload.end_date,
      categories: payload.categories,
    });

    success.value = 'Item published successfully!';
    if (draftIdToDeleteIfAny) {
      deleteDraft(draftIdToDeleteIfAny);
    }
    resetForm();
  } catch (e) {
    const err = e as Error;
    error.value = err.message || 'Failed to publish item.';
  } finally {
    publishing.value = false;
  }
}
</script>
