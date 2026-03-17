import * as vscode from "vscode";
import { PanelManager } from "./panel/PanelManager";
import { registerAuthCommands } from "./commands/auth";
import { resetClient } from "./client";

export function activate(context: vscode.ExtensionContext): void {
  const panelManager = PanelManager.getInstance(context);

  // Open Dashboard command (also triggered from activity bar welcome view)
  context.subscriptions.push(
    vscode.commands.registerCommand("promptrails.openPanel", () => {
      panelManager.openPanel();
    }),
  );

  // Register auth commands
  context.subscriptions.push(...registerAuthCommands(context));

  // Re-init client on config change
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("promptrails.apiUrl")) {
        resetClient();
      }
    }),
  );
}

export function deactivate(): void {
  // nothing to clean up
}
