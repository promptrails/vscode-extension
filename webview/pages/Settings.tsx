import { useState, useEffect } from "react";
import { postMessage, onMessage } from "../vscode";

export function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const unsub = onMessage((msg: any) => {
      if (msg.type === "authStatus") {
        setSaving(false);
        setConnected(msg.connected);
        if (msg.connected) {
          setSaved(true);
        }
      }
    });
    // Check current status
    postMessage({ type: "getAuthStatus" });
    return unsub;
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setSaved(false);
    postMessage({ type: "setApiKey", key: apiKey.trim() });
    setApiKey("");
  };

  return (
    <div className="mx-auto max-w-md space-y-6 pt-8">
      <div>
        <h2 className="mb-1 text-lg font-semibold">Settings</h2>
        <p className="text-xs text-muted">Configure your PromptRails connection.</p>
      </div>

      {saved && connected && (
        <div
          className="rounded border p-3 text-xs"
          style={{ borderColor: "var(--border)", color: "#4ade80" }}
        >
          API key saved successfully. Use the sidebar to browse your resources.
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-xs font-medium">API Key</label>
        <input
          type="password"
          className="input-field"
          placeholder="pr_..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <p className="text-[11px] text-muted">
          Your API key is stored securely in VS Code&apos;s SecretStorage.
        </p>
      </div>

      <button
        className="btn-primary w-full"
        onClick={handleSave}
        disabled={!apiKey.trim() || saving}
      >
        {saving ? "Saving..." : "Save API Key"}
      </button>

      <div
        className="rounded border p-3 text-xs text-muted"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="mb-1 font-medium text-fg">API URL</p>
        <p>
          Configure via VS Code Settings: <code>promptrails.apiUrl</code>
        </p>
        <p className="mt-1">
          Default: <code>https://api.promptrails.ai</code>
        </p>
      </div>
    </div>
  );
}
