import { useEffect, useState } from "react";
import type { View } from "../App";
import { request } from "../vscode";
import { SidebarItem } from "./SidebarItem";
import { SidebarSection } from "./SidebarSection";

interface SidebarProps {
  connected: boolean;
  currentView: View;
  navigate: (view: View) => void;
}

interface Agent {
  id: string;
  name: string;
  type: string;
}

interface Prompt {
  id: string;
  name: string;
}

interface DataSource {
  id: string;
  name: string;
  type: string;
}

function extractList<T>(res: any): T[] {
  if (res?.data && Array.isArray(res.data)) return res.data;
  if (res?.items && Array.isArray(res.items)) return res.items;
  if (Array.isArray(res)) return res;
  return [];
}

export function Sidebar({ connected, currentView, navigate }: SidebarProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!connected) return;

    let cancelled = false;
    const load = async () => {
      try {
        const [agentsRes, promptsRes, dsRes] = await Promise.all([
          request<any>({ type: "getAgents", page: 1 }),
          request<any>({ type: "getPrompts", page: 1 }),
          request<any>({ type: "getDataSources", page: 1 }),
        ]);
        if (cancelled) return;
        setAgents(extractList(agentsRes));
        setPrompts(extractList(promptsRes));
        setDataSources(extractList(dsRes));
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    setLoading(true);
    setError(null);
    load();
    return () => {
      cancelled = true;
    };
  }, [connected]);

  const isActive = (page: string, id?: string) => {
    if (currentView.page === page && id) {
      return "id" in currentView && (currentView as any).id === id;
    }
    return currentView.page === page;
  };

  return (
    <aside className="bg-sidebar flex w-52 flex-shrink-0 flex-col overflow-y-auto border-r border-vscode">
      <div className="flex items-center justify-between border-b border-vscode px-3 py-2">
        <span className="text-sm font-semibold">PromptRails</span>
        <button
          className="text-muted hover:text-fg text-xs"
          onClick={() => navigate({ page: "settings" })}
          title="Settings"
        >
          &#9881;
        </button>
      </div>

      {!connected ? (
        <div className="p-3 text-xs text-muted">Set API key to get started</div>
      ) : loading ? (
        <div className="p-3 text-xs text-muted">Loading...</div>
      ) : (
        <div className="flex-1">
          {error && <div className="p-2 text-xs text-error">{error}</div>}

          <SidebarSection title="Agents" count={agents.length}>
            {agents.map((a) => (
              <SidebarItem
                key={a.id}
                label={a.name}
                badge={a.type}
                active={isActive("agent", a.id)}
                onClick={() => navigate({ page: "agent", id: a.id })}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Prompts" count={prompts.length}>
            {prompts.map((p) => (
              <SidebarItem
                key={p.id}
                label={p.name}
                active={isActive("prompt", p.id)}
                onClick={() => navigate({ page: "prompt", id: p.id })}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="Data Sources" count={dataSources.length}>
            {dataSources.map((ds) => (
              <SidebarItem
                key={ds.id}
                label={ds.name}
                badge={ds.type}
                active={isActive("dataSource", ds.id)}
                onClick={() => navigate({ page: "dataSource", id: ds.id })}
              />
            ))}
          </SidebarSection>
        </div>
      )}
    </aside>
  );
}
