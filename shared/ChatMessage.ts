import { User } from './User'

export type ChatMessage = {
  message: string
  user: User
  time: Date
  roomId: string
}
