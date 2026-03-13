<template>
  <NCard>
    <h1>Connexion</h1>
    <NForm @submit.prevent="handleSignIn">
      <NFormItem label="Email">
        <NInput v-model:value="email" type="email" placeholder="Email" />
      </NFormItem>
      <NFormItem label="Password">
        <NInput
          v-model:value="password"
          type="password"
          placeholder="Password"
        />
      </NFormItem>
      <NAlert v-if="error" type="error" style="margin-bottom: 12px">{{
        error
      }}</NAlert>
      <NButton
        type="success"
        attr-type="submit"
        :disabled="loading"
        :loading="loading"
        >Se Connecter</NButton
      >
    </NForm>
    <p>
      Pas encore de compte ?
      <RouterLink :to="ROUTES.SIGN_UP">S'inscrire</RouterLink>
    </p>
  </NCard>
</template>

<script setup lang="ts">
// Importations
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../composables/useApi'
import { ROUTES } from '../router'
import { useAuthStore } from '../stores/auth'

// Déclarations des variables réactives
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Initialisation composables et stores
const api = useApi()
const auth = useAuthStore()
const router = useRouter()

// Fonction de gestion de la connexion
async function handleSignIn() {
  loading.value = true
  error.value = null
  try {
    // Appel à l'API pour se connecter
    const response = await api.signIn({
      email: email.value,
      password: password.value,
    })
    auth.login(response)
    router.push(ROUTES.HOME)
  } catch (e) {
    // Gestion des erreurs
    error.value = e instanceof Error ? e.message : 'Identifiants incorrects'
  } finally {
    // Fin du chargement
    loading.value = false
  }
}
</script>

<style scoped>
.n-card {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

.n-form-item {
  margin-bottom: 16px;
}

.n-button {
  width: 100%;
}

p {
  text-align: center;
  margin-top: 16px;
}
</style>
