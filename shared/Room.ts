import { User } from './User'

export type Room = {
  id: string
  host: User
  players: User[]
}
