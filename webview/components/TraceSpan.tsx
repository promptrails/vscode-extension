import { useState } from "react";
import { cn, formatCost, formatDuration, formatTokens } from "../lib/utils";

interface TraceSpanProps {
  trace: {
    name: string;
    kind: string;
    status: string;
    duration_ms?: number;
    cost?: number;
    total_tokens?: number;
    prompt_tokens?: number;
    completion_tokens?: number;
    error_message: string;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
  };
  depth: number;
  hasChildren: boolean;
  expanded: boolean;
  onToggle: () => void;
}

const kindColors: Record<string, string> = {
  llm: "bg-purple-800/40 text-purple-300",
  prompt: "bg-purple-800/40 text-purple-300",
  tool: "bg-blue-800/40 text-blue-300",
  workflow: "bg-cyan-800/40 text-cyan-300",
  agent: "bg-indigo-800/40 text-indigo-300",
  retrieval: "bg-teal-800/40 text-teal-300",
};

export function TraceSpan({
  trace,
  depth,
  hasChildren,
  expanded,
  onToggle,
}: TraceSpanProps) {
  const [showDetail, setShowDetail] = useState(false);
  const kindClass = kindColors[trace.kind] || "bg-gray-800/40 text-gray-300";

  return (
    <div>
      <button
        onClick={hasChildren ? onToggle : () => setShowDetail(!showDetail)}
        className="hover:bg-input flex w-full items-center gap-2 px-3 py-1.5 text-left"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {hasChildren ? (
          <span className="w-3 shrink-0 text-[10px] text-muted">
            {expanded ? "▾" : "▸"}
          </span>
        ) : (
          <span className="w-3" />
        )}

        <span className="min-w-0 flex-1 truncate text-sm">{trace.name}</span>

        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
            kindClass,
          )}
        >
          {trace.kind}
        </span>

        <span className="shrink-0 text-xs text-muted">
          {formatDuration(trace.duration_ms)}
        </span>

        {trace.cost ? (
          <span className="shrink-0 text-xs text-muted">{formatCost(trace.cost)}</span>
        ) : null}

        {trace.total_tokens ? (
          <span className="shrink-0 text-xs text-muted">
            {formatTokens(trace.total_tokens)}t
          </span>
        ) : null}

        {trace.error_message && (
          <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
        )}
      </button>

      {showDetail && (
        <div
          className="bg-input border-t px-4 py-3"
          style={{
            marginLeft: `${depth * 20 + 12}px`,
            borderColor: "var(--border)",
          }}
        >
          {trace.error_message && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-medium text-error">Error</p>
              <pre className="overflow-x-auto rounded bg-red-900/20 p-2 text-xs text-red-300">
                {trace.error_message}
              </pre>
            </div>
          )}
          {trace.input && Object.keys(trace.input).length > 0 && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-medium text-muted">Input</p>
              <pre className="bg-vscode max-h-40 overflow-auto rounded p-2 text-xs">
                {JSON.stringify(trace.input, null, 2)}
              </pre>
            </div>
          )}
          {trace.output && Object.keys(trace.output).length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted">Output</p>
              <pre className="bg-vscode max-h-40 overflow-auto rounded p-2 text-xs">
                {JSON.stringify(trace.output, null, 2)}
              </pre>
            </div>
          )}
          {trace.prompt_tokens != null && (
            <div className="mt-2 flex gap-4 text-xs text-muted">
              <span>Prompt: {formatTokens(trace.prompt_tokens)}</span>
              <span>Completion: {formatTokens(trace.completion_tokens)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
