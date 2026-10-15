'use client';
import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { formatBoolean, toPersianDigits } from '@/utils/formatters';

interface DisplayRowProps {
  label: string;
  value?: React.ReactNode;
  valueClassName?: string;
}

const DisplayRow: React.FC<DisplayRowProps> = ({ label, value, valueClassName }) => {
  const { t, isRTL } = useTranslation();

  const isTechnicalKey =
    label.toLowerCase().includes('email') ||
    label.toLowerCase().includes('website') ||
    label.toLowerCase().includes('url');

  let renderedValue: React.ReactNode = value;
  if (typeof value === 'boolean') {
    renderedValue = formatBoolean(value, isRTL);
  } else if (typeof value === 'number') {
    renderedValue = isRTL ? toPersianDigits(value) : String(value);
  } else if (Array.isArray(value)) {
    if (value.length === 0) {
      renderedValue = null;
    } else {
      renderedValue = (
        <span>
          {value.map((v, idx) => {
            const str = String(v).trim();
            const trans = t(str);
            const formatted = isRTL && !isTechnicalKey ? toPersianDigits(trans) : trans;
            return (
              <React.Fragment key={idx}>
                {formatted}
                {idx < value.length - 1 ? (isRTL ? '، ' : ', ') : ''}
              </React.Fragment>
            );
          })}
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
          renderedValue = parsed
            .map((p) => {
              const trans = t(String(p).trim());
              return isRTL && !isTechnicalKey ? toPersianDigits(trans) : trans;
            })
            .join(isRTL ? '، ' : ', ');
        } else {
          const trans = t(trimmed);
          renderedValue = isRTL && !isTechnicalKey ? toPersianDigits(trans) : trans;
        }
      } catch {
        const trans = t(trimmed);
        renderedValue = isRTL && !isTechnicalKey ? toPersianDigits(trans) : trans;
      }
    } else if (trimmed.includes(',') && !trimmed.startsWith('{')) {
      renderedValue = trimmed
        .split(',')
        .map((p) => {
          const trans = t(p.trim());
          return isRTL && !isTechnicalKey ? toPersianDigits(trans) : trans;
        })
        .join(isRTL ? '، ' : ', ');
    } else {
      const trans = t(trimmed);
      renderedValue = isRTL && !isTechnicalKey ? toPersianDigits(trans) : trans;
    }
  }

  return (
    <div className="flex items-start justify-between py-2 border-b border-slate-100 dark:border-gray-800 last:border-0">
      <span className="text-sm font-medium text-slate-500 dark:text-gray-400 min-w-0 mx-2 shrink-0">{t(label)}</span>
      <span className={`text-sm text-slate-900 dark:text-white break-words ${valueClassName ?? ''}`}>
        {renderedValue !== null && renderedValue !== undefined && renderedValue !== '' ? renderedValue : <span className="text-slate-400 italic">—</span>}
      </span>
    </div>
  );
};

export { DisplayRow };
export default DisplayRow;

