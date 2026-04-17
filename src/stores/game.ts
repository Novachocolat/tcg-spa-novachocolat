// src/stores/game.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { io, type Socket } from 'socket.io-client'

import router from '../router'
import { useAuthStore } from './auth'
import type { GameResult, GameState, PlayerState, Room } from '../types/game'

export const useGameStore = defineStore('game', () => {
  const auth = useAuthStore()

  // Instance Socket.io
  let socket: Socket | null = null

  // --- État du lobby ---
  // Liste des rooms disponibles
  const rooms = ref<Room[]>([])
  // ID de la room
  const currentRoomId = ref<string | null>(null)
  // Message d'erreur
  const lobbyError = ref<string | null>(null)

  // --- Rôle du joueur ---
  // Défini localement puis confirmé à la réception de gameStarted
  const pendingRole = ref<'host' | 'guest' | null>(null)
  const role = ref<'host' | 'guest' | null>(null)

  // --- État de la partie ---
  const gameState = ref<GameState | null>(null)
  const gameResult = ref<GameResult | null>(null)
  // Dernier message événementiel reçu depuis le serveur
  const gameMessage = ref<string | null>(null)

  const isMyTurn = computed(() => {
    if (!gameState.value || !auth.user) return false
    return gameState.value.currentTurn === auth.user.username
  })

  // Computed : état du joueur actuel
  const myState = computed<PlayerState | null>(() => {
    if (!gameState.value || !role.value) return null
    return gameState.value[role.value]
  })

  // Computed : état de l'adversaire
  const opponentState = computed<PlayerState | null>(() => {
    if (!gameState.value || !role.value) return null
    return gameState.value[role.value === 'host' ? 'guest' : 'host']
  })

  // Établit la connexion Socket.io avec authentification JWT
  const connect = () => {
    if (socket?.connected) return

    // L'URL du socket
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string
    const serverUrl = baseUrl.replace('/api', '')

    socket = io(serverUrl, {
      auth: { token: auth.token },
    })

    // Chargement initial de la liste des rooms
    socket.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    // Mise à jour quand une room est créée/supprimée
    socket.on('roomsListUpdated', (data: Room[]) => {
      rooms.value = data
    })

    // Confirmation de la création de la room
    socket.on('roomCreated', (data: { roomId: string }) => {
      currentRoomId.value = data.roomId
    })

    // Fixation du rôle et on redirige vers /game
    socket.on('gameStarted', (data?: { role?: 'host' | 'guest' }) => {
      role.value = data?.role ?? pendingRole.value
      router.push('/game')
    })

    // Erreur renvoyée par le serveur
    socket.on('error', (data: { message: string }) => {
      lobbyError.value = data.message
    })

    // Mise à jour de l'état du plateau
    socket.on('gameStateUpdated', (data: GameState) => {
      gameState.value = data
      if (data.message) {
        gameMessage.value = data.message
      }
    })

    // Fin de partie : on enregistre le résultat pour l'afficher
    socket.on('gameEnded', (data: GameResult) => {
      gameResult.value = data
    })

    // L'adversaire s'est déconnecté en cours de partie
    socket.on('opponentDisconnected', () => {
      gameMessage.value = "L'adversaire s'est déconnecté de la partie."
    })
  }

  const disconnect = () => {
    socket?.disconnect()
    socket = null
  }


  // Crée une nouvelle room avec le deck sélectionné
  const createRoom = (deckId: number) => {
    pendingRole.value = 'host'
    lobbyError.value = null
    socket?.emit('createRoom', { deckId })
  }

  // Rejoint une room existante avec le deck sélectionné
  const joinRoom = (roomId: string, deckId: number) => {
    pendingRole.value = 'guest'
    lobbyError.value = null
    socket?.emit('joinRoom', { roomId, deckId })
  }

  // Pioche des cartes
  const drawCards = () => {
    socket?.emit('drawCards')
  }

  // Joue une carte de la main
  const playCard = (cardId: number) => {
    socket?.emit('playCard', { cardId })
  }

  // Lance une attaque sur la carte adverse
  const attack = () => {
    socket?.emit('attack')
  }

  // Termine le tour du joueur courant
  const endTurn = () => {
    socket?.emit('endTurn')
  }

  // Remet intégralement le store à son état initial
  const resetGame = () => {
    gameState.value = null
    gameResult.value = null
    gameMessage.value = null
    role.value = null
    pendingRole.value = null
    currentRoomId.value = null
    lobbyError.value = null
    rooms.value = []
    disconnect()
  }

  return {
    rooms,
    currentRoomId,
    lobbyError,
    role,
    gameState,
    gameResult,
    gameMessage,
    isMyTurn,
    myState,
    opponentState,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,
  }
})
