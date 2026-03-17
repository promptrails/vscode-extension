// VS Code webview API bridge

interface VsCodeApi {
  postMessage(msg: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

const vscode = acquireVsCodeApi();

const pendingRequests = new Map<
  string,
  { resolve: (data: unknown) => void; reject: (err: Error) => void }
>();

// Listen for responses from extension host
window.addEventListener("message", (event) => {
  const msg = event.data;
  if (msg.type === "response" && msg.requestType) {
    const key = msg.requestType;
    const pending = pendingRequests.get(key);
    if (pending) {
      pendingRequests.delete(key);
      if (msg.error) {
        pending.reject(new Error(msg.error));
      } else {
        pending.resolve(msg.data);
      }
    }
  }
});

export function postMessage(msg: unknown): void {
  vscode.postMessage(msg);
}

export function request<T = unknown>(msg: Record<string, unknown>): Promise<T> {
  return new Promise((resolve, reject) => {
    const key = msg.type as string;
    // Cancel any pending request of the same type
    const existing = pendingRequests.get(key);
    if (existing) {
      existing.reject(new Error("Superseded"));
    }
    pendingRequests.set(key, {
      resolve: resolve as (data: unknown) => void,
      reject,
    });
    vscode.postMessage(msg);
  });
}

export function onMessage(handler: (msg: unknown) => void): () => void {
  const listener = (event: MessageEvent) => handler(event.data);
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
}
