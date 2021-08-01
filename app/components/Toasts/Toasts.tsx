import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useMemo } from 'react'
import { useStore } from '../../store'
import './Toasts.css'

export const Toasts = observer(() => {
  const store = useStore().toasts

  const toasts = useMemo(() => {
    return store.toasts.filter(({ isOpen }) => isOpen)
  }, [toJS(store.toasts)])

  return (
    <div className="Toasts">
      {toasts.map(({ message }, i) => (
        <div className="toast" key={i}>
          {message}
        </div>
      ))}
    </div>
  )
})
