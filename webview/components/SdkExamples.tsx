import { useState } from "react";
import { CodeBlock } from "./CodeBlock";

type Lang = "javascript" | "python" | "go" | "curl";

interface SdkExamplesProps {
  examples: Record<Lang, string>;
}

const TABS: { key: Lang; label: string }[] = [
  { key: "javascript", label: "JavaScript" },
  { key: "python", label: "Python" },
  { key: "go", label: "Go" },
  { key: "curl", label: "cURL" },
];

export function SdkExamples({ examples }: SdkExamplesProps) {
  const [lang, setLang] = useState<Lang>("javascript");

  return (
    <div>
      <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`px-3 py-1 text-[11px] ${
              lang === t.key ? "border-b-2 font-medium" : "text-muted"
            }`}
            style={lang === t.key ? { borderColor: "var(--accent)" } : {}}
            onClick={() => setLang(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-2">
        <CodeBlock code={examples[lang]} language={lang} />
      </div>
    </div>
  );
}
