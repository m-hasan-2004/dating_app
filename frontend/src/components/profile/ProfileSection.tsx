'use client';
import React, { useState } from 'react';
import { PencilIcon, PlusIcon, ChevronDownIcon, ChevronUpIcon } from '@/icons';

export interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
  loading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
  onEdit,
  loading,
  isEmpty,
  emptyText,
  isCollapsed,
  onToggleCollapse,
}) => {
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
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{title}</h3>
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
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
          >
            {isEmpty ? <PlusIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
            {isEmpty ? 'Add' : 'Edit'}
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="px-6 py-4">
          {loading ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
          ) : isEmpty ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">{emptyText ?? 'No data yet. Click Add to fill in.'}</p>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export { ProfileSection };
export default ProfileSection;