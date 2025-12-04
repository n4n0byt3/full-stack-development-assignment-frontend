<!-- src/views/ItemDetailView.vue -->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6" v-if="loaded">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-semibold text-slate-50">
          {{ item?.name }}
        </h1>
        <p class="text-[11px] text-slate-400">
          Listed by
          <RouterLink
            v-if="item"
            :to="`/users/${item.creator_id}`"
            class="text-indigo-400 hover:text-indigo-300"
          >
            {{ item.first_name }} {{ item.last_name }}
          </RouterLink>
        </p>
      </div>
      <RouterLink
        to="/"
        class="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800"
      >
        ← Back to listings
      </RouterLink>
    </div>

    <div v-if="item" class="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
      <!-- Left: description + questions -->
      <section class="space-y-5">
        <div class="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
          <h2 class="mb-2 text-sm font-semibold text-slate-50">Description</h2>
          <p class="whitespace-pre-line">
            {{ item.description }}
          </p>

          <!-- Categories -->
          <div v-if="item.categories?.length" class="mt-3 flex flex-wrap gap-1">
            <span
              v-for="cat in item.categories"
              :key="cat.category_id"
              class="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300"
            >
              {{ cat.name }}
            </span>
          </div>
        </div>

        <!-- Questions -->
        <div class="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-50">Questions</h2>
            <span class="text-[11px] text-slate-500">
              {{ questions.length }} total
            </span>
          </div>

          <div v-if="questions.length === 0" class="text-[11px] text-slate-400">
            No questions yet. Be the first to ask.
          </div>

          <ul v-else class="space-y-3">
            <li
              v-for="q in questions"
              :key="q.question_id"
              class="rounded-lg border border-slate-800 bg-slate-950/80 p-2.5"
            >
              <p class="font-medium text-slate-100">
                Q: {{ q.question_text }}
              </p>
              <p v-if="q.answer_text" class="mt-1 text-slate-300">
                A: {{ q.answer_text }}
              </p>
              <div v-else class="mt-1 text-[11px] text-slate-500">
                No answer yet.
              </div>

              <!-- Answer form (owner only) -->
              <form
                v-if="isOwner && !q.answer_text"
                class="mt-2 space-y-1"
                @submit.prevent="submitAnswer(q.question_id)"
              >
                <textarea
                  v-model="answerDrafts[q.question_id]"
                  rows="2"
                  class="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-100
                         placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/70"
                  placeholder="Type your answer…"
                />
                <button
                  type="submit"
                  class="rounded-lg bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-50 hover:bg-indigo-500/90"
                >
                  Post answer
                </button>
              </form>
            </li>
          </ul>

          <!-- Ask question -->
          <div v-if="isAuthenticated && !isOwner" class="mt-4 border-t border-slate-800 pt-3">
            <h3 class="mb-2 text-[11px] font-semibold text-slate-200">
              Ask a question
            </h3>
            <form @submit.prevent="submitQuestion" class="space-y-2">
              <textarea
                v-model.trim="newQuestion"
                rows="2"
                class="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-2 py-1 text-[11px] text-slate-100
                       placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/70"
                placeholder="What would you like to know?"
              />
              <button
                type="submit"
                class="rounded-lg bg-indigo-500 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-indigo-400"
              >
                Submit question
              </button>
            </form>
          </div>
          <p v-else-if="!isAuthenticated" class="mt-3 text-[11px] text-slate-500">
            Log in to ask a question.
          </p>
        </div>
      </section>

      <!-- Right: bidding -->
      <aside class="space-y-5">
        <!-- Current bid card -->
        <div class="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
          <h2 class="mb-2 text-sm font-semibold text-slate-50">Auction status</h2>

          <dl class="space-y-1">
            <div class="flex justify-between">
              <dt>Starting bid</dt>
              <dd>£{{ item.starting_bid }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Current bid</dt>
              <dd>
                <span v-if="item.current_bid != null">£{{ item.current_bid }}</span>
                <span v-else class="text-slate-400">No bids yet</span>
              </dd>
            </div>
            <div class="flex justify-between">
              <dt>Ends at</dt>
              <dd>{{ formatDate(item.end_date) }}</dd>
            </div>
          </dl>

          <div v-if="item.current_bid_holder" class="mt-2 text-[11px] text-slate-400">
            Highest bidder: User #{{ item.current_bid_holder.user_id }}
            ({{ item.current_bid_holder.first_name }} {{ item.current_bid_holder.last_name }})
          </div>
        </div>

        <!-- Place bid -->
        <div class="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
          <h2 class="mb-2 text-sm font-semibold text-slate-50">Place a bid</h2>

          <p v-if="!isAuthenticated" class="text-[11px] text-slate-500 mb-2">
            Log in to place a bid.
          </p>
          <p v-else-if="isOwner" class="text-[11px] text-slate-500 mb-2">
            You cannot bid on your own item.
          </p>

          <form
            v-if="isAuthenticated && !isOwner"
            @submit.prevent="submitBid"
            class="space-y-2"
          >
            <div>
              <label class="mb-1 block text-[11px] font-medium text-slate-300">
                Bid amount (£)
              </label>
              <input
                v-model.number="bidAmount"
                type="number"
                min="0"
                step="1"
                required
                class="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-100
                       focus:outline-none focus:ring-1 focus:ring-indigo-500/70"
              />
            </div>

            <div v-if="bidError" class="text-[11px] text-red-300">
              {{ bidError }}
            </div>

            <button
              type="submit"
              :disabled="bidSubmitting"
              class="inline-flex items-center rounded-lg bg-indigo-500 px-3 py-1.5 text-[11px] font-medium
                     text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="!bidSubmitting">Submit bid</span>
              <span v-else>Submitting…</span>
            </button>
          </form>
        </div>

        <!-- Bid history -->
        <div class="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
          <div class="mb-2 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-50">Bid history</h2>
            <span class="text-[11px] text-slate-500">
              {{ bidHistory.length }} bid(s)
            </span>
          </div>

          <div v-if="bidHistory.length === 0" class="text-[11px] text-slate-400">
            No bids yet.
          </div>

          <ul v-else class="space-y-2 max-h-64 overflow-y-auto">
            <li
              v-for="b in bidHistory"
              :key="b.timestamp + '-' + b.user_id"
              class="flex items-center justify-between rounded-lg bg-slate-900/70 px-2 py-1.5"
            >
              <div>
                <div class="font-medium text-slate-100">
                  £{{ b.amount }}
                </div>
                <div class="text-[10px] text-slate-500">
                  {{ formatDate(b.timestamp) }}
                </div>
              </div>
              <div class="text-[10px] text-slate-400">
                User #{{ b.user_id }}
                <div v-if="b.first_name" class="text-slate-500">
                  {{ b.first_name }} {{ b.last_name }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>

    <div v-else class="text-xs text-slate-400">
      Item not found.
    </div>
  </div>

  <div v-else class="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-400">
    Loading item…
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../api'
import { useAuth } from '../composables/useAuth'

interface Category {
  category_id: number
  name: string
}

interface ItemDetail {
  item_id: number
  name: string
  description: string
  starting_bid: number
  start_date: number
  end_date: number
  creator_id: number
  first_name: string
  last_name: string
  current_bid: number | null
  current_bid_holder: {
    user_id: number
    first_name: string
    last_name: string
  } | null
  categories: Category[]
}

interface BidRow {
  item_id: number
  amount: number
  timestamp: number
  user_id: number
  first_name: string | null
  last_name: string | null
}

interface QuestionRow {
  question_id: number
  question_text: string
  answer_text: string | null
}

const route = useRoute()
const { isAuthenticated, currentUserId } = useAuth()

const item = ref<ItemDetail | null>(null)
const loaded = ref(false)

const bidHistory = ref<BidRow[]>([])
const bidAmount = ref<number | null>(null)
const bidSubmitting = ref(false)
const bidError = ref<string | null>(null)

const questions = ref<QuestionRow[]>([])
const newQuestion = ref('')
const answerDrafts = reactive<Record<number, string>>({})

const isOwner = computed(
  () => !!item.value && !!currentUserId.value && item.value.creator_id === currentUserId.value
)

function formatDate(ts: number) {
  return new Date(ts).toLocaleString()
}

async function loadItem() {
  try {
    const id = Number(route.params.id)
    const res = await api.get<ItemDetail>(`/item/${id}`)
    item.value = res.data
  } catch (e) {
    console.error('Failed to load item', e)
  } finally {
    loaded.value = true
  }
}

async function loadBidHistory() {
  try {
    const id = Number(route.params.id)
    const res = await api.get<BidRow[]>(`/item/${id}/bid`)
    bidHistory.value = res.data
  } catch (e) {
    console.error('Failed to load bid history', e)
  }
}

async function loadQuestions() {
  try {
    const id = Number(route.params.id)
    const res = await api.get<QuestionRow[]>(`/item/${id}/question`)
    questions.value = res.data
  } catch (e) {
    console.error('Failed to load questions', e)
  }
}

async function submitBid() {
  bidError.value = null
  if (bidAmount.value == null || bidAmount.value <= 0) {
    bidError.value = 'Please enter a valid bid amount.'
    return
  }

  bidSubmitting.value = true
  try {
    const id = Number(route.params.id)
    await api.post(`/item/${id}/bid`, { amount: bidAmount.value })
    bidAmount.value = null
    await Promise.all([loadItem(), loadBidHistory()])
  } catch (err: any) {
    const msg = err?.response?.data?.error_message || 'Failed to place bid.'
    bidError.value = msg
  } finally {
    bidSubmitting.value = false
  }
}

async function submitQuestion() {
  if (!newQuestion.value.trim()) return
  try {
    const id = Number(route.params.id)
    await api.post(`/item/${id}/question`, { question_text: newQuestion.value.trim() })
    newQuestion.value = ''
    await loadQuestions()
  } catch (err: any) {
    // optional: display message somewhere
    console.error('Failed to ask question', err)
  }
}

async function submitAnswer(questionId: number) {
  const text = (answerDrafts[questionId] || '').trim()
  if (!text) return
  try {
    await api.post(`/question/${questionId}`, { answer_text: text })
    answerDrafts[questionId] = ''
    await loadQuestions()
  } catch (err: any) {
    console.error('Failed to post answer', err)
  }
}

onMounted(async () => {
  await Promise.all([loadItem(), loadBidHistory(), loadQuestions()])
})
</script>
