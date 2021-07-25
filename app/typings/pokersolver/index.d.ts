declare module 'pokersolver' {
  interface CardPool {
    value: string
    suit: string
    rank: number
    wildValue: string
  }

  interface Card {
    value: string
    suit: string
    rank: number
    wildValue: string
  }

  interface D {
    value: string
    suit: string
    rank: number
    wildValue: string
  }

  interface S {
    value: string
    suit: string
    rank: number
    wildValue: string
  }

  interface C {
    value: string
    suit: string
    rank: number
    wildValue: string
  }

  interface H {
    value: string
    suit: string
    rank: number
    wildValue: string
  }

  interface Suits {
    d: D[]
    s: S[]
    c: C[]
    h: H[]
  }

  interface Game {
    descr: string
    cardsInHand: number
    handValues: any[]
    wildValue?: any
    wildStatus: number
    wheelStatus: number
    sfQualify: number
    lowestQualified?: any
    noKickers: boolean
  }

  interface HandI {
    cardPool: CardPool[]
    cards: Card[]
    suits: Suits
    values: any[][]
    wilds: any[]
    name: string
    game: Game
    sfLength: number
    alwaysQualifies: boolean
    rank: number
    descr: string
    isPossible: boolean
  }

  class Hand {
    solve: (cards: string[]) => HandI
  }
  const pokersolver: {
    Hand: Hand
  }

  export = pokersolver
}
