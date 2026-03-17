import { useState } from "react";

export interface Parameter {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  enum?: string[];
}

interface ParameterFormProps {
  parameters: Parameter[];
  onSubmit: (values: Record<string, unknown>) => void;
  loading: boolean;
  buttonLabel?: string;
  error?: string | null;
}

function coerceValue(value: string, type: string): unknown {
  if (value === "") return undefined;
  switch (type) {
    case "integer":
      return parseInt(value, 10);
    case "number":
      return parseFloat(value);
    case "boolean":
      return value === "true";
    case "array":
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
}

export function ParameterForm({
  parameters,
  onSubmit,
  loading,
  buttonLabel = "Run",
  error,
}: ParameterFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const result: Record<string, unknown> = {};
    for (const p of parameters) {
      const raw = values[p.name] || "";
      const coerced = coerceValue(raw, p.type);
      if (coerced !== undefined) {
        result[p.name] = coerced;
      }
    }
    onSubmit(result);
  };

  const requiredFilled = parameters
    .filter((p) => p.required)
    .every((p) => (values[p.name] || "").trim() !== "");

  return (
    <div className="space-y-3">
      {parameters.length === 0 ? (
        <p className="text-xs text-muted">No parameters required.</p>
      ) : (
        parameters.map((p) => (
          <div key={p.name}>
            <label className="mb-0.5 flex items-center gap-1 text-xs font-medium">
              {p.name}
              {p.required && <span className="text-error">*</span>}
              <span className="font-normal text-muted">({p.type})</span>
            </label>
            {p.description && (
              <p className="mb-1 text-[11px] text-muted">{p.description}</p>
            )}
            {p.enum && p.enum.length > 0 ? (
              <select
                className="input-field"
                value={values[p.name] || ""}
                onChange={(e) => handleChange(p.name, e.target.value)}
              >
                <option value="">Select...</option>
                {p.enum.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : p.type === "boolean" ? (
              <select
                className="input-field"
                value={values[p.name] || ""}
                onChange={(e) => handleChange(p.name, e.target.value)}
              >
                <option value="">Select...</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            ) : (
              <input
                className="input-field"
                type={p.type === "integer" || p.type === "number" ? "number" : "text"}
                value={values[p.name] || ""}
                onChange={(e) => handleChange(p.name, e.target.value)}
                placeholder={`Enter ${p.name}`}
              />
            )}
          </div>
        ))
      )}

      <div className="flex items-center gap-2">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading || !requiredFilled}
        >
          {loading ? `${buttonLabel}...` : buttonLabel}
        </button>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    </div>
  );
}
