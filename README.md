# PromptRails for VS Code

Run agents, test prompts, query data sources, and manage versions — all from VS Code.

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=promptrails.promptrails) or search for **PromptRails** in the VS Code Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`).

## Features

- **Agents** — Execute `agent` and `workflow` agents with JSON input, stream the live event feed, cancel in-flight runs, and view execution/trace trees
- **Prompts** — Inspect content-only prompts and render template previews with inputs
- **Data Sources** — Query data sources and test connections
- **Versions** — View version history (model/tools live on the agent version in API v2) and promote versions
- **Secure** — API keys stored in VS Code's SecretStorage

This extension targets the PromptRails **API v2** (two agent kinds — `agent` and `workflow` — execution trees, and human-in-the-loop approvals).

## Getting Started

1. Install the extension
2. Open the PromptRails panel from the Activity Bar
3. Set your API key in Settings
4. Start working with your resources

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `promptrails.apiUrl` | `https://api.promptrails.ai` | API base URL |

## Commands

- `PromptRails: Open Dashboard` — Open the main panel
- `PromptRails: Set API Key` — Set your API key
- `PromptRails: Clear API Key` — Remove stored API key

## Development

```bash
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
```

> **⚠️ API v2 against an unpublished SDK — the lockfile is intentionally stale.**
> This branch (`feat/api-v2`) targets `@promptrails/sdk` **v0.9.0**, which is
> not on npm yet. `package.json` already declares the normal published spec
> (`"@promptrails/sdk": "^0.9.0"`) — **no machine-specific `file:` path is
> committed.** Because 0.9.0 is unpublished, the committed `package-lock.json`
> is deliberately left referencing the previous published version; it will be
> reconciled automatically by `npm install` once 0.9.0 ships to npm.
>
> For local development against the sibling `javascript-sdk` repo (its
> `feat/api-v2` branch), build the SDK and link it (the link is **not**
> committed and does not touch `package.json`/`package-lock.json`):
>
> ```bash
> cd ../javascript-sdk && npm ci && npm run build
> cd ../vscode-extension && npm link ../javascript-sdk
> ```
>
> At the coordinated release, once `@promptrails/sdk` v0.9.0 is published,
> run `npm install` to regenerate the lockfile against the registry.

## License

MIT
