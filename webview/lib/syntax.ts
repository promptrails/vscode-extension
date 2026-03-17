// Lightweight syntax highlighting that returns HTML spans

export function highlightJson(json: string): string {
  return json.replace(
    /("(?:\\.|[^"\\])*")\s*(:)?|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match, str, colon, bool, num) => {
      if (str) {
        if (colon) {
          return `<span class="syn-key">${esc(str)}</span>:`;
        }
        return `<span class="syn-str">${esc(str)}</span>`;
      }
      if (bool) return `<span class="syn-bool">${match}</span>`;
      if (num) return `<span class="syn-num">${match}</span>`;
      return match;
    },
  );
}

export function highlightCode(code: string, lang: string): string {
  switch (lang) {
    case "javascript":
      return tokenize(code, jsRules);
    case "python":
      return tokenize(code, pyRules);
    case "go":
      return tokenize(code, goRules);
    case "curl":
      return tokenize(code, curlRules);
    default:
      return esc(code);
  }
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface Rule {
  pattern: RegExp;
  cls: string;
}

/** Single-pass tokenizer — avoids regex interference */
function tokenize(code: string, rules: Rule[]): string {
  // Build a combined regex with named groups
  const combined = new RegExp(rules.map((r) => `(${r.pattern.source})`).join("|"), "gm");

  let result = "";
  let lastIndex = 0;

  for (const match of code.matchAll(combined)) {
    // Add unmatched text before this match (escaped)
    if (match.index! > lastIndex) {
      result += esc(code.slice(lastIndex, match.index!));
    }

    // Find which rule matched
    for (let i = 0; i < rules.length; i++) {
      if (match[i + 1] !== undefined) {
        result += `<span class="${rules[i].cls}">${esc(match[0])}</span>`;
        break;
      }
    }

    lastIndex = match.index! + match[0].length;
  }

  // Add remaining text
  if (lastIndex < code.length) {
    result += esc(code.slice(lastIndex));
  }

  return result;
}

const jsRules: Rule[] = [
  { pattern: /\/\/.*/, cls: "syn-comment" },
  { pattern: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/, cls: "syn-str" },
  {
    pattern:
      /\b(?:import|from|export|const|let|var|function|async|await|return|if|else|new|typeof|class|extends)\b/,
    cls: "syn-kw",
  },
  { pattern: /\b(?:console|require|module)\b/, cls: "syn-builtin" },
  { pattern: /\b\d+(?:\.\d+)?\b/, cls: "syn-num" },
];

const pyRules: Rule[] = [
  { pattern: /#.*/, cls: "syn-comment" },
  {
    pattern: /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/,
    cls: "syn-str",
  },
  {
    pattern:
      /\b(?:import|from|def|class|return|if|else|elif|for|in|with|as|try|except|raise|print|async|await|None|True|False)\b/,
    cls: "syn-kw",
  },
  { pattern: /\b\d+(?:\.\d+)?\b/, cls: "syn-num" },
];

const goRules: Rule[] = [
  { pattern: /\/\/.*/, cls: "syn-comment" },
  { pattern: /"(?:\\.|[^"\\])*"/, cls: "syn-str" },
  {
    pattern:
      /\b(?:package|import|func|var|const|type|struct|interface|return|if|else|for|range|defer|go|map|string|int|bool|error|nil)\b/,
    cls: "syn-kw",
  },
  { pattern: /\b\d+(?:\.\d+)?\b/, cls: "syn-num" },
];

const curlRules: Rule[] = [
  { pattern: /'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/, cls: "syn-str" },
  { pattern: /\bcurl\b/, cls: "syn-kw" },
  { pattern: /-[XHFG]|--[\w][\w-]*/, cls: "syn-builtin" },
  { pattern: /https?:\/\/[^\s\\]+/, cls: "syn-num" },
];
