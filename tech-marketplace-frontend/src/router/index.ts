// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'
import CreateItemView from '../views/CreateItemView.vue'
import UserProfileView from '../views/UserProfileView.vue'
import { useAuth } from '../composables/useAuth'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  {
    path: '/item/:id',
    name: 'item-detail',
    component: ItemDetailView,
    props: true,
  },
  {
    path: '/sell',
    name: 'create-item',
    component: CreateItemView,
    meta: { requiresAuth: true },
  },
  {
    path: '/users/:id',
    name: 'user-profile',
    component: UserProfileView,
    props: true,
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// simple auth guard for protected routes
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
