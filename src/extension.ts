import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'vs-poker-sidebar',
      sidebarProvider,
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vstodo.refresh', async () => {
      await vscode.commands.executeCommand('workbench.action.closeSidebar');
      await vscode.commands.executeCommand(
        'workbench.view.extension.vs-poker-sidebar-view',
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          'workbench.action.webview.openDeveloperTools',
        );
      }, 500);
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vs-poker.helloWorld', () => {
      vscode.window.showInformationMessage('Hello World from vs-poker!');
    }),
  );
}

export function deactivate() {}
