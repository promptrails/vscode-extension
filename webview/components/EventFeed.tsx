import type { StreamEvent } from "@promptrails/sdk";

interface EventFeedProps {
  events: StreamEvent[];
  streaming: boolean;
  executionId?: string | null;
}

/** Renders the live SSE event feed for an in-flight or finished run. */
export function EventFeed({ events, streaming, executionId }: EventFeedProps) {
  if (events.length === 0 && !streaming) return null;

  return (
    <div
      className="space-y-1 rounded border p-3 font-mono text-[11px]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between pb-1 font-sans text-xs text-muted">
        <span>{streaming ? "Streaming…" : "Execution log"}</span>
        {executionId && (
          <span className="truncate text-[10px]" title={executionId}>
            {executionId.slice(0, 12)}…
          </span>
        )}
      </div>
      {events.map((event, i) => (
        <EventRow key={i} event={event} />
      ))}
    </div>
  );
}

function EventRow({ event }: { event: StreamEvent }) {
  switch (event.type) {
    case "execution":
      return <div className="text-muted">▸ execution {event.executionId}</div>;
    case "thinking":
      return (
        <div className="text-amber-400">
          <span className="text-muted">[thinking]</span> {event.content}
        </div>
      );
    case "tool_start":
      return (
        <div className="text-cyan-400">
          <span className="text-muted">[tool]</span> → {event.name}
        </div>
      );
    case "tool_end":
      return (
        <div className="text-cyan-300">
          <span className="text-muted">[tool]</span> ✓ {event.name}
          {event.summary ? ` — ${event.summary}` : ""}
        </div>
      );
    case "content":
      return <div className="whitespace-pre-wrap text-fg">{event.content}</div>;
    case "done": {
      const total = event.tokenUsage?.total_tokens;
      return (
        <div className="text-emerald-400">
          ✓ done
          {total != null ? ` — ${total} tokens` : ""}
        </div>
      );
    }
    case "error":
      return <div className="text-error">✗ {event.message}</div>;
  }
}
