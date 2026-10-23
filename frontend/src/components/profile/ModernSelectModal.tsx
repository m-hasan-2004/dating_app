'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/modal';
import { useTranslation } from '@/context/LanguageContext';
import { SelectOption } from './FormField';

interface ModernSelectModalProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const ModernSelectModal: React.FC<ModernSelectModalProps> = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  required,
  disabled = false,
}) => {
  const { t, isRTL } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tempValue, setTempValue] = useState<string>(value ?? '');

  const openModal = () => {
    if (disabled) return;
    setTempValue(value ?? '');
    setSearch('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSelect = (val: string) => {
    setTempValue(val);
    onChange(name, val);
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onChange(name, '');
    setTempValue('');
    setIsOpen(false);
  };

  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [options, value]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter((opt) => {
      const translated = t(opt.label).toLowerCase();
      const raw = String(opt.label).toLowerCase();
      const valStr = String(opt.value).toLowerCase();
      return translated.includes(q) || raw.includes(q) || valStr.includes(q);
    });
  }, [options, search, t]);

  const showNoneOption = useMemo(() => {
    if (required) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const noneLabel = t('-- Without Selection / None --').toLowerCase();
    return noneLabel.includes(q) || 'none'.includes(q) || 'without'.includes(q);
  }, [required, search, t]);

  const triggerClass = `w-full px-3.5 py-2.5 text-sm rounded-xl border flex items-center justify-between text-start transition-all cursor-pointer ${
    disabled ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-gray-800' : ''
  } ${
    error
      ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10 text-red-900 dark:text-red-200'
      : 'bg-white border-slate-300 dark:border-gray-700 dark:bg-gray-800 text-slate-800 dark:text-white hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20'
  }`;

  return (
    <>
      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openModal}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal();
          }
        }}
        className={triggerClass}
      >
        <span className={selectedOption ? 'font-medium truncate' : 'text-slate-400 dark:text-gray-400 truncate'}>
          {selectedOption ? t(selectedOption.label) : (placeholder ? t(placeholder) : t('-- Select --'))}
        </span>
        <div className="flex items-center gap-1.5 shrink-0 text-slate-400 dark:text-gray-400">
          {value && !required && (
            <span
              role="button"
              tabIndex={0}
              title={t('Clear')}
              onClick={handleClear}
              className="p-1 hover:text-red-500 rounded-md transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Modern Picker Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} showCloseButton={false} className="max-w-lg w-full">
        <div className="p-5 sm:p-6 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t(label)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {t('Select an option')}
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              title={t('Close')}
              aria-label={t('Close')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Search box if options > 5 */}
          {options.length > 5 && (
            <div className="relative mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('Search...')}
                className={`w-full py-2 text-sm border border-slate-300 dark:border-gray-700 rounded-xl bg-slate-50 dark:bg-gray-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] ${
                  isRTL ? 'pr-9 pl-8' : 'pl-9 pr-8'
                }`}
              />
              <div className={`absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'} text-slate-400 pointer-events-none`}>
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  title={t('Clear')}
                  aria-label={t('Clear')}
                  className={`absolute top-2.5 ${isRTL ? 'left-3' : 'right-3'} text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 p-0.5`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 -mr-1 py-1">
            {/* None / Clear Option */}
            {showNoneOption && (
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleSelect('')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  !value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold'
                    : 'border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/60 text-slate-600 dark:text-gray-400'
                }`}
              >
                <span className="text-sm">{t('-- Without Selection / None --')}</span>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    !value ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-slate-300 dark:border-gray-600'
                  }`}
                >
                  {!value && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400 dark:text-gray-500">
                {t('No options match your search')}
              </p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={opt.value}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(opt.value)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/60 text-slate-700 dark:text-gray-200'
                    }`}
                  >
                    <span className="text-sm">{t(opt.label)}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                          : 'border-slate-300 dark:border-gray-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-gray-800 flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              {t('Cancel')}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModernSelectModal;
