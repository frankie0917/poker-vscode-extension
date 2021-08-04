import { ClientGame, Game } from './Game'
import { User, ServerUser } from './User'

export type Room = {
  id: string
  host: ServerUser
  players: ServerUser[]
  game: Game
}

export type ClientRoom = Omit<Room, 'game' | 'host' | 'players'> & {
  host: User
  players: User[]
  game: ClientGame
}
