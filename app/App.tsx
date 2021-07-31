import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useStore } from './store'
import { Bottombar } from './components/Bottombar/Bottombar'
import { Table } from './components/Table/Table'
import { Rooms } from './components/Rooms/Rooms'

function App() {
  const store = useStore()

  return (
    <div className="App">
      {store.rooms.room === null ? <Rooms /> : <Table />}
      <Bottombar />
    </div>
  )
}

export default observer(App)
