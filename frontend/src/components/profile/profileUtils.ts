export function toArray(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {}
    }
    return trimmed.split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
  }
  return [String(val)];
}

export function formatMultiValue(val: any, options?: { value: string; label: string }[]): string {
  const arr = toArray(val);
  if (arr.length === 0) return '';
  if (options && options.length > 0) {
    const optionMap = new Map(options.map((o) => [o.value, o.label]));
    return arr.map((v) => optionMap.get(v) ?? v).join(', ');
  }
  return arr.join(', ');
}