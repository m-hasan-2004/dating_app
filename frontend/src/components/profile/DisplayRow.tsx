'use client';
import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { formatBoolean } from '@/utils/formatters';

interface DisplayRowProps {
  label: string;
  value?: React.ReactNode;
  valueClassName?: string;
}

const DisplayRow: React.FC<DisplayRowProps> = ({ label, value, valueClassName }) => {
  const { t, isRTL } = useTranslation();

  let renderedValue: React.ReactNode = value;
  if (typeof value === 'boolean') {
    renderedValue = formatBoolean(value, isRTL);
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      renderedValue = null;
    } else {
      renderedValue = (
        <span>
          {value.map((v, idx) => (
            <React.Fragment key={idx}>
              {t(String(v).trim())}
              {idx < value.length - 1 ? '، ' : ''}
            </React.Fragment>
          ))}
        </span>
      );
    }
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.toLowerCase() === 'none') {
      renderedValue = isRTL ? 'هیچکدام' : 'None';
    } else if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
        if (Array.isArray(parsed)) {
          renderedValue = parsed.map((p) => t(String(p).trim())).join('، ');
        } else {
          renderedValue = t(trimmed);
        }
      } catch {
        renderedValue = t(trimmed);
      }
    } else if (trimmed.includes(',') && !trimmed.startsWith('{')) {
      renderedValue = trimmed.split(',').map((p) => t(p.trim())).join('، ');
    } else {
      renderedValue = t(trimmed);
    }
  }

  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-0 mx-2 shrink-0">{t(label)}</span>
      <span className={`text-sm text-gray-900 dark:text-white break-words ${valueClassName ?? ''}`}>
        {renderedValue !== null && renderedValue !== undefined && renderedValue !== '' ? renderedValue : <span className="text-gray-400 italic">—</span>}
      </span>
    </div>
  );
};

export { DisplayRow };
export default DisplayRow;
