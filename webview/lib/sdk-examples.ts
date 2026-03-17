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

export function promptRunExamples(
  promptId: string,
  _promptName: string,
): Record<Lang, string> {
  return {
    javascript: `import { PromptRails } from "@promptrails/sdk";

const client = new PromptRails({ apiKey: "YOUR_API_KEY" });

const result = await client.prompts.runPrompt("${promptId}", {
  user_prompt: "Hello, how are you?",
  llm_model_id: "MODEL_ID",
});

console.log(result);`,

    python: `from promptrails import PromptRails

client = PromptRails(api_key="YOUR_API_KEY")

result = client.prompts.run(
    "${promptId}",
    user_prompt="Hello, how are you?",
    llm_model_id="MODEL_ID",
)

print(result)`,

    go: `package main

import "github.com/promptrails/promptrails-go"

func main() {
    client := promptrails.New("YOUR_API_KEY")

    result, err := client.Prompts.Run("${promptId}", promptrails.RunPromptRequest{
        UserPrompt: "Hello, how are you?",
        LLMModelID: "MODEL_ID",
    })
}`,

    curl: `curl -X POST https://api.promptrails.ai/api/v1/prompts/${promptId}/run \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -d '{"user_prompt": "Hello, how are you?", "llm_model_id": "MODEL_ID"}'`,
  };
}

export function dataSourceQueryExamples(
  dsId: string,
  _dsName: string,
): Record<Lang, string> {
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
