import React from 'react'
// @ts-ignore
import TableSvg from './table.svg?component'
import './Table.css'
import { observer } from 'mobx-react'

export const Table = observer(() => {
  return (
    <div className="Table">
      <div className="table-svg">
        <TableSvg />
      </div>
    </div>
  )
})
