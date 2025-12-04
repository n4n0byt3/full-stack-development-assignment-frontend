<!-- src/views/UserProfileView.vue -->
<template>
  <div class="mx-auto max-w-5xl px-4 py-6" v-if="loaded">
    <div class="mb-4 flex items-center justify-between gap-3">
      <div>
        <h1 class="text-lg font-semibold text-slate-50">
          {{ user?.first_name }} {{ user?.last_name }}
        </h1>
        <p class="text-xs text-slate-400">
          User #{{ user?.user_id }}
        </p>
      </div>
      <RouterLink
        to="/"
        class="rounded-lg bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800"
      >
        ← Back to listings
      </RouterLink>
    </div>

    <div v-if="user" class="grid gap-5 md:grid-cols-3">
      <section class="md:col-span-1 rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-200">
        <h2 class="mb-2 text-sm font-semibold text-slate-50">Overview</h2>
        <dl class="space-y-1 text-[11px] text-slate-400">
          <div class="flex justify-between">
            <dt>Selling</dt>
            <dd>{{ user.selling.length }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Bidding on</dt>
            <dd>{{ user.bidding_on.length }}</dd>
          </div>
          <div class="flex justify-between">
            <dt>Ended auctions</dt>
            <dd>{{ user.auctions_ended.length }}</dd>
          </div>
        </dl>
      </section>

      <section class="md:col-span-2 space-y-4">
        <UserItemsList title="Active listings" :items="user.selling" />
        <UserItemsList title="Auctions currently bidding on" :items="user.bidding_on" />
        <UserItemsList title="Past auctions" :items="user.auctions_ended" />
      </section>
    </div>

    <div v-else class="text-xs text-slate-400">
      User not found.
    </div>
  </div>

  <div v-else class="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-400">
    Loading user…
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import api from '../api'
// import UserItemsList from '../components/UserItemsList.vue'

interface UserItem {
  item_id: number
  name: string
  description: string
  end_date: number
  creator_id: number
  first_name: string
  last_name: string
}

interface UserDetail {
  user_id: number
  first_name: string
  last_name: string
  selling: UserItem[]
  bidding_on: UserItem[]
  auctions_ended: UserItem[]
}

const route = useRoute()
const user = ref<UserDetail | null>(null)
const loaded = ref(false)

async function loadUser() {
  try {
    const id = Number(route.params.id)
    const res = await api.get<UserDetail>(`/users/${id}`)
    user.value = res.data
  } catch (e) {
    console.error('Failed to load user', e)
  } finally {
    loaded.value = true
  }
}

onMounted(loadUser)
</script>
