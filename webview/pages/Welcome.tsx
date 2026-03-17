export function Welcome() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Welcome to PromptRails</h2>
        <p className="max-w-sm text-sm text-muted">
          Select an agent, prompt, or data source from the sidebar to get started. You can
          execute agents, run prompts, query data sources, and manage versions.
        </p>
        <div className="flex justify-center gap-6 pt-2 text-xs text-muted">
          <div className="space-y-1">
            <div className="text-fg font-medium">Agents</div>
            <div>Execute & trace</div>
          </div>
          <div className="space-y-1">
            <div className="text-fg font-medium">Prompts</div>
            <div>Run & preview</div>
          </div>
          <div className="space-y-1">
            <div className="text-fg font-medium">Data Sources</div>
            <div>Query & explore</div>
          </div>
        </div>
      </div>
    </div>
  );
}
