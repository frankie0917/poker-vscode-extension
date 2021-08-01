import { observer } from 'mobx-react'
import React from 'react'
import { useStore } from '../../../store'
import './Topbar.css'

export const Topbar = observer(() => {
  const rooms = useStore().rooms
  return (
    <div className="Topbar">
      <div>Room ID: {rooms.room?.id}</div>
      {rooms.leaving ? (
        <div>Leaving...</div>
      ) : (
        <div style={{ cursor: 'pointer' }} onClick={rooms.leaveRoom}>
          Leave
        </div>
      )}
    </div>
  )
})
