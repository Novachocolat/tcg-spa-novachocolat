<template>
  <NLayoutHeader
    bordered
    style="padding: 0 24px; position: sticky; top: 0; z-index: 100"
  >
    <NSpace justify="space-between" align="center" style="height: 56px">
      <NSpace align="center" :size="16">
        <RouterLink to="/">TCG SPA</RouterLink>
        <NButton
          tag="a"
          :href="`${apiBaseUrl.replace('/api', '')}/api-docs`"
          target="_blank"
          text
          size="small"
        >
          API Docs
        </NButton>
        <NButton
          tag="a"
          href="https://making-rerun-61323218.figma.site/"
          target="_blank"
          text
          size="small"
        >
          Maquettes
        </NButton>
      </NSpace>
      <NSpace align="center" :size="16">
        <!-- Affichage du nom d'utilisateur si connecté -->
        <NText depth="3">{{ auth.user?.username }}</NText>
        <NButton v-if="auth.isAuthenticated" size="small" @click="handleLogout"
          >Déconnexion</NButton
        >
        <NButton v-else size="small" @click="handleLogin">Connexion</NButton>
      </NSpace>
    </NSpace>
  </NLayoutHeader>
</template>

<script setup lang="ts">
// Importations
import { useRouter } from 'vue-router'

import { ROUTES } from '../../router'
import { useAuthStore } from '../../stores/auth'

// Initialisation stores et router
const auth = useAuthStore()
const router = useRouter()

// Gestion de la déconnexion
const handleLogout = () => {
  auth.logout()
  router.push(ROUTES.LOG)
}

// Gestion de la connexion
const handleLogin = () => {
  router.push(ROUTES.LOG)
}

// Base URL de l'API
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
</script>
