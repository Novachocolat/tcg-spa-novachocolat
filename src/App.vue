<template>
  <NConfigProvider>
    <NMessageProvider>
      <NLayout>
        <HeaderBar v-if="auth.isAuthenticated" />
        <NLayoutContent>
          <RouterView />
        </NLayoutContent>
      </NLayout>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
// Importations
import HeaderBar from './components/layout/HeaderBar.vue'
import { useAuthStore } from './stores/auth'

// Initialisation du store d'authentification
const auth = useAuthStore()
</script>

<style>
body {
  padding: 0 20px;
}
</style>
