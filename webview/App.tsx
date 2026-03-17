import { useState, useEffect, useCallback } from "react";
import { postMessage, onMessage } from "./vscode";
import { Sidebar } from "./components/Sidebar";
import { StatusBar } from "./components/StatusBar";
import { Settings } from "./pages/Settings";
import { Welcome } from "./pages/Welcome";
import { AgentDetail } from "./pages/AgentDetail";
import { PromptDetail } from "./pages/PromptDetail";
import { DataSourceDetail } from "./pages/DataSourceDetail";
import { VersionList } from "./pages/VersionList";

export type View =
  | { page: "welcome" }
  | { page: "settings" }
  | { page: "agent"; id: string }
  | { page: "prompt"; id: string }
  | { page: "dataSource"; id: string }
  | { page: "agentVersions"; agentId: string; name: string }
  | { page: "promptVersions"; promptId: string; name: string }
  | { page: "dataSourceVersions"; dataSourceId: string; name: string };

interface AuthStatus {
  connected: boolean;
  apiUrl: string;
}

export function App() {
  const [auth, setAuth] = useState<AuthStatus | null>(null);
  const [view, setView] = useState<View>({ page: "welcome" });

  useEffect(() => {
    const unsub = onMessage((msg: any) => {
      if (msg.type === "authStatus") {
        const status = { connected: msg.connected, apiUrl: msg.apiUrl };
        setAuth(status);
        // First load: if not connected, show settings
        if (!msg.connected && view.page === "welcome") {
          setView({ page: "settings" });
        }
      }
    });

    postMessage({ type: "getAuthStatus" });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useCallback((v: View) => setView(v), []);

  // Still loading auth status
  if (auth === null) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted">
        Loading...
      </div>
    );
  }

  const renderContent = () => {
    // Not connected and trying to access a resource → show settings
    if (!auth.connected && view.page !== "settings") {
      return <Settings />;
    }

    switch (view.page) {
      case "welcome":
        return <Welcome />;
      case "settings":
        return <Settings />;
      case "agent":
        return <AgentDetail id={view.id} navigate={navigate} />;
      case "prompt":
        return <PromptDetail id={view.id} navigate={navigate} />;
      case "dataSource":
        return <DataSourceDetail id={view.id} navigate={navigate} />;
      case "agentVersions":
        return (
          <VersionList
            resourceType="agent"
            resourceId={view.agentId}
            resourceName={view.name}
            navigate={navigate}
          />
        );
      case "promptVersions":
        return (
          <VersionList
            resourceType="prompt"
            resourceId={view.promptId}
            resourceName={view.name}
            navigate={navigate}
          />
        );
      case "dataSourceVersions":
        return (
          <VersionList
            resourceType="dataSource"
            resourceId={view.dataSourceId}
            resourceName={view.name}
            navigate={navigate}
          />
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1">
        <Sidebar connected={auth.connected} currentView={view} navigate={navigate} />
        <main className="flex-1 overflow-y-auto p-4">{renderContent()}</main>
      </div>
      <StatusBar connected={auth.connected} apiUrl={auth.apiUrl} />
    </div>
  );
}
