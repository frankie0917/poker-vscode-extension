import React, { useEffect, useState } from 'react'
import 'firebase/database'
import { observer } from 'mobx-react'
import { useStore } from './store'
import { Bottombar } from './components/Bottombar/Bottombar'

function App() {
  return (
    <div className="App">
      <Bottombar />
    </div>
  )
}

export default observer(App)
