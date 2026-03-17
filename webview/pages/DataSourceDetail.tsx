import { useEffect, useState, useMemo } from "react";
import { useDataSourceDetail, useQueryDataSource } from "../hooks/useDataSources";
import { ParameterForm } from "../components/ParameterForm";
import type { Parameter } from "../components/ParameterForm";
import { JsonViewer } from "../components/JsonViewer";
import { ResultTable } from "../components/ResultTable";
import { SdkExamples } from "../components/SdkExamples";
import { dataSourceQueryExamples } from "../lib/sdk-examples";
import type { View } from "../App";

interface DataSourceDetailProps {
  id: string;
  navigate: (view: View) => void;
}

export function DataSourceDetail({ id, navigate }: DataSourceDetailProps) {
  const { dataSource, loading, error, fetch } = useDataSourceDetail(id);
  const {
    result: queryResult,
    loading: querying,
    error: queryError,
    query,
  } = useQueryDataSource();
  const [tab, setTab] = useState<"query" | "sdk">("query");

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Extract parameters from current_version.parameters
  const parameters: Parameter[] = useMemo(() => {
    if (!dataSource) return [];
    const cv = dataSource.current_version;
    if (cv?.parameters && Array.isArray(cv.parameters)) {
      return cv.parameters;
    }
    return [];
  }, [dataSource]);

  const handleQuery = (values: Record<string, unknown>) => {
    query(id, values);
  };

  if (loading) return <div className="p-4 text-xs text-muted">Loading...</div>;
  if (error) return <div className="p-4 text-xs text-error">Error: {error}</div>;
  if (!dataSource) return null;

  const cv = dataSource.current_version;

  // Detect { columns, rows } format from backend
  const hasRowsFormat =
    queryResult &&
    queryResult.rows &&
    Array.isArray(queryResult.rows) &&
    queryResult.columns &&
    Array.isArray(queryResult.columns);

  const isPlainArrayTable =
    !hasRowsFormat &&
    queryResult &&
    Array.isArray(queryResult) &&
    queryResult.length > 0 &&
    typeof queryResult[0] === "object";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{dataSource.name}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="badge">{dataSource.type}</span>
            {dataSource.status && <span className="badge">{dataSource.status}</span>}
          </div>
        </div>
        <button
          className="btn-secondary text-xs"
          onClick={() =>
            navigate({
              page: "dataSourceVersions",
              dataSourceId: id,
              name: dataSource.name,
            })
          }
        >
          Versions
        </button>
      </div>

      {/* DataSource Info */}
      <div
        className="space-y-2 rounded border p-3 text-xs"
        style={{ borderColor: "var(--border)" }}
      >
        {dataSource.description && (
          <div>
            <span className="font-medium text-muted">Description: </span>
            <span className="text-fg">{dataSource.description}</span>
          </div>
        )}
        <div>
          <span className="font-medium text-muted">Type: </span>
          <span className="text-fg">{dataSource.type}</span>
        </div>
        {cv && (
          <>
            <div>
              <span className="font-medium text-muted">Current Version: </span>
              <span className="text-fg">v{cv.version}</span>
              {cv.message && <span className="text-muted"> — {cv.message}</span>}
            </div>
            {cv.output_format && (
              <div>
                <span className="font-medium text-muted">Output Format: </span>
                <span className="text-fg">{cv.output_format}</span>
              </div>
            )}
            {cv.cache_timeout != null && (
              <div>
                <span className="font-medium text-muted">Cache TTL: </span>
                <span className="text-fg">{cv.cache_timeout}s</span>
              </div>
            )}
            {cv.query_template && (
              <div>
                <span className="font-medium text-muted">Query Template</span>
                <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-input p-2 text-xs">
                  {cv.query_template}
                </pre>
              </div>
            )}
          </>
        )}
        {dataSource.created_at && (
          <div>
            <span className="font-medium text-muted">Created: </span>
            <span className="text-fg">
              {new Date(dataSource.created_at).toLocaleDateString()}
            </span>
          </div>
        )}
        {parameters.length > 0 && (
          <div>
            <span className="font-medium text-muted">Parameters: </span>
            {parameters.map((p) => (
              <span
                key={p.name}
                className="mr-1 inline-block rounded bg-teal-800/30 px-1.5 py-0.5 text-[11px] text-teal-300"
              >
                {p.name}
                {p.required && "*"}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
        {(["query", "sdk"] as const).map((t) => (
          <button
            key={t}
            className={`px-3 py-1.5 text-xs capitalize ${
              tab === t ? "border-b-2 font-medium" : "text-muted"
            }`}
            style={tab === t ? { borderColor: "var(--accent)" } : {}}
            onClick={() => setTab(t)}
          >
            {t === "sdk" ? "SDK Examples" : t}
          </button>
        ))}
      </div>

      {/* Query Tab */}
      {tab === "query" && (
        <div className="space-y-3">
          <ParameterForm
            parameters={parameters}
            onSubmit={handleQuery}
            loading={querying}
            buttonLabel="Query"
            error={queryError}
          />

          {queryResult && (
            <div
              className="space-y-2 rounded border p-3"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-medium">Results</h3>
                {(hasRowsFormat ? (queryResult.row_count ?? queryResult.count) : null) !=
                  null && (
                  <span className="text-xs text-muted">
                    {queryResult.row_count ?? queryResult.count} rows
                  </span>
                )}
                {queryResult.execution_time_ms && (
                  <span className="text-xs text-muted">
                    {queryResult.execution_time_ms}ms
                  </span>
                )}
              </div>
              {hasRowsFormat ? (
                <ResultTable data={queryResult.rows} columns={queryResult.columns} />
              ) : isPlainArrayTable ? (
                <ResultTable data={queryResult} />
              ) : (
                <JsonViewer data={queryResult} />
              )}
            </div>
          )}
        </div>
      )}

      {/* SDK Examples Tab */}
      {tab === "sdk" && <SdkExamples examples={dataSourceQueryExamples(id)} />}
    </div>
  );
}
