import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { useStore } from '../../store'
import './Bottombar.css'

export const Bottombar = observer(() => {
  const user = useStore().user

  useEffect(() => {
    window.addEventListener(
      'message',
      (e: { data: { userInfo: { avatar_url: string; name: string } } }) => {
        user.setUser({
          avavatarUrl: e.data.userInfo.avatar_url,
          name: e.data.userInfo.name,
        })
      }
    )
    user.login()
  }, [])

  if (!user.data)
    return (
      <div className="Bottombar">
        <button onClick={user.login}>Login</button>
      </div>
    )

  return (
    <div className="Bottombar">
      <img className="avatar" src={user.data.avavatarUrl} alt="user" />
      <div>{user.data.name}</div>
    </div>
  )
})
