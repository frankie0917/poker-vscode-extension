import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useStore } from './store'
import { Bottombar } from './components/Bottombar/Bottombar'
import { Table } from './components/Table/Table'

function App() {
  const store = useStore()

  return (
    <div className="App">
      <Table />
      <button
        onClick={() => {
          store.socket.emit('hello')
        }}
      >
        123
      </button>
      <Bottombar />
    </div>
  )
}

export default observer(App)
