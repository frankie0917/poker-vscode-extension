import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useStore } from './store'
import { Bottombar } from './components/Bottombar/Bottombar'
import { Table } from './components/Table/Table'

function App() {
  return (
    <div className="App">
      <Table />
      <Bottombar />
    </div>
  )
}

export default observer(App)
