import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'
import { CLIENT_EVT, SERVER_EVT } from '../../shared/EmitType'
import { Room } from '../../shared/Room'

export class Rooms {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  room: Room | null = null
  error: string | null = null
  loading = false

  hostRoom = () => {
    if (!this.root.user.data) return

    this.root.emit(CLIENT_EVT.hostRoom, {
      user: this.root.user.data,
    })

    this.root.on(SERVER_EVT.hostRoomRes, ({ room }) => {
      this.room = room
    })
  }
  joinRoom = (id: string) => {
    this.loading = true
    this.error = null
    this.root.emit(CLIENT_EVT.joinRoom, { id })

    this.root.on(SERVER_EVT.joinRoomRes, ({ error, room }) => {
      if (error || !room) {
        this.error = error ?? 'not found'
      } else {
        this.room = room
      }
      this.loading = false
    })
  }
}
