import { useEffect, useMemo, useState } from "react";
import type { View } from "../App";
import { JsonViewer } from "../components/JsonViewer";
import type { Parameter } from "../components/ParameterForm";
import { ParameterForm } from "../components/ParameterForm";
import { SdkExamples } from "../components/SdkExamples";
import { usePreviewPrompt, usePromptDetail } from "../hooks/usePrompts";
import { promptPreviewExamples } from "../lib/sdk-examples";

interface PromptDetailProps {
  id: string;
  navigate: (view: View) => void;
}

export function PromptDetail({ id, navigate }: PromptDetailProps) {
  const { prompt, loading, error, fetch } = usePromptDetail(id);
  const {
    result: previewResult,
    loading: previewing,
    error: previewError,
    preview,
  } = usePreviewPrompt();
  const [tab, setTab] = useState<"preview" | "sdk">("preview");

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

  // In API v2 a prompt version is content-only — model, sampling and tools
  // live on the agent version. Rendering the template (preview) is the only
  // standalone prompt action.
  const handlePreview = (values: Record<string, unknown>) => {
    preview(id, values);
  };

  if (loading) return <div className="p-4 text-xs text-muted">Loading...</div>;
  if (error) return <div className="p-4 text-xs text-error">Error: {error}</div>;
  if (!prompt) return null;

  const cv = prompt.current_version;
  const systemPrompt = cv?.system_prompt || "";
  const userPrompt = cv?.user_prompt || "";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{prompt.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            {cv?.version && <span className="badge">v{cv.version}</span>}
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
        {(["preview", "sdk"] as const).map((t) => (
          <button
            key={t}
            className={`px-3 py-1.5 text-xs capitalize ${
              tab === t ? "border-b-2 font-medium" : "text-muted"
            }`}
            style={tab === t ? { borderColor: "var(--accent)" } : {}}
            onClick={() => setTab(t)}
          >
            {t === "sdk" ? "SDK Examples" : "Preview"}
          </button>
        ))}
      </div>

      {/* Preview Tab — renders the template with the given inputs */}
      {tab === "preview" && (
        <div className="space-y-3">
          <ParameterForm
            parameters={parameters}
            onSubmit={handlePreview}
            loading={previewing}
            buttonLabel="Render Preview"
            error={previewError}
          />
          {previewResult && (
            <div
              className="space-y-2 rounded border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="text-xs font-medium text-fg">Rendered Template</div>
              <JsonViewer data={previewResult} label="Preview" />
            </div>
          )}
        </div>
      )}

      {/* SDK Examples Tab */}
      {tab === "sdk" && <SdkExamples examples={promptPreviewExamples(id)} />}
    </div>
  );
}
