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
      type: "previewPrompt";
      promptId: string;
      input?: Record<string, unknown>;
      versionId?: string;
    }
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
  | { type: "cancelExecution"; executionId: string }
  | { type: "setApiKey"; key: string }
  | { type: "getAuthStatus" };

// Extension → Webview (responses)
import type { StreamEvent } from "@promptrails/sdk";

export type ExtensionMessage =
  | { type: "response"; requestType: string; data: unknown; error?: string }
  | { type: "authStatus"; connected: boolean; apiUrl: string }
  | {
      type: "executionStarted";
      executionId: string;
      traceId?: string;
    }
  | { type: "executionEvent"; event: StreamEvent };
