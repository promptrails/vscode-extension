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

> **⚠️ TEMPORARY dependency — must be repinned before release.**
> This branch (`feat/api-v2`) builds against the unreleased `@promptrails/sdk`
> v0.9.0 via a local file link:
> `"@promptrails/sdk": "file:../javascript-sdk"` (the `feat/api-v2` branch of
> the sibling `javascript-sdk` repo). Build the SDK first:
>
> ```bash
> cd ../javascript-sdk && npm ci && npm run build
> cd ../vscode-extension && npm install
> ```
>
> At the coordinated release, **repin this to the published npm version**
> (e.g. `"@promptrails/sdk": "^0.9.0"`) and re-run `npm install`.

## License

MIT
