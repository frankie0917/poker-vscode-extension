import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { useStore } from '../../store'
import './Room.css'

export const Rooms = observer(() => {
  const roomsStore = useStore().rooms

  const [roomId, setRoomId] = useState('')

  return (
    <div>
      <button onClick={roomsStore.hostRoom}>Host</button>
      <div>
        <label htmlFor="room-id-input">Room id</label>
        <input
          id="room-id-input"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      {roomsStore.error && (
        <div className="rooms-error">{roomsStore.error}</div>
      )}
      <button
        disabled={roomsStore.loading}
        onClick={() => {
          roomsStore.joinRoom(roomId)
        }}
      >
        Join
      </button>
    </div>
  )
})
