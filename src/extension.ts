import * as vscode from 'vscode'
import { SidebarProvider } from './SidebarProvider'

export async function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context)

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'vs-poker-sidebar',
      sidebarProvider
    )
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('vs-poker.refresh', async () => {
      await vscode.commands.executeCommand('workbench.action.closeSidebar')
      await vscode.commands.executeCommand(
        'workbench.view.extension.vs-poker-sidebar-view'
      )
      setTimeout(() => {
        vscode.commands.executeCommand(
          'workbench.action.webview.openDeveloperTools'
        )
      }, 500)
    })
  )
}

export function deactivate() {}
