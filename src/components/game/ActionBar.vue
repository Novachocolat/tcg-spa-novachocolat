<template>
  <!-- Barre d'actions -->
  <div class="action-bar">
    <!-- Indicateur du tour -->
    <NAlert
      :type="isMyTurn ? 'success' : 'info'"
      :show-icon="true"
      style="margin-bottom: 12px"
    >
      {{ isMyTurn ? 'C\'est votre tour !' : 'Tour de l\'adversaire…' }}
    </NAlert>

    <!-- Boutons d'action -->
    <NSpace :size="12" align="center">
      <!-- Piocher -->
      <NButton
        :disabled="!isMyTurn || handFull || deckEmpty"
        @click="emit('draw')"
      >
        Piocher
      </NButton>

      <!-- Attaquer -->
      <NButton
        type="warning"
        :disabled="!isMyTurn || !myActiveCard || !opponentActiveCard"
        @click="emit('attack')"
      >
        Attaquer
      </NButton>

      <!-- Fin de tour -->
      <NButton
        type="error"
        :disabled="!isMyTurn"
        @click="emit('endTurn')"
      >
        Fin de tour
      </NButton>
    </NSpace>

    <!-- Message en temps réel -->
    <NText
      v-if="message"
      depth="3"
      style="display: block; margin-top: 12px; font-style: italic"
    >
      {{ message }}
    </NText>
  </div>
</template>

<script setup lang="ts">
// Calculer l'état de chaque bouton
interface Props {
  isMyTurn: boolean
  handFull: boolean 
  deckEmpty: boolean 
  myActiveCard: boolean 
  opponentActiveCard: boolean 
  message?: string | null 
}

withDefaults(defineProps<Props>(), {
  message: null,
})

// Émet les actions vers GamePage qui les délègue au store
const emit = defineEmits<{
  draw: []
  attack: []
  endTurn: []
}>()
</script>

<style scoped>
.action-bar {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
}
</style>
