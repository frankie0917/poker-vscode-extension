import { makeAutoObservable } from 'mobx'
import React from 'react'
import { useContext } from 'react'
import { PropsWithChildren } from 'react'
import { User } from './User'
import io from 'socket.io-client'
import { Rooms } from './Rooms'
import {
  CLIENT_EVT,
  ClientEvtDataMap,
  SERVER_EVT,
  ServerEvtDataMap,
} from '../../shared/EmitType'
import { version } from 'uuid'

export class RootStore {
  user: User
  rooms: Rooms
  socket: SocketIOClient.Socket
  constructor() {
    makeAutoObservable(this)
    this.user = new User(this)
    this.rooms = new Rooms(this)
    this.socket = io('http://localhost:5000')
  }

  emit = <T extends CLIENT_EVT>(type: T, data: ClientEvtDataMap[T]) => {
    this.socket.emit(type, data)
  }
  on = <T extends SERVER_EVT>(
    type: T,
    callback: (data: ServerEvtDataMap[T]) => void
  ) => {
    this.socket.on(type, callback)
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
