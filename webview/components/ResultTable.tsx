interface ResultTableProps {
  data: Record<string, unknown>[];
  columns?: string[];
}

export function ResultTable({ data, columns: columnsProp }: ResultTableProps) {
  if (data.length === 0) {
    return <p className="py-4 text-center text-xs text-muted">No results</p>;
  }

  const columns = columnsProp || Object.keys(data[0]);

  return (
    <div
      className="overflow-auto rounded border"
      style={{ borderColor: "var(--border)" }}
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-input">
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 text-left font-semibold text-muted"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-input/50"
              style={{
                borderTop: i > 0 ? "1px solid var(--border)" : "none",
              }}
            >
              {columns.map((col) => (
                <td key={col} className="px-3 py-1.5 whitespace-nowrap">
                  {typeof row[col] === "object"
                    ? JSON.stringify(row[col])
                    : String(row[col] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
