import * as vscode from "vscode";
import { PromptRails } from "@promptrails/sdk";
import { CONFIG, SECRETS } from "./constants";

let client: PromptRails | null = null;

export function getApiUrl(): string {
  return (
    vscode.workspace.getConfiguration().get<string>(CONFIG.apiUrl) ||
    "https://api.promptrails.ai"
  );
}

export async function getApiKey(
  secrets: vscode.SecretStorage,
): Promise<string | undefined> {
  return secrets.get(SECRETS.apiKey);
}

export async function setApiKey(
  secrets: vscode.SecretStorage,
  key: string,
): Promise<void> {
  await secrets.store(SECRETS.apiKey, key);
  client = null; // Force re-init
}

export async function clearApiKey(secrets: vscode.SecretStorage): Promise<void> {
  await secrets.delete(SECRETS.apiKey);
  client = null;
}

export async function getClient(
  secrets: vscode.SecretStorage,
): Promise<PromptRails | null> {
  if (client) return client;

  const apiKey = await getApiKey(secrets);
  if (!apiKey) return null;

  client = new PromptRails({
    apiKey,
    baseUrl: getApiUrl(),
  });

  return client;
}

export function resetClient(): void {
  client = null;
}
