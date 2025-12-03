<!-- src/views/ItemDetailView.vue -->
<template>
  <div class="max-w-5xl mx-auto p-4 md:p-6 text-sm">
    <button
      class="mb-4 text-xs text-slate-400 hover:text-cyan-300"
      @click="$router.back()"
    >
      ← Back
    </button>

    <div v-if="loading" class="text-xs text-slate-400">Loading item...</div>
    <div v-else-if="!item" class="text-xs text-red-400">Item not found.</div>
    <div v-else class="space-y-6">
      <section class="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <h2 class="text-lg font-semibold mb-1">{{ item.name }}</h2>
            <p class="text-xs text-slate-400 mb-3">
              {{ item.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="cat in item.categories"
                :key="cat.category_id"
                class="px-2 py-1 rounded-full bg-slate-800 text-[10px] text-cyan-300 border border-cyan-500/40"
              >
                {{ cat.name }}
              </span>
            </div>
          </div>

          <div class="w-full md:w-64 border border-slate-800 rounded-xl bg-slate-950/60 p-4">
            <div class="text-xs text-slate-400 mb-1">Current price</div>
            <div class="text-2xl font-mono text-cyan-300 mb-2">
              {{ item.current_bid ?? item.starting_bid }}
            </div>

            <div class="text-[11px] text-slate-400 mb-3">
              Ends: {{ new Date(item.end_date).toLocaleString() }}
            </div>

            <form @submit.prevent="placeBid" class="space-y-2">
              <input
                v-model.number="bidAmount"
                type="number"
                min="0"
                step="1"
                placeholder="Your bid"
                class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                :disabled="bidding"
                class="w-full px-3 py-1.5 rounded-md bg-cyan-500 text-slate-900 text-xs font-semibold hover:bg-cyan-400 disabled:opacity-50"
              >
                {{ bidding ? 'Placing...' : 'Place bid' }}
              </button>
              <p v-if="bidError" class="text-[11px] text-red-400">
                {{ bidError }}
              </p>
              <p v-if="bidSuccess" class="text-[11px] text-emerald-400">
                {{ bidSuccess }}
              </p>
            </form>
          </div>
        </div>
      </section>

      <!-- Questions -->
      <section class="grid md:grid-cols-2 gap-4">
        <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 class="text-sm font-semibold mb-2">Questions</h3>
          <div v-if="questionsLoading" class="text-xs text-slate-400">Loading questions...</div>
          <div v-else-if="questions.length === 0" class="text-xs text-slate-500">
            No questions yet.
          </div>
          <div v-else class="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div
              v-for="q in questions"
              :key="q.question_id"
              class="border border-slate-800 rounded-lg p-3 text-xs bg-slate-950/60"
            >
              <p class="font-semibold mb-1">{{ q.question_text }}</p>
              <p v-if="q.answer_text" class="text-[11px] text-slate-300">
                <span class="text-cyan-300">Answer:</span> {{ q.answer_text }}
              </p>
              <p v-else class="text-[11px] text-slate-500">
                No answer yet.
              </p>

              <!-- Simple answer form for owner -->
              <div v-if="isItemOwner && !q.answer_text" class="mt-2">
                <form @submit.prevent="submitAnswer(q)">
                  <input
                    v-model="q._answerDraft"
                    type="text"
                    placeholder="Write an answer…"
                    class="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-[11px] focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    class="mt-1 px-2 py-1 rounded-md bg-cyan-500 text-slate-900 text-[10px] font-semibold hover:bg-cyan-400"
                  >
                    Answer
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 class="text-sm font-semibold mb-2">Ask a question</h3>
          <form @submit.prevent="submitQuestion" class="space-y-2 text-xs">
            <textarea
              v-model="questionText"
              rows="3"
              placeholder="Ask the seller something about this item…"
              class="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-500 resize-y"
            />
            <button
              type="submit"
              :disabled="questionSubmitting"
              class="px-3 py-1.5 rounded-md bg-cyan-500 text-slate-900 text-xs font-semibold hover:bg-cyan-400 disabled:opacity-50"
            >
              {{ questionSubmitting ? 'Sending...' : 'Send question' }}
            </button>
            <p v-if="questionError" class="text-[11px] text-red-400">
              {{ questionError }}
            </p>
            <p v-if="questionSuccess" class="text-[11px] text-emerald-400">
              {{ questionSuccess }}
            </p>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  apiGetItem,
  apiCreateBid,
  apiGetQuestions,
  apiAskQuestion,
  apiAnswerQuestion,
} from '../api';
import type { ApiItemDetail, ApiQuestion } from '../api';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const { userId, isLoggedIn } = useAuth();

const idProp = route.params.id;
const itemId = typeof idProp === 'string' ? Number(idProp) : Number(idProp?.[0]);

const item = ref<ApiItemDetail | null>(null);
const loading = ref<boolean>(false);

const bidAmount = ref<number | null>(null);
const bidding = ref<boolean>(false);
const bidError = ref<string>('');
const bidSuccess = ref<string>('');

type QuestionWithDraft = ApiQuestion & { _answerDraft: string };

const questions = ref<QuestionWithDraft[]>([]);
const questionsLoading = ref<boolean>(false);

const questionText = ref<string>('');
const questionSubmitting = ref<boolean>(false);
const questionError = ref<string>('');
const questionSuccess = ref<string>('');

const isItemOwner = computed<boolean>(() => {
  if (!item.value || !userId.value) return false;
  return Number(item.value.creator_id) === Number(userId.value);
});

async function loadItem(): Promise<void> {
  try {
    loading.value = true;
    item.value = await apiGetItem(itemId);
  } catch (e) {
    console.error(e);
    item.value = null;
  } finally {
    loading.value = false;
  }
}

async function loadQuestions(): Promise<void> {
  if (!item.value) return;
  try {
    questionsLoading.value = true;
    const list = await apiGetQuestions(item.value.item_id);
    questions.value = list.map((q) => ({ ...q, _answerDraft: '' }));
  } catch (e) {
    console.error(e);
    questions.value = [];
  } finally {
    questionsLoading.value = false;
  }
}

async function placeBid(): Promise<void> {
  if (!isLoggedIn.value) {
    bidError.value = 'You must be logged in to bid.';
    bidSuccess.value = '';
    return;
  }
  if (!bidAmount.value || Number(bidAmount.value) <= 0) {
    bidError.value = 'Please enter a valid bid amount.';
    bidSuccess.value = '';
    return;
  }
  try {
    bidding.value = true;
    bidError.value = '';
    bidSuccess.value = '';
    await apiCreateBid(itemId, bidAmount.value);
    bidSuccess.value = 'Bid placed successfully!';
    await loadItem();
  } catch (e) {
    const err = e as Error;
    bidError.value = err.message || 'Failed to place bid.';
  } finally {
    bidding.value = false;
  }
}

async function submitQuestion(): Promise<void> {
  if (!isLoggedIn.value) {
    questionError.value = 'You must be logged in to ask a question.';
    questionSuccess.value = '';
    return;
  }
  if (!questionText.value.trim()) {
    questionError.value = 'Question text cannot be empty.';
    questionSuccess.value = '';
    return;
  }
  try {
    questionSubmitting.value = true;
    questionError.value = '';
    questionSuccess.value = '';
    await apiAskQuestion(itemId, questionText.value.trim());
    questionText.value = '';
    questionSuccess.value = 'Question sent!';
    await loadQuestions();
  } catch (e) {
    const err = e as Error;
    questionError.value = err.message || 'Failed to send question.';
  } finally {
    questionSubmitting.value = false;
  }
}

async function submitAnswer(q: QuestionWithDraft): Promise<void> {
  if (!isItemOwner.value) return;
  if (!q._answerDraft || !q._answerDraft.trim()) return;
  try {
    await apiAnswerQuestion(q.question_id, q._answerDraft.trim());
    await loadQuestions();
  } catch (e) {
    console.error(e);
  }
}

onMounted(async () => {
  await loadItem();
  await loadQuestions();
});
</script>
