<template>
  <div class="card-grid">
    <CardItem
      v-for="card in cards"
      :key="card.id"
      :card="card"
      :size="size"
      :selected="selectedIds.has(card.id)"
      :disabled="selectable && maxReached && !selectedIds.has(card.id)"
      @click="selectable && toggle(card.id)"
    />
  </div>
</template>

<script setup lang="ts">
// Importations
import { computed } from 'vue'

import type { Card } from '../../types'
import CardItem from './CardItem.vue'

// Définition props avec valeurs par défaut
interface Props {
  cards: Card[]
  size?: 'sm' | 'md'
  selectable?: boolean
  maxSelected?: number
  modelValue?: number[]
}

// v-model : Contient les ids des cartes sélectionnées
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selectable: false,
  modelValue: () => [],
  maxSelected: undefined,
})

// Emits : événement de mise à jour du v-model
const emit = defineEmits<{ 'update:modelValue': [value: number[]] }>()

// Ensemble des ids sélectionnés
const selectedIds = computed(() => new Set(props.modelValue))

// Maximum atteint
const maxReached = computed(
  () =>
    props.maxSelected !== undefined &&
    selectedIds.value.size >= props.maxSelected,
)

// Fonction de basculement de sélection
function toggle(cardId: number) {
  const next = new Set(selectedIds.value)
  if (next.has(cardId)) {
    next.delete(cardId)
  } else if (!maxReached.value) {
    next.add(cardId)
  }
  emit('update:modelValue', [...next])
}
</script>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
