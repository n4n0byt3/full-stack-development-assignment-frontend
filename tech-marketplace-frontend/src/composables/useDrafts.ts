// src/composables/useDrafts.ts
import { ref } from 'vue';

export interface ItemDraft {
  id: string;
  name: string;
  description: string;
  starting_bid: number;
  end_date: number | string | null;
  categoriesInput: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'itemDrafts';

function loadDraftsFromStorage(): ItemDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ItemDraft[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

const drafts = ref<ItemDraft[]>(loadDraftsFromStorage());

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts.value));
}

export function useDrafts() {
  function createDraft(data: {
    name?: string;
    description?: string;
    starting_bid?: number;
    end_date?: number | string | null;
    categoriesInput?: string;
  }): ItemDraft {
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const draft: ItemDraft = {
      id,
      name: data.name ?? '',
      description: data.description ?? '',
      starting_bid: data.starting_bid ?? 0,
      end_date: data.end_date ?? null,
      categoriesInput: data.categoriesInput ?? '',
      createdAt: now,
      updatedAt: now,
    };

    drafts.value.unshift(draft);
    saveToStorage();
    return draft;
  }

  // allow partial updates, but we will force id/createdAt to stay the same
  function updateDraft(id: string, updates: Partial<ItemDraft>): void {
    const idx = drafts.value.findIndex((d) => d.id === id);
    if (idx === -1) return;

    const current = drafts.value[idx];
    if (!current) return;
 
    const next: ItemDraft = {
      ...current,
      // ensure these *cannot* be changed / become undefined
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
 
    // Apply updates only when defined to avoid assigning undefined to required fields
    if (updates.name !== undefined) next.name = updates.name;
    if (updates.description !== undefined) next.description = updates.description;
    if (updates.starting_bid !== undefined) next.starting_bid = updates.starting_bid;
    if (updates.end_date !== undefined) next.end_date = updates.end_date;
    if (updates.categoriesInput !== undefined) next.categoriesInput = updates.categoriesInput;
 
    drafts.value[idx] = next;
    saveToStorage();
  }

  function deleteDraft(id: string): void {
    drafts.value = drafts.value.filter((d) => d.id !== id);
    saveToStorage();
  }

  function clearDrafts(): void {
    drafts.value = [];
    saveToStorage();
  }

  function getDraftById(id: string): ItemDraft | null {
    return drafts.value.find((d) => d.id === id) ?? null;
  }

  return {
    drafts,
    createDraft,
    updateDraft,
    deleteDraft,
    clearDrafts,
    getDraftById,
  };
}
