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

export function formatMultiValue(val: any, options?: { value: string; label: string }[], t?: (k: string) => string): string {
  const arr = toArray(val);
  if (arr.length === 0) return '';
  const translate = t || ((k: string) => k);
  if (options && options.length > 0) {
    const findOption = (v: string) => {
      const match = options.find((o) => o.value.toLowerCase() === String(v).toLowerCase());
      return match ? translate(match.label) : translate(v);
    };
    return arr.map(findOption).join('، ');
  }
  return arr.map((v) => translate(v)).join('، ');
}

export * from '@/utils/formatters';