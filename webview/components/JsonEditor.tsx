interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function JsonEditor({
  value,
  onChange,
  placeholder = "{\n  \n}",
  rows = 8,
}: JsonEditorProps) {
  return (
    <textarea
      className="input-field resize-y font-mono"
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
    />
  );
}
