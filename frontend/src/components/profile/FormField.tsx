'use client';
import React from 'react';
import { toArray } from './profileUtils';
import { useTranslation } from '@/context/LanguageContext';
import ModernDatePicker from '@/components/ui/ModernDatePicker';

export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'boolean';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type: FieldType;
  value: any;
  onChange: (name: string, value: any) => void;
  options?: SelectOption[];
  hint?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export function useFormState<T extends object>(initial: T) {
  const [state, setState] = React.useState<T>(initial);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setState((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const reset = (data: T) => {
    setState(data);
    setFieldErrors({});
  };

  return { state, handleChange, reset, fieldErrors, setFieldErrors };
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  options,
  hint,
  error,
  required,
  placeholder,
  rows = 3,
}) => {
  const { t } = useTranslation();

  const inputBaseClass = `w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all ${
    error
      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200 focus:border-red-500 focus:ring-red-500'
      : 'bg-white border-slate-300 dark:border-gray-700 dark:bg-gray-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]'
  }`;
  const labelClass = 'block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1.5';
  const hintClass = 'text-xs text-slate-500 dark:text-gray-400 mt-1';
  const errorClass = 'text-xs text-red-600 dark:text-red-400 mt-1 font-medium flex items-center gap-1';


  const renderInput = () => {
    switch (type) {
      case 'date':
        return (
          <ModernDatePicker
            id={name}
            name={name}
            value={value ?? ''}
            onChange={(val) => onChange(name, val)}
            placeholder={placeholder}
            error={error}
            required={required}
          />
        );
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={inputBaseClass}
            rows={rows}
            placeholder={placeholder ? t(placeholder) : undefined}
            required={required}
          />
        );
      case 'select':
        return (
          <select
            name={name}
            value={value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={inputBaseClass}
            required={required}
          >
            <option value="">{t('-- Select --')}</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.label)}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        const selectedValues = toArray(value);
        const handleCheckboxChange = (optValue: string, checked: boolean) => {
          if (checked) {
            onChange(name, [...selectedValues, optValue]);
          } else {
            onChange(name, selectedValues.filter((v: string) => v !== optValue));
          }
        };
        return (
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-3 border rounded-xl bg-white dark:bg-gray-800 ${
              error
                ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10'
                : 'border-slate-300 dark:border-gray-700'
            }`}
          >
            {options?.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={(e) => handleCheckboxChange(opt.value, e.target.checked)}
                  className="rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-slate-700 dark:text-gray-300 text-xs font-medium">{t(opt.label)}</span>
              </label>
            ))}
          </div>

        );
      case 'boolean':
        return (
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={!!value}
                onChange={(e) => onChange(name, e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${value ? 'bg-[var(--color-primary)]' : 'bg-slate-300 dark:bg-gray-600'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${value ? 'transform translate-x-4' : ''}`}></div>
            </div>
          </label>
        );
      default:
        return (
          <input
            type={type}
            name={name}
            value={value ?? ''}
            onChange={(e) => {
              let val = e.target.value;
              if (type === 'number') {
                onChange(name, val === '' ? null : Number(val));
              } else {
                onChange(name, val);
              }
            }}
            className={inputBaseClass}
            placeholder={placeholder}
            required={required}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label className={labelClass}>
        {t(label)}
        {required && <span className="text-red-500 mx-1">*</span>}
      </label>
      {renderInput()}
      {hint && !error && <p className={hintClass}>{t(hint)}</p>}
      {error && (
        <p className={errorClass}>
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export { FormField };
export default FormField;
