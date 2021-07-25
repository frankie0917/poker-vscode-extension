import React from 'react'
import { useContext } from 'react'
import { PropsWithChildren } from 'react'
import { User } from './User'

export const StoreDefaultValue = {
  user: new User(),
}

export const StoreContext = React.createContext(StoreDefaultValue)

export const StoreContextProvider = ({ children }: PropsWithChildren<{}>) => (
  <StoreContext.Provider value={StoreDefaultValue}>
    {children}
  </StoreContext.Provider>
)

export const useStore = () => useContext(StoreContext)
