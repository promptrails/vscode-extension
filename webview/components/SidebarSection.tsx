import { useState } from "react";

interface SidebarSectionProps {
  title: string;
  count: number;
  children: React.ReactNode;
}

export function SidebarSection({ title, count, children }: SidebarSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        className="hover:bg-input flex w-full items-center gap-1 px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-muted"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-[10px]">{expanded ? "▾" : "▸"}</span>
        <span className="flex-1">{title}</span>
        {count > 0 && <span className="badge">{count}</span>}
      </button>
      {expanded && <div>{children}</div>}
    </div>
  );
}
