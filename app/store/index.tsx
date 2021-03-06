import { makeAutoObservable } from 'mobx'
import React from 'react'
import { useContext } from 'react'
import { PropsWithChildren } from 'react'
import { User } from './User'
import io, { Socket } from 'socket.io-client'
import { Rooms } from './Rooms'
import { Toasts } from './Toasts'
import { Chat } from './Chat'
import {
  CLIENT_EVT,
  ClientEvtDataMap,
  SERVER_EVT,
  ServerEvtDataMap,
} from '../../shared/EmitType'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'

export class RootStore {
  user: User
  rooms: Rooms
  toasts: Toasts
  chat: Chat
  socket: Socket<DefaultEventsMap, DefaultEventsMap>
  constructor() {
    makeAutoObservable(this)
    this.user = new User(this)
    this.rooms = new Rooms(this)
    this.toasts = new Toasts(this)
    this.chat = new Chat(this)
    this.socket = io('http://localhost:5000')
  }

  emit = <T extends CLIENT_EVT>(type: T, data: ClientEvtDataMap[T]) => {
    this.socket.emit(type, data)
  }
  on = <T extends SERVER_EVT>(
    type: T,
    callback: (data: ServerEvtDataMap[T]) => void
  ) => {
    this.socket.on(type, callback as any)
  }
}

export const StoreDefaultValue = new RootStore()

export const StoreContext = React.createContext(StoreDefaultValue)

export const StoreContextProvider = ({ children }: PropsWithChildren<{}>) => (
  <StoreContext.Provider value={StoreDefaultValue}>
    {children}
  </StoreContext.Provider>
)

export const useStore = () => useContext(StoreContext)
