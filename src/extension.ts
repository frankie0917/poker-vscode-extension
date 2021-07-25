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

  let disposable = vscode.commands.registerCommand(
    'vs-poker.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from vs-poker!');
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
