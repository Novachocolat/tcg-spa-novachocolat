<template>
  <div class="container">
    <!-- Lobby : sélection de deck, création et rejointe de room -->
    <LobbyView />
    <NDivider />
    <DeckList />
  </div>
</template>

<script setup lang="ts">
import LobbyView from '../components/lobby/LobbyView.vue'
import DeckList from '../components/deck/DeckList.vue'
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 32px auto;
}
</style>
