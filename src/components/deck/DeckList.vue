<template>
  <div class="deck-list">
    <div class="deck-list__header">
      <h2>Mes decks</h2>
      <NButton type="primary" @click="router.push(ROUTES.DECK_CREATE)">
        Nouveau deck
      </NButton>
    </div>

    <NSpin v-if="loading" />

    <NAlert v-else-if="error" type="error">{{ error }}</NAlert>

    <template v-else>
      <NEmpty
        v-if="decks.length === 0"
        description="Aucun deck pour le moment."
      />

      <NList v-else bordered>
        <NListItem v-for="deck in decks" :key="deck.id">
          <div class="deck-list__item">
            <span class="deck-list__name">{{ deck.name }}</span>
            <NSpace :size="8">
              <NButton
                size="small"
                @click="router.push(ROUTES.DECK_DETAIL(deck.id))"
              >
                Voir
              </NButton>
              <NButton
                size="small"
                @click="router.push(ROUTES.DECK_EDIT(deck.id))"
              >
                Modifier
              </NButton>
              <NPopconfirm @positive-click="deleteDeck(deck.id)">
                <template #trigger>
                  <NButton size="small" type="error">Supprimer</NButton>
                </template>
                Supprimer ce deck ?
              </NPopconfirm>
            </NSpace>
          </div>
        </NListItem>
      </NList>
    </template>
  </div>
</template>

<script setup lang="ts">
// Importations
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '../../composables/useApi'
import { ROUTES } from '../../router'
import type { Deck } from '../../types'

// Initialisation composables et stores
const api = useApi()
const router = useRouter()

// Variables réactives
const decks = ref<Deck[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Fonction de chargement des decks de l'utilisateur
async function fetchDecks() {
  loading.value = true
  error.value = null
  try {
    decks.value = await api.getMyDecks()
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors du chargement des decks'
  } finally {
    loading.value = false
  }
}

// Suppression
async function deleteDeck(id: number) {
  try {
    await api.deleteDeck(id)
    await fetchDecks()
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors de la suppression'
  }
}

// Chargement des decks
onMounted(fetchDecks)
</script>

<style scoped>
.deck-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deck-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deck-list__header h2 {
  margin: 0;
}

.deck-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.deck-list__name {
  font-weight: 600;
  font-size: 16px;
}
</style>
