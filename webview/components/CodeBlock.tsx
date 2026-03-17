import { useState } from "react";
import { highlightCode } from "../lib/syntax";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between rounded-t bg-input px-3 py-1">
        <span className="text-[10px] uppercase text-muted">{language}</span>
        <button className="text-[11px] text-muted hover:text-fg" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        className="overflow-auto rounded-b bg-vscode p-3 text-xs"
        dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
      />
    </div>
  );
}
