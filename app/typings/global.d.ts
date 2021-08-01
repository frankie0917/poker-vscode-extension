import { ReactNode } from 'react'

export {}

declare module '*.css' {
  const styles: string
  export default styles
}
declare module '*.svg' {
  export const ReactComponent: ReactNode
}

declare global {
  interface Window {
    vscode: {
      postMessage: (message: unknown) => void
    }
  }
}
