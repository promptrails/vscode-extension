# Changelog

## 0.3.0

- Migrate to PromptRails **API v2** via `@promptrails/sdk` v0.9.0.
- Agent types are now only `agent` and `workflow` (`simple`/`chain`/`multi_agent`/`composite` removed).
- Executions are trees with human-in-the-loop: new statuses `waiting_approval`, `cancel_requested`, `cancelled`; added a **Cancel Execution** action (`executions.cancel`).
- Prompt versions are content-only — the prompt "Run" tab is replaced by a template **Preview** (`prompts.preview`); model/sampling/tools now live on the agent version.
- Version view reads model/tools from the agent version's `model_config`/`tools` fields instead of `config`.
- Trace span kinds updated (`workflow`/`prompt` replace `chain`).
- Removed features backed by deleted SDK resources (prompt run, costs, scores, media, templates, dashboard, sessions).
- **Temporary:** `@promptrails/sdk` is pinned to the local sibling via `file:../javascript-sdk` until v0.9.0 is published on npm — must be repinned to the published version at release (see README).

## 0.2.1

- Update `@promptrails/sdk` to 0.5.0 (langrails v0.7 model capabilities, run feature toggles, cache token usage)

## 0.1.0

- Initial release
- Agent execution with JSON input and trace tree visualization
- Prompt run and template preview
- Data source query and connection testing
- Version management with promote functionality
- Secure API key storage via VS Code SecretStorage
