<template>
  <div class="game-page">
    <!-- Zone adversaire -->
    <PlayerZone
      v-if="game.opponentState"
      :state="game.opponentState"
      :label="game.opponentState.username"
      is-opponent
    />
    <div v-else class="game-page__waiting">
      <NSpin />
      <NText depth="3">En attente de l'état du jeu…</NText>
    </div>

    <!-- Barre d'actions centrale -->
    <ActionBar
      :is-my-turn="game.isMyTurn"
      :hand-full="(game.myState?.handCount ?? 0) >= 5"
      :deck-empty="(game.myState?.deckCount ?? 1) === 0"
      :my-active-card="!!game.myState?.activeCard"
      :opponent-active-card="!!game.opponentState?.activeCard"
      :message="game.gameMessage"
      @draw="game.drawCards()"
      @attack="game.attack()"
      @end-turn="game.endTurn()"
    />

    <!-- Zone joueur avec sa main intégrée -->
    <div v-if="game.myState" class="game-page__player-section">
      <PlayerZone
        :state="game.myState"
        :label="`Vous (${game.myState.username})`"
      />

      <!-- Main du joueur : une carte jouée uniquement si c'est le tour et pas de carte active -->
      <PlayerHand
        :hand="game.myState.hand"
        :deck-count="game.myState.deckCount"
        :can-play="game.isMyTurn && !game.myState.activeCard"
        @play="game.playCard($event)"
      />
    </div>

    <!-- Modal de fin de partie : s'affiche automatiquement quand game.gameResult est défini -->
    <GameEndModal
      :visible="!!game.gameResult"
      :winner="game.gameResult?.winner ?? null"
      @back-to-lobby="handleBackToLobby"
    />
  </div>
</template>

<script setup lang="ts">
// Importations
import { useRouter } from 'vue-router'

import ActionBar from '../components/game/ActionBar.vue'
import GameEndModal from '../components/game/GameEndModal.vue'
import PlayerHand from '../components/game/PlayerHand.vue'
import PlayerZone from '../components/game/PlayerZone.vue'
import { ROUTES } from '../router'
import { useGameStore } from '../stores/game'

// Initialisation du store et du router
const game = useGameStore()
const router = useRouter()

/**
 * Quand le joueur clique sur "Retour au lobby" :
 * - on remet le store à zéro
 * - on redirige vers la page d'accueil
 */
function handleBackToLobby() {
  game.resetGame()
  router.push(ROUTES.HOME)
}
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 700px;
  margin: 24px auto;
}

.game-page__waiting {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.game-page__player-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}
</style>
