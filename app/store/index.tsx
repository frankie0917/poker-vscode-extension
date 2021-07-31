import { makeAutoObservable } from 'mobx'
import React from 'react'
import { useContext } from 'react'
import { PropsWithChildren } from 'react'
import { User } from './User'

export class RootStore {
  user: User
  constructor() {
    makeAutoObservable(this)
    this.user = new User(this)
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
