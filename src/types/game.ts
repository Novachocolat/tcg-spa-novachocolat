import type { Card } from './card.js'

// Une room disponible dans le lobby
export interface Room {
  id: string
  hostUsername: string
  guestUsername?: string | null
}

// Une carte posée sur le plateau avec ses HP courants
export interface CardInPlay extends Card {
  currentHp: number
}

// État d'un joueur pendant la partie
export interface PlayerState {
  username: string
  score: number
  activeCard: CardInPlay | null
  hand: Card[] 
  handCount: number 
  deckCount: number 
}

// État global de la partie
export interface GameState {
  currentTurn: string 
  host: PlayerState
  guest: PlayerState
  message?: string
}

// Résultat final de la partie
export interface GameResult {
  winner: string 
}
