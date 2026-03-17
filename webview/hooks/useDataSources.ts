import { useState, useCallback } from "react";
import { request } from "../vscode";

export function useDataSourceDetail(id: string) {
  const [dataSource, setDataSource] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<any>({ type: "getDataSource", id });
      setDataSource(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { dataSource, loading, error, fetch };
}

export function useQueryDataSource() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useCallback(async (id: string, parameters: object) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await request<any>({
        type: "queryDataSource",
        id,
        parameters,
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, query };
}

export function useDataSourceVersions(dataSourceId: string) {
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await request<any>({
        type: "getDataSourceVersions",
        dataSourceId,
      });
      setVersions(Array.isArray(data) ? data : data?.data || data?.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dataSourceId]);

  const promote = useCallback(
    async (versionId: string) => {
      try {
        await request({
          type: "promoteDataSourceVersion",
          dataSourceId,
          versionId,
        });
        await fetch();
      } catch (err: any) {
        setError(err.message);
      }
    },
    [dataSourceId, fetch],
  );

  return { versions, loading, error, fetch, promote };
}
