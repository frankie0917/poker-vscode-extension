import React from 'react'
import './Card.css'
import { Rank, parseRank } from '../../../shared/card'
// @ts-ignore
import { ReactComponent as HeartsSvg } from './Hearts.svg'
// @ts-ignore
import { ReactComponent as ClubsSvg } from './Clubs.svg'
// @ts-ignore
import { ReactComponent as SpadesSvg } from './Spades.svg'
// @ts-ignore
import { ReactComponent as DiamondsSvg } from './Diamonds.svg'

export const Card = ({
  card,
  style,
}: {
  card?: {
    suit: 'Spades' | 'Diamonds' | 'Hearts' | 'Clubs' | string
    rank: Rank
  }
  style?: React.CSSProperties | undefined
}) => {
  if (!card) return <div className={`Card back`} style={style}></div>

  const getSuitIcon = () => {
    switch (card.suit) {
      case 'Clubs':
        return <ClubsSvg />
      case 'Hearts':
        return <HeartsSvg />
      case 'Spades':
        return <SpadesSvg />
      case 'Diamonds':
        return <DiamondsSvg />
    }
  }
  return (
    <div className={`Card`} style={style}>
      <div className="card-suit">{getSuitIcon()}</div>
      <div className="card-rank">{parseRank(card.rank)} </div>
    </div>
  )
}
