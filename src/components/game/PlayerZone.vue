<template>
  <!-- Zone d'un joueur -->
  <div class="player-zone" :class="{ 'player-zone--opponent': isOpponent }">
    <!-- En-tête -->
    <div class="player-zone__header">
      <NText depth="2" style="font-size: 14px">{{ label }}</NText>
      <NSpace align="center" :size="4">
        <NText depth="3" style="font-size: 13px">KO :</NText>
        <!-- Affiche un badge coloré par KO obtenu -->
        <NSpace :size="4">
          <NTag
            v-for="i in 3"
            :key="i"
            size="small"
            :type="i <= state.score ? 'error' : 'default'"
          >
            {{ i <= state.score ? '✕' : '○' }}
          </NTag>
        </NSpace>
      </NSpace>
    </div>

    <!-- Carte active avec ses HP courants -->
    <div class="player-zone__active-card">
      <CardItem
        v-if="state.activeCard"
        :card="state.activeCard"
        :current-hp="state.activeCard.currentHp"
      />
      <div v-else class="player-zone__placeholder">
        <NText depth="3" style="font-size: 13px">Aucune carte active</NText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importations
import CardItem from '../cards/CardItem.vue'
import type { PlayerState } from '../../types'

// Etat du joueur et indications d'affichage
interface Props {
  state: PlayerState
  label: string // "Vous" ou nom de l'adversaire
  isOpponent?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpponent: false,
})
</script>

<style scoped>
.player-zone {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.player-zone--opponent {
  background: #f5f5f5;
}

.player-zone__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.player-zone__active-card {
  display: flex;
  justify-content: center;
  min-height: 120px;
  align-items: center;
}

.player-zone__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 100px;
  border: 2px dashed #ccc;
  border-radius: 8px;
}
</style>
