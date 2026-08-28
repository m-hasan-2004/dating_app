import React from 'react';

interface DisplayRowProps {
  label: string;
  value?: React.ReactNode;
  valueClassName?: string;
}

const DisplayRow: React.FC<DisplayRowProps> = ({ label, value, valueClassName }) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 min-w-0 mr-4 shrink-0">{label}</span>
    <span className={`text-sm text-gray-900 dark:text-white text-right break-words ${valueClassName ?? ''}`}>
      {value !== null && value !== undefined && value !== '' ? value : <span className="text-gray-400 italic">—</span>}
    </span>
  </div>
);

export { DisplayRow };
export default DisplayRow;
