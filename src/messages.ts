// Webview → Extension (requests)
export type WebviewMessage =
  | { type: "getAgents"; page: number }
  | { type: "getAgent"; id: string }
  | { type: "executeAgent"; agentId: string; input: Record<string, unknown> }
  | { type: "getAgentVersions"; agentId: string }
  | { type: "promoteAgentVersion"; agentId: string; versionId: string }
  | { type: "getPrompts"; page: number }
  | { type: "getPrompt"; id: string }
  | {
      type: "runPrompt";
      promptId: string;
      userPrompt: string;
      llmModelId?: string;
      input?: Record<string, unknown>;
    }
  | { type: "previewPrompt"; promptId: string; input: Record<string, unknown> }
  | { type: "getPromptVersions"; promptId: string }
  | { type: "promotePromptVersion"; promptId: string; versionId: string }
  | { type: "getDataSources"; page: number }
  | { type: "getDataSource"; id: string }
  | { type: "queryDataSource"; id: string; parameters: Record<string, unknown> }
  | { type: "getDataSourceVersions"; dataSourceId: string }
  | {
      type: "promoteDataSourceVersion";
      dataSourceId: string;
      versionId: string;
    }
  | { type: "getTraces"; traceId: string }
  | { type: "setApiKey"; key: string }
  | { type: "getAuthStatus" };

// Extension → Webview (responses)
export type ExtensionMessage =
  | { type: "response"; requestType: string; data: unknown; error?: string }
  | { type: "authStatus"; connected: boolean; apiUrl: string };
