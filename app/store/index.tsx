import { makeAutoObservable } from 'mobx'
import React from 'react'
import { useContext } from 'react'
import { PropsWithChildren } from 'react'
import { User } from './User'
import io from 'socket.io-client'

export class RootStore {
  user: User
  socket: SocketIOClient.Socket
  constructor() {
    makeAutoObservable(this)
    this.user = new User(this)
    this.socket = io('http://localhost:5000')

    this.socket.on('world', (data: any) => {
      console.log('data', data)
    })
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
