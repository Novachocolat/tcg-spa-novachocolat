<template>
  <div class="deck-detail">
    <div v-if="loading" class="deck-detail__loading">
      <NSpin />
    </div>

    <template v-else-if="deck">
      <div class="deck-detail__header">
        <h1>{{ deck.name }}</h1>
        <NButton type="primary" @click="router.push(ROUTES.DECK_EDIT(deck.id))">
          Modifier
        </NButton>
      </div>

      <CardGrid :cards="deckCards" size="sm" />
    </template>

    <NAlert v-else-if="error" type="error">{{ error }}</NAlert>
  </div>
</template>

<script setup lang="ts">
// Importations
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '../components/cards/CardGrid.vue'
import { useApi } from '../composables/useApi'
import { ROUTES } from '../router'
import type { Card, Deck } from '../types'

// Initialisation composables et stores
const api = useApi()
const route = useRoute()
const router = useRouter()

// Variables réactives
const deck = ref<Deck | null>(null)
const deckCards = ref<Card[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Chargement du deck et des cartes associées
onMounted(async () => {
  try {
    const id = route.params.id as string
    const [fetchedDeck, allCards] = await Promise.all([
      api.getDeck(id),
      api.getCards(),
    ])
    deck.value = fetchedDeck
    const cardMap = new Map(allCards.map((c) => [c.id, c]))
    deckCards.value = fetchedDeck.cards
      .map((dc) => cardMap.get(dc.cardId))
      .filter((c): c is Card => c !== undefined)
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors du chargement du deck'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.deck-detail {
  max-width: 1000px;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.deck-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deck-detail__header h1 {
  margin: 0;
}

.deck-detail__loading {
  display: flex;
  justify-content: center;
  padding: 64px;
}
</style>
