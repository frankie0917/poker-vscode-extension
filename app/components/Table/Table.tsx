import React, { useEffect, useState } from 'react'
// @ts-ignore
import { ReactComponent as TableSvg } from './table.svg'
// @ts-ignore
import { ReactComponent as ChipSvg } from './chip.svg'
import './Table.css'
import { observer } from 'mobx-react'
import { useStore } from '../../store'
import { Topbar } from './Topbar/Topbar'

export const Table = observer(() => {
  const { rooms, user } = useStore()

  useEffect(() => {
    rooms.receiveGameUpdate()
  }, [])

  const renderPlayer = (index: number) => {
    let status, avatarUrl, name, money, role

    const player = rooms.room?.game.players[index]
    const user = rooms.room?.players[index]
    if (!user) return

    if (player) {
      status = player.status
      avatarUrl = player.data.avatarUrl
      name = player.data.name
      money = player.money
      role = player.role
    } else {
      avatarUrl = user.avatarUrl
      name = user.name
    }

    return (
      <div className={`player ${status ? status : ''}`}>
        <div>
          <img className={`player-img`} src={avatarUrl} />
          <div className="player-name" data-content={name}>
            {name}
          </div>
        </div>
        {status && (
          <div className="player-info">
            <div className="player-chip">
              <ChipSvg /> <div>{money}</div>
            </div>
            {role !== 'normal' && (
              <div style={{ whiteSpace: 'nowrap' }}>{role}</div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Topbar />
      <div className="Table">
        <div className="table-svg">
          <TableSvg />
          <div className="left-col col">
            {renderPlayer(7)}
            {renderPlayer(6)}
            {renderPlayer(5)}
          </div>
          <div className="mid-col col">
            {renderPlayer(0)}
            {renderPlayer(4)}
          </div>
          <div className="right-col col">
            {renderPlayer(1)}
            {renderPlayer(2)}
            {renderPlayer(3)}
          </div>
        </div>
      </div>
    </>
  )
})
