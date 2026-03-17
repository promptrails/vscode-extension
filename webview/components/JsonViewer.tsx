import { useState } from "react";
import { highlightJson } from "../lib/syntax";

interface JsonViewerProps {
  data: unknown;
  label?: string;
}

export function JsonViewer({ data, label }: JsonViewerProps) {
  const [expanded, setExpanded] = useState(true);
  const formatted = JSON.stringify(data, null, 2);

  return (
    <div>
      {label && (
        <button
          className="mb-1 text-xs font-medium text-muted"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "\u25BE" : "\u25B8"} {label}
        </button>
      )}
      {expanded && (
        <pre
          className="bg-input max-h-80 overflow-auto rounded p-2 text-xs"
          dangerouslySetInnerHTML={{ __html: highlightJson(formatted) }}
        />
      )}
    </div>
  );
}
