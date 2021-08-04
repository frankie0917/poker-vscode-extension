import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'
import { CLIENT_EVT, SERVER_EVT } from '../../shared/EmitType'
import { ClientPlayer } from '../../shared/Game'
import { ClientRoom } from '../../shared/Room'

export class Rooms {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  room: ClientRoom | null = null
  player: ClientPlayer | null = null
  error: string | null = null
  loading = false
  leaving = false

  onUserJoin = () => {
    this.root.on(SERVER_EVT.userJoin, ({ room, userName }) => {
      this.room = room
      this.root.toasts.showToast(userName + ' joined')
    })
  }

  onUserLeft = () => {
    this.root.on(SERVER_EVT.userLeft, ({ room, userName }) => {
      this.room = room
      this.root.toasts.showToast(`${userName} left`)
    })
  }

  listenRoomEvents = () => {
    this.onUserJoin()
    this.onUserLeft()
    this.onPreflop()
  }

  hostRoom = () => {
    if (!this.root.user.data) return

    this.root.emit(CLIENT_EVT.hostRoom, {
      user: this.root.user.data,
    })

    this.root.on(SERVER_EVT.hostRoomRes, ({ room }) => {
      this.room = room
    })
    this.listenRoomEvents()
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
      this.root.toasts.showToast('Room closed')
      this.room = null
    })
    this.listenRoomEvents()
  }

  leaveRoom = () => {
    if (this.room === null) return

    this.leaving = true

    this.root.emit(CLIENT_EVT.leaveRoom, {
      userName: this.root.user.data!.name,
    })

    this.root.on(SERVER_EVT.leaveRoomRes, () => {
      this.room = null
      this.leaving = false
    })
  }

  receiveGameUpdate = () => {}

  startGame = (data: {
    blinds: {
      small: number
      big: number
    }
    money: number
  }) => {
    this.root.emit(CLIENT_EVT.startGame, data)
  }

  onPreflop = () => {
    this.root.on(SERVER_EVT.preflop, ({ player, room }) => {
      this.room = room
      this.player = player
    })
  }
}
