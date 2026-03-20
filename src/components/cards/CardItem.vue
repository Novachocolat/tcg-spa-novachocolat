<template>
  <NCard
    class="card-item"
    :class="[
      `card-item--${size}`,
      selected && 'card-item--selected',
      disabled && 'card-item--disabled',
    ]"
    hoverable
    :content-style="{ padding: size === 'sm' ? '6px' : '8px' }"
    @click="!disabled && emit('click')"
  >
    <template #cover>
      <img :src="card.imgUrl" :alt="card.name" class="card-item__img" />
    </template>
    <NSpace vertical :size="4">
      <NSpace justify="space-between" align="center">
        <NText depth="3" style="font-size: 10px">
          #{{ String(card.pokedexNumber).padStart(3, '0') }}
        </NText>
        <NTag
          size="small"
          :color="{
            color: getTypeColor(card.type),
            textColor: '#fff',
            borderColor: 'transparent',
          }"
        >
          {{ card.type }}
        </NTag>
      </NSpace>
      <NText
        strong
        style="
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
        "
      >
        {{ card.name }}
      </NText>
      <NSpace justify="space-between">
        <NText depth="3">HP {{ card.hp }}</NText>
        <NText depth="3">ATK {{ card.attack }}</NText>
      </NSpace>
      <NProgress
        v-if="currentHp !== undefined"
        type="line"
        :percentage="hpPercent"
        :color="hpBarColor"
        :show-indicator="false"
        :height="5"
      />
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
// Importations
import { computed } from 'vue'

import { useColors } from '../../composables/useColors'
import type { Card } from '../../types'

// Définition des props avec valeurs par défaut
interface Props {
  card: Card
  size?: 'sm' | 'md'
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}

// Valeurs par défaut pour les props
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
  cursor: pointer;
}

.card-item--md {
  width: 160px;
}

.card-item--sm {
  width: 110px;
}

.card-item--selected {
  border-color: #18a058 !important;
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
</style>
