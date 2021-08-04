import React, { useEffect, useState } from 'react'
import './Chat.css'
import { observer } from 'mobx-react'
import { useStore } from '../../store'

export const Chat = observer(() => {
  const { chat, user } = useStore()
  const [message, setMessage] = useState('')
  useEffect(() => {
    chat.receiveMessage()
  }, [])
  return (
    <div className="Chat">
      <div className="chat-msg-wrap">
        {chat.messages.map((msg) => {
          const isSelf = msg.user.name === user.data?.name
          return (
            <div
              className="chat-msg"
              style={{
                flexDirection: isSelf ? 'row-reverse' : 'row',
              }}
            >
              <img src={msg.user.avatarUrl} className="chat-msg-img" />
              <div className="chat-msg-content-wrap">
                {!isSelf && (
                  <div className="chat-msg-name">{msg.user.name}</div>
                )}
                <div className="chat-msg-content">{msg.message}</div>
              </div>
            </div>
          )
        })}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault()
          chat.sendMessage(message)
          setMessage('')
        }}
      >
        <input
          type="text"
          value={message}
          placeholder="Write message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
})
