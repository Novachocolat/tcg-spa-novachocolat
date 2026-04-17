<template>
  <!-- Main du joueur -->
  <div class="player-hand">
    <div class="player-hand__header">
      <NText strong>Main</NText>
      <!-- Nombre de cartes restantes dans le deck -->
      <NText depth="3" style="font-size: 13px">
        Deck : {{ deckCount }} carte{{ deckCount !== 1 ? 's' : '' }}
      </NText>
    </div>

    <NEmpty
      v-if="hand.length === 0"
      description="Aucune carte en main."
      :style="{ padding: '16px 0' }"
    />

    <!-- Liste des cartes en main -->
    <NSpace v-else wrap :size="8">
      <CardItem
        v-for="card in hand"
        :key="card.id"
        :card="card"
        size="sm"
        :disabled="!canPlay"
        @click="handlePlay(card.id)"
      />
    </NSpace>
  </div>
</template>

<script setup lang="ts">
// Importations
import CardItem from '../cards/CardItem.vue'
import type { Card } from '../../types'

// Props
interface Props {
  hand: Card[] 
  deckCount: number 
  canPlay: boolean 
}

defineProps<Props>()

// Émet l'id de la carte jouée vers le parent
const emit = defineEmits<{ play: [cardId: number] }>()

function handlePlay(cardId: number) {
  emit('play', cardId)
}
</script>

<style scoped>
.player-hand {
  padding: 12px 0;
}

.player-hand__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
</style>
