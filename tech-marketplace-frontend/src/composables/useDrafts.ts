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
    const draft: ItemDraft = {
      id,
      name: data.name ?? '',
      description: data.description ?? '',
      starting_bid: data.starting_bid ?? 0,
      end_date: data.end_date ?? null,
      categoriesInput: data.categoriesInput ?? '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    drafts.value.unshift(draft);
    saveToStorage();
    return draft;
  }

  function updateDraft(id: string, updates: Partial<ItemDraft>): void {
    const idx = drafts.value.findIndex((d) => d.id === id);
    if (idx === -1) return;
    drafts.value[idx] = {
      ...drafts.value[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
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
