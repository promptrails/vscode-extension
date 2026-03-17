import { useEffect, useState, useMemo } from "react";
import { useAgentDetail, useExecuteAgent } from "../hooks/useAgents";
import { ParameterForm } from "../components/ParameterForm";
import type { Parameter } from "../components/ParameterForm";
import { JsonViewer } from "../components/JsonViewer";
import { StatusBadge } from "../components/StatusBadge";
import { TraceTree } from "../components/TraceTree";
import { SdkExamples } from "../components/SdkExamples";
import { formatDuration, formatCost } from "../lib/utils";
import { agentExecuteExamples } from "../lib/sdk-examples";
import { request } from "../vscode";
import type { View } from "../App";

interface AgentDetailProps {
  id: string;
  navigate: (view: View) => void;
}

/** Parse JSON Schema properties into Parameter[] */
function parseSchemaProperties(schema: any): Parameter[] {
  if (!schema) return [];

  // If schema has parameters array (like prompts/datasources)
  if (schema.parameters && Array.isArray(schema.parameters)) {
    return schema.parameters;
  }

  // JSON Schema format: { properties: { name: { type, description } }, required: [] }
  if (schema.properties) {
    const required = new Set(schema.required || []);
    return Object.entries(schema.properties).map(([name, prop]: [string, any]) => ({
      name,
      type: prop.type || "string",
      description: prop.description || "",
      required: required.has(name),
      enum: prop.enum,
    }));
  }

  return [];
}

export function AgentDetail({ id, navigate }: AgentDetailProps) {
  const { agent, loading, error, fetch } = useAgentDetail(id);
  const {
    result: execResult,
    loading: executing,
    error: execError,
    execute,
  } = useExecuteAgent();
  const [traces, setTraces] = useState<any[]>([]);
  const [tab, setTab] = useState<"execute" | "sdk">("execute");

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (execResult?.trace_id) {
      request<any>({ type: "getTraces", traceId: execResult.trace_id })
        .then((data) => setTraces(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [execResult]);

  // Extract parameters from current_version.input_schema
  const parameters: Parameter[] = useMemo(() => {
    if (!agent) return [];
    const cv = agent.current_version;
    return parseSchemaProperties(cv?.input_schema);
  }, [agent]);

  const handleExecute = (values: Record<string, unknown>) => {
    execute(id, values);
    setTraces([]);
  };

  if (loading) return <div className="p-4 text-xs text-muted">Loading...</div>;
  if (error) return <div className="p-4 text-xs text-error">Error: {error}</div>;
  if (!agent) return null;

  const cv = agent.current_version;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{agent.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="badge">{agent.type}</span>
            {agent.status && <span className="badge">{agent.status}</span>}
          </div>
        </div>
        <button
          className="btn-secondary text-xs"
          onClick={() =>
            navigate({
              page: "agentVersions",
              agentId: id,
              name: agent.name,
            })
          }
        >
          Versions
        </button>
      </div>

      {/* Agent Info */}
      <div
        className="space-y-2 rounded border p-3 text-xs"
        style={{ borderColor: "var(--border)" }}
      >
        {agent.description && (
          <div>
            <span className="font-medium text-muted">Description: </span>
            <span className="text-fg">{agent.description}</span>
          </div>
        )}
        <div>
          <span className="font-medium text-muted">Type: </span>
          <span className="text-fg">{agent.type}</span>
        </div>
        {cv && (
          <div>
            <span className="font-medium text-muted">Current Version: </span>
            <span className="text-fg">v{cv.version}</span>
            {cv.message && <span className="text-muted"> — {cv.message}</span>}
          </div>
        )}
        {agent.created_at && (
          <div>
            <span className="font-medium text-muted">Created: </span>
            <span className="text-fg">
              {new Date(agent.created_at).toLocaleDateString()}
            </span>
          </div>
        )}
        {parameters.length > 0 && (
          <div>
            <span className="font-medium text-muted">Parameters: </span>
            {parameters.map((p) => (
              <span
                key={p.name}
                className="mr-1 inline-block rounded bg-indigo-800/30 px-1.5 py-0.5 text-[11px] text-indigo-300"
              >
                {p.name}
                {p.required && "*"}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {(["execute", "sdk"] as const).map((t) => (
          <button
            key={t}
            className={`px-3 py-1.5 text-xs capitalize ${
              tab === t ? "border-b-2 font-medium" : "text-muted"
            }`}
            style={tab === t ? { borderColor: "var(--accent)" } : {}}
            onClick={() => setTab(t)}
          >
            {t === "sdk" ? "SDK Examples" : t}
          </button>
        ))}
      </div>

      {/* Execute Tab */}
      {tab === "execute" && (
        <div className="space-y-3">
          <ParameterForm
            parameters={parameters}
            onSubmit={handleExecute}
            loading={executing}
            buttonLabel="Execute"
            error={execError}
          />

          {execResult && (
            <div
              className="space-y-3 rounded border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium">Output</h3>
                {execResult.status && <StatusBadge status={execResult.status} />}
                {execResult.duration_ms && (
                  <span className="text-xs text-muted">
                    {formatDuration(execResult.duration_ms)}
                  </span>
                )}
                {execResult.total_cost != null && (
                  <span className="text-xs text-muted">
                    {formatCost(execResult.total_cost)}
                  </span>
                )}
              </div>
              <JsonViewer data={execResult.output ?? execResult} label="Result" />
              {traces.length > 0 && (
                <div>
                  <h4 className="mb-2 text-xs font-medium text-muted">Trace Tree</h4>
                  <TraceTree traces={traces} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SDK Examples Tab */}
      {tab === "sdk" && (
        <SdkExamples examples={agentExecuteExamples(id, agent.name, "{}")} />
      )}
    </div>
  );
}
