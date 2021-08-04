import { Dealer, standardDeck, StandardPlayingCard } from 'card-dealer'
import { ServerUser, User } from './User'

export type Player = {
  data: ServerUser
  status: 'folded' | 'waiting' | 'betting'
  active: boolean
  money: number
  hand: StandardPlayingCard[]
  role: 'Dealer' | 'Small blind' | 'Big blind' | 'normal'
}

export type ClientPlayer = Omit<Player, 'data'> & {
  data: User
}

export type ClientOtherPlayer = Omit<ClientPlayer, 'hand'>

export type Game = {
  running: boolean
  deck: Dealer<StandardPlayingCard>
  blinds: {
    small: number
    big: number
  }
  pool: number
  players: Player[]
  position: {
    dealer: number
    smallBlind: number
    bigBlind: number
  }
}

export type ClientGame = Omit<Game, 'deck' | 'players'> & {
  players: ClientOtherPlayer[]
}

export const makeDefaultGame = (): Game => ({
  running: false,
  deck: new Dealer(standardDeck),
  blinds: {
    small: 10,
    big: 20,
  },
  pool: 0,
  players: [],
  position: {
    dealer: -1,
    smallBlind: -1,
    bigBlind: -1,
  },
})
