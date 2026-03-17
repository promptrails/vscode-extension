# PromptRails for VS Code

Run agents, test prompts, query data sources, and manage versions — all from VS Code.

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=promptrails.promptrails) or search for **PromptRails** in the VS Code Extensions panel (`Ctrl+Shift+X` / `Cmd+Shift+X`).

## Features

- **Agents** — Execute agents with JSON input, view output and trace trees
- **Prompts** — Run prompts and preview rendered templates
- **Data Sources** — Query data sources and test connections
- **Versions** — View version history and promote versions
- **Secure** — API keys stored in VS Code's SecretStorage

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

## License

MIT
