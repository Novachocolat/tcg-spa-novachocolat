<template>
  <!-- Modal de fin de partie-->
  <NModal :show="visible" :mask-closable="false" :closable="false">
    <NCard
      style="width: 400px; text-align: center"
      title="Fin de la partie"
      :bordered="false"
    >
      <!-- Résultat -->
      <NResult
        :status="isWinner ? 'success' : 'error'"
        :title="isWinner ? 'Victoire !' : 'Défaite'"
        :description="
          isWinner
            ? 'Félicitations, vous avez gagné !'
            : 'Vous avez perdu. Bonne chance la prochaine fois !'
        "
      />

      <!-- Bouton retour au lobby -->
      <template #action>
        <NButton type="primary" @click="emit('backToLobby')">
          Retour au lobby
        </NButton>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
// Importations
import { computed } from 'vue'

import { useAuthStore } from '../../stores/auth'

// Props
interface Props {
  visible: boolean // true quand la partie est terminée (RG8)
  winner: string | null // username du gagnant
}

const props = defineProps<Props>()

// Action de retour au lobby
const emit = defineEmits<{ backToLobby: [] }>()

const auth = useAuthStore()

// Détermine si le joueur courant a gagné en comparant son username au gagnant
const isWinner = computed(
  () => !!props.winner && props.winner === auth.user?.username,
)
</script>
