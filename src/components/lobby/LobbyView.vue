<template>
  <div class="lobby">
    <h2 class="lobby__title">Lobby</h2>

    <!-- Sélection du deck avant de créer ou rejoindre une room -->
    <div class="lobby__deck-select">
      <NFormItem label="Choisir un deck" :show-feedback="false">
        <NSpin v-if="loadingDecks" size="small" />
        <NSelect
          v-else
          v-model:value="selectedDeckId"
          :options="deckOptions"
          placeholder="Sélectionnez un deck"
          style="min-width: 240px"
        />
      </NFormItem>

      <NButton
        type="primary"
        :disabled="!selectedDeckId"
        @click="handleCreate"
      >
        Créer une partie
      </NButton>
    </div>

    <!-- Erreur renvoyée par le serveur -->
    <NAlert
      v-if="game.lobbyError"
      type="error"
      closable
      style="margin-bottom: 16px"
      @close="game.lobbyError = null"
    >
      {{ game.lobbyError }}
    </NAlert>

    <!-- Liste des rooms disponibles, mise à jour en temps réel -->
    <div class="lobby__rooms">
      <h3>Parties disponibles</h3>

      <NEmpty
        v-if="game.rooms.length === 0"
        description="Aucune partie disponible pour le moment."
      />

      <NList v-else bordered>
        <NListItem v-for="room in game.rooms" :key="room.id">
          <div class="lobby__room-item">
            <NText>
              <strong>{{ room.hostUsername }}</strong>
              attend un adversaire
            </NText>
            <NButton
              size="small"
              :disabled="!selectedDeckId"
              @click="handleJoin(room.id)"
            >
              Rejoindre
            </NButton>
          </div>
        </NListItem>
      </NList>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importations
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useApi } from '../../composables/useApi'
import { useGameStore } from '../../stores/game'
import type { Deck } from '../../types'

// Initialisation des composables et du store
const api = useApi()
const game = useGameStore()

// Decks de l'utilisateur : chargés au montage pour alimenter le sélecteur
const decks = ref<Deck[]>([])
const loadingDecks = ref(true)
const selectedDeckId = ref<number | null>(null)

// Transformation des decks en options pour NSelect
const deckOptions = computed(() =>
  decks.value.map((d) => ({ label: d.name, value: d.id })),
)

// Charge les decks de l'utilisateur connecté
async function fetchDecks() {
  try {
    decks.value = await api.getMyDecks()
  } finally {
    loadingDecks.value = false
  }
}

// Crée une nouvelle room avec le deck sélectionné
function handleCreate() {
  if (!selectedDeckId.value) return
  game.createRoom(selectedDeckId.value)
}

// Rejoint une room existante avec le deck sélectionné
function handleJoin(roomId: string) {
  if (!selectedDeckId.value) return
  game.joinRoom(roomId, selectedDeckId.value)
}

// connexion Socket.io et chargement des decks
onMounted(() => {
  game.connect()
  fetchDecks()
})

// déconnexion propre du socket
onUnmounted(() => {
  if (!game.role) {
    game.disconnect()
  }
})
</script>

<style scoped>
.lobby {
  max-width: 600px;
  margin: 32px auto;
}

.lobby__title {
  margin-bottom: 24px;
}

.lobby__deck-select {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
}

.lobby__rooms h3 {
  margin-bottom: 12px;
}

.lobby__room-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
