type Lang = "javascript" | "python" | "go" | "curl";

export function agentExecuteExamples(
  agentId: string,
  agentName: string,
  inputJson: string,
): Record<Lang, string> {
  return {
    javascript: `import { PromptRails } from "@promptrails/sdk";

const client = new PromptRails({ apiKey: "YOUR_API_KEY" });

const result = await client.agents.execute("${agentId}", {
  input: ${inputJson},
});

console.log(result);`,

    python: `from promptrails import PromptRails

client = PromptRails(api_key="YOUR_API_KEY")

result = client.agents.execute(
    "${agentId}",
    input=${inputJson.replace(/"/g, "'").replace(/: /g, ": ")},
)

print(result)`,

    go: `package main

import "github.com/promptrails/promptrails-go"

func main() {
    client := promptrails.New("YOUR_API_KEY")

    result, err := client.Agents.Execute("${agentId}", promptrails.ExecuteAgentRequest{
        Input: map[string]interface{}{},
    })
}`,

    curl: `curl -X POST https://api.promptrails.ai/api/v1/agents/${agentId}/execute \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"input": ${inputJson}}'`,
  };
}

export function promptPreviewExamples(promptId: string): Record<Lang, string> {
  return {
    javascript: `import { PromptRails } from "@promptrails/sdk";

const client = new PromptRails({ apiKey: "YOUR_API_KEY" });

// Prompt versions are content-only in API v2 — render the template with inputs.
const result = await client.prompts.preview("${promptId}", {
  input: { name: "World" },
});

console.log(result);`,

    python: `from promptrails import PromptRails

client = PromptRails(api_key="YOUR_API_KEY")

result = client.prompts.preview(
    "${promptId}",
    input={"name": "World"},
)

print(result)`,

    go: `package main

import "github.com/promptrails/promptrails-go"

func main() {
    client := promptrails.New("YOUR_API_KEY")

    result, err := client.Prompts.Preview("${promptId}", map[string]interface{}{
        "input": map[string]interface{}{"name": "World"},
    })
}`,

    curl: `curl -X POST https://api.promptrails.ai/api/v1/prompts/${promptId}/preview \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"input": {"name": "World"}}'`,
  };
}

export function dataSourceQueryExamples(dsId: string): Record<Lang, string> {
  return {
    javascript: `import { PromptRails } from "@promptrails/sdk";

const client = new PromptRails({ apiKey: "YOUR_API_KEY" });

const result = await client.dataSources.query("${dsId}", {
  query: "your query here",
});

console.log(result);`,

    python: `from promptrails import PromptRails

client = PromptRails(api_key="YOUR_API_KEY")

result = client.data_sources.query(
    "${dsId}",
    parameters={'query': 'your query here'},
)

print(result)`,

    go: `package main

import "github.com/promptrails/promptrails-go"

func main() {
    client := promptrails.New("YOUR_API_KEY")

    result, err := client.DataSources.Query("${dsId}", map[string]interface{}{
        "query": "your query here",
    })
}`,

    curl: `curl -X POST https://api.promptrails.ai/api/v1/data-sources/${dsId}/query \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"query": "your query here"}'`,
  };
}
