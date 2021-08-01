import * as vscode from 'vscode'
import { Credentials } from './credentials'

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView
  _doc?: vscode.TextDocument
  private readonly _extensionUri: vscode.Uri
  constructor(private readonly context: vscode.ExtensionContext) {
    this._extensionUri = context.extensionUri
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    }

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview)

    const getUserInfo = async () => {
      const credentials = new Credentials()
      await credentials.initialize(this.context)

      const octokit = await credentials.getOctokit()
      const userInfo = await octokit.users.getAuthenticated()

      webviewView.webview.postMessage({ userInfo: userInfo.data })
    }

    getUserInfo()

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'login': {
          getUserInfo()
          break
        }
        case 'onInfo': {
          if (!data.value) {
            return
          }
          vscode.window.showInformationMessage(data.value)
          break
        }
        case 'onError': {
          if (!data.value) {
            return
          }
          vscode.window.showErrorMessage(data.value)
          break
        }
      }
    })
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'app', 'media', 'reset.css')
    )
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'app', 'media', 'vscode.css')
    )

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'index.js')
    )
    const nonce = getNonce()

    return `<!DOCTYPE html>
			<html lang="en" style="width:100%; height: 100%;">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}' 'unsafe-eval';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
			</head>
      <body>
        <script nonce="${nonce}">
          window.vscode = acquireVsCodeApi();
        </script>
				<div id="root"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
  }
}

function getNonce() {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
