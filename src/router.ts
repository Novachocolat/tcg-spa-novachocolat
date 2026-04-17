// Fichier de configuration du routeur de l'application
import { createRouter, createWebHistory } from 'vue-router'

// Importations
import DeckCreatePage from './pages/DeckCreatePage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import DeckEditPage from './pages/DeckEditPage.vue'
import GamePage from './pages/GamePage.vue'
import HomePage from './pages/HomePage.vue'
import LogPage from './pages/LogPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './stores/auth'

// Définition des routes de l'application
export const ROUTES = {
  HOME: '/',
  LOG: '/log',
  SIGN_UP: '/sign-up',
  DECK_CREATE: '/decks/create',
  DECK_DETAIL: (id: string | number) => `/decks/${id}`,
  DECK_EDIT: (id: string | number) => `/decks/${id}/edit`,
  GAME: '/game',
} as const

// Définition des routes de l'application
const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.LOG, component: LogPage, meta: { isGuest: true } },
  { path: ROUTES.SIGN_UP, component: SignUpPage, meta: { isGuest: true } },
  {
    path: ROUTES.DECK_CREATE,
    component: DeckCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id',
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/decks/:id/edit',
    component: DeckEditPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.GAME,
    component: GamePage,
    meta: { requiresAuth: true },
  },
]

// Création du routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protection des routes en fonction de l'authentification
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: ROUTES.LOG }
  }
  if (to.meta.isGuest && auth.isAuthenticated) {
    return { path: ROUTES.HOME }
  }
  return true
})

export default router
