import { useState, useCallback, useEffect } from "react";
import type { StreamEvent } from "@promptrails/sdk";
import { request, onMessage } from "../vscode";

export function useAgentDetail(id: string) {
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<any>({ type: "getAgent", id });
      setAgent(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { agent, loading, error, fetch };
}

export function useExecuteAgent() {
  const [result, setResult] = useState<any>(null);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Appends stream frames pushed by the extension host while the
  // execution is in flight. The effect is stable for the lifetime of
  // the hook — the listener filters on message shape.
  useEffect(() => {
    return onMessage((msg: any) => {
      if (msg?.type === "executionStarted") {
        setExecutionId(msg.executionId);
      } else if (msg?.type === "executionEvent" && msg.event) {
        setEvents((prev) => [...prev, msg.event as StreamEvent]);
      }
    });
  }, []);

  const execute = useCallback(async (agentId: string, input: object) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setEvents([]);
    setExecutionId(null);
    try {
      const data = await request<any>({ type: "executeAgent", agentId, input });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, events, executionId, loading, error, execute };
}

export function useAgentVersions(agentId: string) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<any>({ type: "getAgentVersions", agentId });
      setVersions(Array.isArray(data) ? data : data?.data || data?.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  const promote = useCallback(
    async (versionId: string) => {
      try {
        await request({ type: "promoteAgentVersion", agentId, versionId });
        await fetch();
      } catch (err: any) {
        setError(err.message);
      }
    },
    [agentId, fetch],
  );

  return { versions, loading, error, fetch, promote };
}
