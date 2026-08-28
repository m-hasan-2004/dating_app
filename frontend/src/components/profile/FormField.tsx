'use client';
import React from 'react';
import { toArray } from './profileUtils';

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
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export function useFormState<T extends object>(initial: T) {
  const [state, setState] = React.useState<T>(initial);
  const handleChange = (name: string, value: any) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };
  const reset = (data: T) => setState(data);
  return { state, handleChange, reset };
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  options,
  hint,
  required,
  placeholder,
  rows = 3,
}) => {
  const inputBaseClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const hintClass = "text-xs text-gray-500 mt-0.5";

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value ?? ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={inputBaseClass}
            rows={rows}
            placeholder={placeholder}
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
            <option value="">-- Select --</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-300 dark:border-gray-700 rounded-lg">
            {options?.map((opt) => (
              <label key={opt.value} className="flex items-center space-x-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={(e) => handleCheckboxChange(opt.value, e.target.checked)}
                  className="rounded text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
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
              <div className={`block w-10 h-6 rounded-full transition-colors ${value ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
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
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
};

export { FormField };
export default FormField;
