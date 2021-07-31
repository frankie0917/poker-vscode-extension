import { ReactNode } from 'react'

export {}

declare module '*.css' {
  const styles: string
  export default styles
}
declare module '*.svg?component' {
  const ReactComponent: ReactNode

  export default ReactComponent
}
declare module '*.svg' {
  const ReactComponent: ReactNode

  export default ReactComponent
}

declare global {
  interface Window {
    vscode: {
      postMessage: (message: unknown) => void
    }
  }
}
