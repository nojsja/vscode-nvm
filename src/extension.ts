'use strict';
import * as vscode from 'vscode';

async function executableIsAvailable(name: string) {
  command = `which ${name}`
  const { code } = await TerminalWrapper.execInTerminal(command).waitForResult();
  return !code
}

async function use(x: vscode.Terminal) {
  if (await executableIsAvailable("fnm")) {
    x.sendText('fnm use');
  } else if (await executableIsAvailable("nvm")) {
    var isWin = process.platform === "win32";
    if (isWin) {
      x.sendText(`nvm use $(Get-Content .nvmrc).replace( 'v', '' )`);
    }
    else {
      x.sendText('nvm use');
    }
  } else {
    vscode.window.showErrorMessage(
      "either 'nvm' or 'fnm' is required."
    );
  }
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-nvm-fnm" is now active!');

  const terminals = (<any>vscode.window).terminals;
  if (terminals.length) {
    // console.log("Found opened terminals, let's change node version");
    terminals.forEach(function switchNode(t: vscode.Terminal) {
      use(t);
    });
  }
  (<any>vscode.window).onDidOpenTerminal((e: vscode.Terminal) => {
    // console.log('Terminal opened: ');
    use(e);
  });
}

export function deactivate() { }
