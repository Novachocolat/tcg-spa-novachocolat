<template>
  <div class="deck-create">
    <h1>Créer un deck</h1>

    <div class="deck-create__form">
      <NFormItem label="Nom du deck">
        <NInput v-model:value="name" placeholder="Mon deck" />
      </NFormItem>

      <p class="deck-create__counter">
        Cartes sélectionnées :
        <strong
          :style="{
            color: selectedIds.length === DECK_SIZE ? '#18a058' : '#d03050',
          }"
        >
          {{ selectedIds.length }} / {{ DECK_SIZE }}
        </strong>
      </p>

      <NAlert v-if="error" type="error" style="margin-bottom: 12px">{{
        error
      }}</NAlert>

      <NButton
        type="primary"
        :disabled="!canSubmit || loading"
        :loading="loading"
        @click="handleSubmit"
      >
        Créer le deck
      </NButton>
    </div>

    <CardGrid
      v-model="selectedIds"
      :cards="cards"
      size="sm"
      selectable
      :max-selected="DECK_SIZE"
    />
  </div>
</template>

<script setup lang="ts">
// Importations
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '../components/cards/CardGrid.vue'
import { useApi } from '../composables/useApi'
import { ROUTES } from '../router'
import type { Card } from '../types'

const DECK_SIZE = 10

// Initialisation composables et stores
const api = useApi()
const router = useRouter()

// Variables réactives
const cards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const name = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const canSubmit = computed(
  () => name.value.trim().length > 0 && selectedIds.value.length === DECK_SIZE,
)

// Chargement de toutes les cartes pour la sélection
onMounted(async () => {
  cards.value = await api.getCards()
})

// Gestion de la soumission du formulaire de création de deck
async function handleSubmit() {
  loading.value = true
  error.value = null
  try {
    await api.createDeck({ name: name.value.trim(), cards: selectedIds.value })
    router.push(ROUTES.HOME) // RG4
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors de la création du deck'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.deck-create {
  max-width: 1000px;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.deck-create__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.deck-create__counter {
  margin: 0;
  font-size: 14px;
}
</style>
