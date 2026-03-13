// Fichier de configuration du routeur de l'application
import { createRouter, createWebHistory } from 'vue-router'

// Importations
import HomePage from './pages/HomePage.vue'
import LogPage from './pages/LogPage.vue'
import SignUpPage from './pages/SignUpPage.vue'
import { useAuthStore } from './stores/auth'

// Définition des routes de l'application
export const ROUTES = {
  HOME: '/',
  LOG: '/log',
  SIGN_UP: '/sign-up',
} as const

// Définition des routes de l'application
const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.LOG, component: LogPage, meta: { isGuest: true } },
  { path: ROUTES.SIGN_UP, component: SignUpPage, meta: { isGuest: true } },
]

// Création du routeur
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard pour protéger les routes en fonction de l'authentification
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
