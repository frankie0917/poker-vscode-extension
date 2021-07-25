export {}

declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.css' {
  const styles: string
  export default styles
}

declare global {
  interface Window {
    vscode: {
      postMessage: (message: unknown) => void
    }
  }
}
