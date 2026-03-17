import * as vscode from "vscode";
import { setApiKey, clearApiKey } from "../client";

export function registerAuthCommands(
  context: vscode.ExtensionContext,
): vscode.Disposable[] {
  const setCmd = vscode.commands.registerCommand("promptrails.setApiKey", async () => {
    const key = await vscode.window.showInputBox({
      prompt: "Enter your PromptRails API Key",
      password: true,
      placeHolder: "pr_...",
      ignoreFocusOut: true,
    });

    if (key) {
      await setApiKey(context.secrets, key);
      vscode.window.showInformationMessage("PromptRails API key saved.");
    }
  });

  const clearCmd = vscode.commands.registerCommand(
    "promptrails.clearApiKey",
    async () => {
      await clearApiKey(context.secrets);
      vscode.window.showInformationMessage("PromptRails API key cleared.");
    },
  );

  return [setCmd, clearCmd];
}
