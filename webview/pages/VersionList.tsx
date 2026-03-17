import { useEffect, useState } from "react";
import { useAgentVersions } from "../hooks/useAgents";
import { usePromptVersions } from "../hooks/usePrompts";
import { useDataSourceVersions } from "../hooks/useDataSources";
import { JsonViewer } from "../components/JsonViewer";
import { timeAgo } from "../lib/utils";
import type { View } from "../App";

interface VersionListProps {
  resourceType: "agent" | "prompt" | "dataSource";
  resourceId: string;
  resourceName: string;
  navigate: (view: View) => void;
}

function VersionCard({ v, onPromote }: { v: any; onPromote: (id: string) => void }) {
  const [expanded, setExpanded] = useState(v.is_current);
  const config = v.config || {};

  // Extract key fields from config for quick preview
  const model = config.model || config.llm_model_id;
  const systemPrompt = config.system_prompt;
  const temperature = config.temperature;
  const maxTokens = config.max_tokens;
  const tools = config.tools;
  const description = v.description || config.description;
  const changeNotes = v.change_notes || v.notes;

  return (
    <div
      className="rounded border"
      style={{ borderColor: v.is_current ? "var(--accent)" : "var(--border)" }}
    >
      {/* Header — always visible */}
      <button
        className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-input/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted">{expanded ? "\u25BE" : "\u25B8"}</span>
          <span className="text-sm font-medium">v{v.version_number ?? v.version}</span>
          {v.is_current && (
            <span className="rounded bg-green-800/40 px-2 py-0.5 text-[10px] text-green-300">
              Current
            </span>
          )}
          {model && <span className="badge">{model}</span>}
          {v.created_at && (
            <span className="text-xs text-muted">{timeAgo(v.created_at)}</span>
          )}
        </div>
        {!v.is_current && (
          <button
            className="btn-secondary text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onPromote(v.id);
            }}
          >
            Promote
          </button>
        )}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div
          className="space-y-3 border-t px-3 py-3"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Quick info fields */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {description && (
              <div className="col-span-2">
                <span className="font-medium text-muted">Description: </span>
                <span className="text-fg">{description}</span>
              </div>
            )}
            {changeNotes && (
              <div className="col-span-2">
                <span className="font-medium text-muted">Change Notes: </span>
                <span className="text-fg">{changeNotes}</span>
              </div>
            )}
            {model && (
              <div>
                <span className="font-medium text-muted">Model: </span>
                <span className="text-fg">{model}</span>
              </div>
            )}
            {temperature != null && (
              <div>
                <span className="font-medium text-muted">Temperature: </span>
                <span className="text-fg">{temperature}</span>
              </div>
            )}
            {maxTokens != null && (
              <div>
                <span className="font-medium text-muted">Max Tokens: </span>
                <span className="text-fg">{maxTokens}</span>
              </div>
            )}
            {tools && Array.isArray(tools) && tools.length > 0 && (
              <div className="col-span-2">
                <span className="font-medium text-muted">Tools: </span>
                <span className="text-fg">{tools.join(", ")}</span>
              </div>
            )}
          </div>

          {/* System prompt if present */}
          {systemPrompt && (
            <div>
              <span className="text-xs font-medium text-muted">System Prompt</span>
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-input p-2 text-xs">
                {systemPrompt}
              </pre>
            </div>
          )}

          {/* Full version data */}
          <JsonViewer data={v} label="Full Version Data" />
        </div>
      )}
    </div>
  );
}

export function VersionList({
  resourceType,
  resourceId,
  resourceName,
  navigate,
}: VersionListProps) {
  const agentVersions = useAgentVersions(resourceId);
  const promptVersions = usePromptVersions(resourceId);
  const dsVersions = useDataSourceVersions(resourceId);

  const hook =
    resourceType === "agent"
      ? agentVersions
      : resourceType === "prompt"
        ? promptVersions
        : dsVersions;

  useEffect(() => {
    hook.fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceType, resourceId]);

  const handleBack = () => {
    switch (resourceType) {
      case "agent":
        navigate({ page: "agent", id: resourceId });
        break;
      case "prompt":
        navigate({ page: "prompt", id: resourceId });
        break;
      case "dataSource":
        navigate({ page: "dataSource", id: resourceId });
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button className="btn-secondary text-xs" onClick={handleBack}>
          &larr; Back
        </button>
        <h2 className="text-lg font-semibold">{resourceName} — Versions</h2>
        {hook.versions.length > 0 && (
          <span className="text-xs text-muted">
            {hook.versions.length} version
            {hook.versions.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {hook.error && <div className="text-xs text-error">Error: {hook.error}</div>}

      {hook.loading ? (
        <div className="text-xs text-muted">Loading versions...</div>
      ) : hook.versions.length === 0 && !hook.error ? (
        <div className="text-xs text-muted">No versions found.</div>
      ) : (
        <div className="space-y-2">
          {hook.versions.map((v: any) => (
            <VersionCard key={v.id} v={v} onPromote={hook.promote} />
          ))}
        </div>
      )}
    </div>
  );
}
