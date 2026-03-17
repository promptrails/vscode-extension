import { useEffect, useMemo } from "react";
import { usePromptDetail, useRunPrompt } from "../hooks/usePrompts";
import { ParameterForm } from "../components/ParameterForm";
import type { Parameter } from "../components/ParameterForm";
import { JsonViewer } from "../components/JsonViewer";
import { SdkExamples } from "../components/SdkExamples";
import { promptRunExamples } from "../lib/sdk-examples";
import { useState } from "react";
import type { View } from "../App";

interface PromptDetailProps {
  id: string;
  navigate: (view: View) => void;
}

export function PromptDetail({ id, navigate }: PromptDetailProps) {
  const { prompt, loading, error, fetch } = usePromptDetail(id);
  const { result: runResult, loading: running, error: runError, run } = useRunPrompt();
  const [tab, setTab] = useState<"run" | "sdk">("run");

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Extract parameters from current_version.input_schema.parameters
  const parameters: Parameter[] = useMemo(() => {
    if (!prompt) return [];
    const cv = prompt.current_version;
    const schema = cv?.input_schema;
    if (schema?.parameters && Array.isArray(schema.parameters)) {
      return schema.parameters;
    }
    return [];
  }, [prompt]);

  const handleRun = (values: Record<string, unknown>) => {
    const cv = prompt?.current_version;
    const modelId = cv?.llm_model_id || prompt?.llm_model_id || prompt?.model || "";
    run(id, ".", modelId, values);
  };

  if (loading) return <div className="p-4 text-xs text-muted">Loading...</div>;
  if (error) return <div className="p-4 text-xs text-error">Error: {error}</div>;
  if (!prompt) return null;

  const cv = prompt.current_version;
  const modelName = cv?.llm_model_id || prompt.llm_model_id || prompt.model || "";
  const systemPrompt = cv?.system_prompt || "";
  const userPrompt = cv?.user_prompt || "";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{prompt.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            {modelName && <span className="badge">{modelName}</span>}
            {cv?.temperature != null && <span>temp: {cv.temperature}</span>}
            {cv?.max_tokens != null && <span>max: {cv.max_tokens}</span>}
            {prompt.status && <span className="badge">{prompt.status}</span>}
          </div>
        </div>
        <button
          className="btn-secondary text-xs"
          onClick={() =>
            navigate({
              page: "promptVersions",
              promptId: id,
              name: prompt.name,
            })
          }
        >
          Versions
        </button>
      </div>

      {/* Prompt Info */}
      <div
        className="space-y-2 rounded border p-3 text-xs"
        style={{ borderColor: "var(--border)" }}
      >
        {prompt.description && (
          <div>
            <span className="font-medium text-muted">Description: </span>
            <span className="text-fg">{prompt.description}</span>
          </div>
        )}
        {modelName && (
          <div>
            <span className="font-medium text-muted">Model: </span>
            <span className="text-fg">{modelName}</span>
            {cv?.llm_model?.name && (
              <span className="text-muted"> ({cv.llm_model.name})</span>
            )}
          </div>
        )}
        {cv?.temperature != null && (
          <div>
            <span className="font-medium text-muted">Temperature: </span>
            <span className="text-fg">{cv.temperature}</span>
          </div>
        )}
        {cv?.max_tokens != null && (
          <div>
            <span className="font-medium text-muted">Max Tokens: </span>
            <span className="text-fg">{cv.max_tokens}</span>
          </div>
        )}
        {cv && (
          <div>
            <span className="font-medium text-muted">Current Version: </span>
            <span className="text-fg">v{cv.version}</span>
            {cv.message && <span className="text-muted"> — {cv.message}</span>}
          </div>
        )}
        {prompt.created_at && (
          <div>
            <span className="font-medium text-muted">Created: </span>
            <span className="text-fg">
              {new Date(prompt.created_at).toLocaleDateString()}
            </span>
          </div>
        )}
        {systemPrompt && (
          <div>
            <span className="font-medium text-muted">System Prompt</span>
            <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-input p-2 text-xs">
              {systemPrompt}
            </pre>
          </div>
        )}
        {userPrompt && (
          <div>
            <span className="font-medium text-muted">User Prompt</span>
            <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-input p-2 text-xs">
              {userPrompt}
            </pre>
          </div>
        )}
        {parameters.length > 0 && (
          <div>
            <span className="font-medium text-muted">Parameters: </span>
            {parameters.map((p) => (
              <span
                key={p.name}
                className="mr-1 inline-block rounded bg-purple-800/30 px-1.5 py-0.5 text-[11px] text-purple-300"
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
        {(["run", "sdk"] as const).map((t) => (
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

      {/* Run Tab */}
      {tab === "run" && (
        <div className="space-y-3">
          <ParameterForm
            parameters={parameters}
            onSubmit={handleRun}
            loading={running}
            buttonLabel="Run"
            error={runError}
          />
          {runResult && (
            <div
              className="space-y-2 rounded border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="font-medium text-fg">Output</span>
                {runResult.duration_ms && <span>{runResult.duration_ms}ms</span>}
                {runResult.cost != null && <span>${runResult.cost.toFixed(4)}</span>}
                {runResult.model && <span>{runResult.model}</span>}
              </div>
              {runResult.content ? (
                <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded bg-input p-3 text-xs">
                  {runResult.content}
                </pre>
              ) : (
                <JsonViewer data={runResult} label="Result" />
              )}
            </div>
          )}
        </div>
      )}

      {/* SDK Examples Tab */}
      {tab === "sdk" && <SdkExamples examples={promptRunExamples(id, prompt.name)} />}
    </div>
  );
}
