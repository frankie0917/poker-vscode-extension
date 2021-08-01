import React from 'react'
// @ts-ignore
import { ReactComponent as TableSvg } from './table.svg'
import './Table.css'
import { observer } from 'mobx-react'
import { useStore } from '../../store'
import { Topbar } from './Topbar/Topbar'

export const Table = observer(() => {
  const store = useStore()
  return (
    <>
      <Topbar />
      <div className="Table">
        <div className="table-svg">
          <TableSvg />
        </div>
      </div>
    </>
  )
})
