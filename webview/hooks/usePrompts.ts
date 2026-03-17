import { useState, useCallback } from "react";
import { request } from "../vscode";

export function usePromptDetail(id: string) {
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<any>({ type: "getPrompt", id });
      setPrompt(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { prompt, loading, error, fetch };
}

export function useRunPrompt() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (
      promptId: string,
      userPrompt: string,
      llmModelId?: string,
      input?: Record<string, unknown>,
    ) => {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const data = await request<any>({
          type: "runPrompt",
          promptId,
          userPrompt,
          llmModelId,
          input,
        });
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { result, loading, error, run };
}

export function usePreviewPrompt() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useCallback(async (promptId: string, input: object) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await request<any>({
        type: "previewPrompt",
        promptId,
        input,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, preview };
}

export function usePromptVersions(promptId: string) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<any>({
        type: "getPromptVersions",
        promptId,
      });
      setVersions(Array.isArray(data) ? data : data?.data || data?.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [promptId]);

  const promote = useCallback(
    async (versionId: string) => {
      try {
        await request({ type: "promotePromptVersion", promptId, versionId });
        await fetch();
      } catch (err: any) {
        setError(err.message);
      }
    },
    [promptId, fetch],
  );

  return { versions, loading, error, fetch, promote };
}
