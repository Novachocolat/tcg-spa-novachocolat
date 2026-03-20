<template>
  <div
    class="card-item"
    :class="[
      `card-item--${size}`,
      selected && 'card-item--selected',
      disabled && 'card-item--disabled',
    ]"
    @click="!disabled && emit('click')"
  >
    <img :src="card.imgUrl" :alt="card.name" class="card-item__img" />
    <div class="card-item__body">
      <div class="card-item__header">
        <span class="card-item__dex"
          >#{{ String(card.pokedexNumber).padStart(3, '0') }}</span
        >
        <span
          class="card-item__type"
          :style="{ backgroundColor: getTypeColor(card.type) }"
        >
          {{ card.type }}
        </span>
      </div>
      <div class="card-item__name">{{ card.name }}</div>
      <div class="card-item__stats">
        <span>HP {{ card.hp }}</span>
        <span>ATK {{ card.attack }}</span>
      </div>
      <div v-if="currentHp !== undefined" class="card-item__hp-bar">
        <div
          class="card-item__hp-fill"
          :style="{ width: `${hpPercent}%`, backgroundColor: hpBarColor }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importations
import { computed } from 'vue'

import { useColors } from '../../composables/useColors'
import type { Card } from '../../types'

// Définition props
interface Props {
  card: Card
  size?: 'sm' | 'md'
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}

// Valeurs par défaut des props
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selected: false,
  disabled: false,
  currentHp: undefined,
})

// Emits : événement de clic
const emit = defineEmits<{ click: [] }>()

// Couleurs
const { getTypeColor, hpColor } = useColors()

// Calcul pourcentage HP restant
const hpPercent = computed(() => {
  if (props.currentHp === undefined) return 0
  return Math.max(
    0,
    Math.min(100, Math.round((props.currentHp / props.card.hp) * 100)),
  )
})

// Couleur barre de HP selon le pourcentage restant
const hpBarColor = computed(() => hpColor(hpPercent.value))
</script>

<style scoped>
.card-item {
  border: 2px solid #e0e0e6;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition:
    transform 0.15s,
    border-color 0.15s,
    opacity 0.15s;
  display: flex;
  flex-direction: column;
}

.card-item:hover:not(.card-item--disabled) {
  transform: translateY(-2px);
}

.card-item--md {
  width: 160px;
}

.card-item--sm {
  width: 110px;
}

.card-item--selected {
  border-color: #18a058;
  box-shadow: 0 0 0 3px rgba(24, 160, 88, 0.25);
}

.card-item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.card-item__img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  background: #f5f5f5;
}

.card-item__body {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-item--sm .card-item__body {
  padding: 6px;
  gap: 3px;
}

.card-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-item__dex {
  font-size: 10px;
  color: #999;
}

.card-item--sm .card-item__dex {
  font-size: 9px;
}

.card-item__type {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 20px;
  font-weight: 600;
  color: #fff;
}

.card-item--sm .card-item__type {
  font-size: 9px;
  padding: 1px 4px;
}

.card-item__name {
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-item--sm .card-item__name {
  font-size: 12px;
}

.card-item__stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.card-item--sm .card-item__stats {
  font-size: 10px;
}

/* RG4 : barre de HP */
.card-item__hp-bar {
  height: 5px;
  background: #e0e0e6;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 2px;
}

.card-item__hp-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}
</style>
