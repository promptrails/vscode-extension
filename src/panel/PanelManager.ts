import * as vscode from "vscode";
import { getClient, setApiKey, getApiKey, getApiUrl } from "../client";
import { getHtml } from "./getHtml";
import type { WebviewMessage, ExtensionMessage } from "../messages";

export class PanelManager {
  private static instance: PanelManager | undefined;
  private panel?: vscode.WebviewPanel;

  private constructor(private readonly context: vscode.ExtensionContext) {}

  static getInstance(context: vscode.ExtensionContext): PanelManager {
    if (!PanelManager.instance) {
      PanelManager.instance = new PanelManager(context);
    }
    return PanelManager.instance;
  }

  openPanel(): void {
    // If panel already exists, reveal it
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      "promptrails.dashboard",
      "PromptRails",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, "dist")],
      },
    );

    // Set panel icon
    this.panel.iconPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "promptrails-icon.svg",
    );

    this.panel.webview.html = getHtml(this.panel.webview, this.context.extensionUri);

    this.panel.webview.onDidReceiveMessage(
      (msg: WebviewMessage) => this.handleMessage(msg),
      undefined,
      this.context.subscriptions,
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });
  }

  private async handleMessage(msg: WebviewMessage): Promise<void> {
    console.log("[PanelManager] received message:", msg.type);
    try {
      switch (msg.type) {
        case "getAuthStatus":
          return this.sendAuthStatus();

        case "setApiKey":
          await setApiKey(this.context.secrets, msg.key);
          return this.sendAuthStatus();

        case "getAgents":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.agents.list({ page: msg.page, limit: 50 }),
          );

        case "getAgent":
          return this.proxyCall(msg.type, async (sdk) => sdk.agents.get(msg.id));

        case "executeAgent":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.agents.execute(msg.agentId, { input: msg.input, sync: true }),
          );

        case "getAgentVersions":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.agents.listVersions(msg.agentId),
          );

        case "promoteAgentVersion":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.agents.promoteVersion(msg.agentId, msg.versionId),
          );

        case "getPrompts":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.prompts.list({ page: msg.page, limit: 50 }),
          );

        case "getPrompt":
          return this.proxyCall(msg.type, async (sdk) => sdk.prompts.get(msg.id));

        case "runPrompt":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.prompts.runPrompt(msg.promptId, {
              user_prompt: msg.userPrompt,
              llm_model_id: msg.llmModelId || "",
              ...(msg.input ? { input: msg.input } : {}),
            }),
          );

        case "previewPrompt":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.prompts.preview(msg.promptId, { input: msg.input }),
          );

        case "getPromptVersions":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.prompts.listVersions(msg.promptId),
          );

        case "promotePromptVersion":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.prompts.promoteVersion(msg.promptId, msg.versionId),
          );

        case "getDataSources":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.dataSources.list({ page: msg.page, limit: 50 }),
          );

        case "getDataSource":
          return this.proxyCall(msg.type, async (sdk) => sdk.dataSources.get(msg.id));

        case "queryDataSource":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.dataSources.query(msg.id, msg.parameters),
          );

        case "getDataSourceVersions":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.dataSources.listVersions(msg.dataSourceId),
          );

        case "promoteDataSourceVersion":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.dataSources.promoteVersion(msg.dataSourceId, msg.versionId),
          );

        case "getTraces":
          return this.proxyCall(msg.type, async (sdk) =>
            sdk.traces.getByTraceId(msg.traceId),
          );
      }
    } catch (err) {
      this.postMessage({
        type: "response",
        requestType: msg.type,
        data: null,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private async proxyCall(
    requestType: string,
    fn: (sdk: import("@promptrails/sdk").PromptRails) => Promise<unknown>,
  ): Promise<void> {
    const sdk = await getClient(this.context.secrets);
    if (!sdk) {
      this.postMessage({
        type: "response",
        requestType,
        data: null,
        error: "Not authenticated. Please set your API key.",
      });
      return;
    }

    try {
      const data = await fn(sdk);
      console.log("[PanelManager] success:", requestType);
      this.postMessage({ type: "response", requestType, data });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[PanelManager] error:", requestType, message);
      this.postMessage({
        type: "response",
        requestType,
        data: null,
        error: message,
      });
    }
  }

  private async sendAuthStatus(): Promise<void> {
    const apiKey = await getApiKey(this.context.secrets);
    this.postMessage({
      type: "authStatus",
      connected: !!apiKey,
      apiUrl: getApiUrl(),
    });
  }

  private postMessage(msg: ExtensionMessage): void {
    this.panel?.webview.postMessage(msg);
  }
}
