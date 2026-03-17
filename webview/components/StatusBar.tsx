interface StatusBarProps {
  connected: boolean;
  apiUrl: string;
}

export function StatusBar({ connected, apiUrl }: StatusBarProps) {
  return (
    <div className="flex items-center gap-2 border-t border-vscode px-3 py-1 text-xs text-muted">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          connected ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span>
        {connected ? "Connected" : "Not connected"}
        {apiUrl && ` — ${apiUrl}`}
      </span>
    </div>
  );
}
