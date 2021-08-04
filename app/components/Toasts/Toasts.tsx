import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useEffect, useMemo } from 'react'
import { useStore } from '../../store'
import './Toasts.css'

export const Toasts = observer(() => {
  const store = useStore().toasts

  return (
    <div className="Toasts">
      {store.toasts
        .filter(({ isOpen }) => isOpen)
        .map(({ message }, i) => (
          <div className="toast" key={i}>
            {message}
          </div>
        ))}
    </div>
  )
})
