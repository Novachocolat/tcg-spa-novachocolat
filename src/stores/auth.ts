// src/stores/auth.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useStorage } from '../composables/useStorage'
import type { AuthResponse, User } from '../types/auth'

// Gestion de l'authentification avec persistance dans localStorage
export const useAuthStore = defineStore('auth', () => {
  const storage = useStorage()

  // Initialisation depuis localStorage au démarrage
  const token = ref<string | null>(storage.get<string>('token'))
  const user = ref<User | null>(storage.get<User>('user'))

  // Indicateur d'authentification
  const isAuthenticated = computed(() => !!token.value)

  // Connexion et stockage des données
  const login = (data: AuthResponse) => {
    token.value = data.token
    user.value = data.user
    // Persistance
    storage.set('token', data.token)
    storage.set('user', data.user)
  }

  // Déconnexion et nettoyage des données
  const logout = () => {
    token.value = null
    user.value = null
    // Nettoyage
    storage.remove('token', 'user')
  }

  return { token, user, isAuthenticated, login, logout }
})
