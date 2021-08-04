import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'
import { CLIENT_EVT, SERVER_EVT } from '../../shared/EmitType'
import { Room } from '../../shared/Room'
import { ToastType } from './Toasts'

export class Rooms {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  room: Room | null = null
  error: string | null = null
  loading = false
  leaving = false

  onUserLeft = () => {
    this.root.on(SERVER_EVT.userLeft, ({ room, userName }) => {
      this.room = room
      this.root.toasts.showToast(ToastType.userLeft, `${userName} left`)
    })
  }

  hostRoom = () => {
    if (!this.root.user.data) return

    this.root.emit(CLIENT_EVT.hostRoom, {
      user: this.root.user.data,
    })

    this.root.on(SERVER_EVT.hostRoomRes, ({ room }) => {
      this.room = room
    })
    this.onUserLeft()
  }

  joinRoom = (id: string) => {
    this.loading = true
    this.error = null
    this.root.emit(CLIENT_EVT.joinRoom, { id, user: this.root.user.data! })

    this.root.on(SERVER_EVT.joinRoomRes, ({ error, room }) => {
      if (error || !room) {
        this.error = error ?? 'not found'
      } else {
        this.room = room
      }
      this.loading = false
    })

    this.root.on(SERVER_EVT.roomClosed, () => {
      this.root.toasts.showToast(ToastType.roomClosed, 'Room closed')
      this.room = null
    })
    this.onUserLeft()
  }

  leaveRoom = () => {
    if (this.room === null) return

    this.leaving = true

    this.root.emit(CLIENT_EVT.leaveRoom, {
      roomId: this.room.id,
      userName: this.root.user.data!.name,
    })

    this.root.on(SERVER_EVT.leaveRoomRes, () => {
      this.room = null
      this.leaving = false
    })
  }
}
