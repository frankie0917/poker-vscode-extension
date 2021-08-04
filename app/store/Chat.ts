import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'
import { ChatMessage } from '../../shared/ChatMessage'
import { CLIENT_EVT, SERVER_EVT } from '../../shared/EmitType'

export class Chat {
  messages: Omit<ChatMessage, 'roomId'>[] = []
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  receiveMessage = () => {
    this.root.on(SERVER_EVT.userMessage, (data) => {
      this.messages.push(data)
    })
  }

  sendMessage = (message: string) => {
    if (!this.root.user.data || !this.root.rooms.room) return

    this.root.emit(CLIENT_EVT.userMessage, {
      user: this.root.user.data,
      roomId: this.root.rooms.room.id,
      message,
      time: new Date(),
    })
  }
}
