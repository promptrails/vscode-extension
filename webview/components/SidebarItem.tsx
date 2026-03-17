interface SidebarItemProps {
  label: string;
  badge?: string;
  active: boolean;
  onClick: () => void;
}

export function SidebarItem({ label, badge, active, onClick }: SidebarItemProps) {
  return (
    <button
      className={`flex w-full items-center gap-2 px-4 py-1 text-left text-sm ${
        active ? "bg-input text-fg" : "text-muted hover:bg-input hover:text-fg"
      }`}
      onClick={onClick}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {badge && (
        <span className="shrink-0 rounded px-1 text-[10px] opacity-60">{badge}</span>
      )}
    </button>
  );
}
