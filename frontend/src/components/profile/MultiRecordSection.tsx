'use client';
import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashBinIcon, ChevronDownIcon, ChevronUpIcon } from '@/icons';

export interface MultiRecordSectionProps<T extends { id: number }> {
  title: string;
  records: T[];
  loading?: boolean;
  renderRecord: (item: T, index: number) => React.ReactNode;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function MultiRecordSection<T extends { id: number }>({
  title,
  records,
  loading,
  renderRecord,
  onAdd,
  onEdit,
  onDelete,
  isCollapsed,
  onToggleCollapse,
}: MultiRecordSectionProps<T>) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] transition-all">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{title}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
            {records.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/60"
            title={collapsed ? 'Expand section' : 'Collapse section'}
          >
            {collapsed ? (
              <>
                <ChevronDownIcon className="w-4 h-4" />
                <span>Expand</span>
              </>
            ) : (
              <>
                <ChevronUpIcon className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {loading ? (
            <p className="px-6 py-4 text-sm text-gray-400">Loading...</p>
          ) : records.length === 0 ? (
            <p className="px-6 py-4 text-sm text-gray-400 italic">No records yet.</p>
          ) : (
            records.map((item, index) => (
              <div key={item.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">#{index + 1}</p>
                    {renderRecord(item, index)}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export { MultiRecordSection };
export default MultiRecordSection;