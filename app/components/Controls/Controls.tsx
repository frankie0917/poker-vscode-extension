import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { useStore } from '../../store'
import './Controls.css'

export const Controls = observer(() => {
  const { rooms, user, toasts } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [smallBlind, setSmallBlind] = useState(10)
  const [bigBlind, setBigBlind] = useState(20)
  const [money, setMoney] = useState(1500)

  const { room, player } = rooms
  if (!room || !user.data) return null

  const closeModal = () => {
    setIsOpen(false)
    setSmallBlind(10)
    setBigBlind(20)
    setMoney(1500)
  }

  const { host, game, players } = room
  const isHost = host.name === user.data.name

  return (
    <div>
      <div className="controls">
        {isHost && !game.running && (
          <button
            onClick={() => {
              if (players.length < 2) {
                toasts.showToast('Need at least 2 players')
                return
              }

              setIsOpen(true)
            }}
            disabled={isOpen}
          >
            Start game!
          </button>
        )}
      </div>
      {isOpen && (
        <form
          className="start-game-modal"
          onSubmit={(e) => {
            e.preventDefault()
            rooms.startGame({
              blinds: {
                small: smallBlind,
                big: bigBlind,
              },
              money,
            })
            closeModal()
          }}
        >
          <h2 style={{ textAlign: 'center' }}>Game settings</h2>
          <div>
            <label htmlFor="small-blind-input">Small blind</label>
            <input
              id="small-blind-input"
              value={smallBlind}
              onChange={(e) => setSmallBlind(Number(e.target.value))}
              type="number"
            />
          </div>
          <div>
            <label htmlFor="big-blind-input">Big blind</label>
            <input
              id="big-blind-input"
              value={bigBlind}
              onChange={(e) => setBigBlind(Number(e.target.value))}
              type="number"
            />
          </div>
          <div>
            <label htmlFor="money-input">Initial money</label>
            <input
              id="money-input"
              value={money}
              onChange={(e) => setMoney(Number(e.target.value))}
              type="number"
            />
          </div>
          <div style={{ display: 'flex' }}>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  )
})
