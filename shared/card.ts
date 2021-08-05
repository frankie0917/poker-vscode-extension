export type Rank =
  | 'ace'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'jack'
  | 'queen'
  | 'king'
  | string

export const parseRank = (rank: Rank) => {
  switch (rank) {
    case 'ace':
      return 'A'
    case 'jack':
      return 'J'
    case 'queen':
      return 'Q'
    case 'king':
      return 'K'
    default:
      return rank
  }
}
