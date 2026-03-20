<template>
  <div class="deck-edit">
    <div v-if="loadingDeck" class="deck-edit__loading">
      <NSpin />
    </div>

    <template v-else-if="initialized">
      <h1>Modifier le deck</h1>

      <div class="deck-edit__form">
        <NFormItem label="Nom du deck">
          <NInput v-model:value="name" placeholder="Mon deck" />
        </NFormItem>

        <p class="deck-edit__counter">
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
          :disabled="!canSubmit || loadingSubmit"
          :loading="loadingSubmit"
          @click="handleSubmit"
        >
          Enregistrer
        </NButton>
      </div>

      <CardGrid
        v-model="selectedIds"
        :cards="allCards"
        size="sm"
        selectable
        :max-selected="DECK_SIZE"
      />
    </template>

    <NAlert v-else-if="loadError" type="error">{{ loadError }}</NAlert>
  </div>
</template>

<script setup lang="ts">
// Importations
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '../components/cards/CardGrid.vue'
import { useApi } from '../composables/useApi'
import { ROUTES } from '../router'
import type { Card } from '../types'

const DECK_SIZE = 10

// Initialisation composables et stores
const api = useApi()
const route = useRoute()
const router = useRouter()

// Variables réactives
const allCards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const name = ref('')
const loadingDeck = ref(true)
const loadingSubmit = ref(false)
const initialized = ref(false)
const error = ref<string | null>(null)
const loadError = ref<string | null>(null)

const canSubmit = computed(
  () => name.value.trim().length > 0 && selectedIds.value.length === DECK_SIZE,
)

// Chargement du deck et pré-remplissage du formulaire
onMounted(async () => {
  try {
    const id = route.params.id as string
    const [deck, cards] = await Promise.all([api.getDeck(id), api.getCards()])
    allCards.value = cards
    name.value = deck.name
    selectedIds.value = deck.cards.map((dc) => dc.cardId)
    initialized.value = true
  } catch (e) {
    loadError.value =
      e instanceof Error ? e.message : 'Erreur lors du chargement'
  } finally {
    loadingDeck.value = false
  }
})

// Fonction de gestion du formulaire d'édition
async function handleSubmit() {
  loadingSubmit.value = true
  error.value = null
  try {
    const id = route.params.id as string
    await api.updateDeck(id, {
      name: name.value.trim(),
      cards: selectedIds.value,
    })
    router.push(ROUTES.DECK_DETAIL(id)) // RG4
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors de la mise à jour'
  } finally {
    loadingSubmit.value = false
  }
}
</script>

<style scoped>
.deck-edit {
  max-width: 1000px;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.deck-edit__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.deck-edit__counter {
  margin: 0;
  font-size: 14px;
}

.deck-edit__loading {
  display: flex;
  justify-content: center;
  padding: 64px;
}
</style>
