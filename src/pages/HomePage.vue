<template>
  <div class="container">
    <DeckList />
  </div>
</template>

<script setup lang="ts">
import DeckList from '../components/deck/DeckList.vue'
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 32px auto;
}
</style>
