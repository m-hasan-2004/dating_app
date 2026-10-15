import React from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 hover:border-slate-300/90 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-xs hover:shadow-sm transition-all ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-4.5 border-b border-slate-100 dark:border-gray-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white/90">
          {title}
        </h3>
        {desc && (
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400">
            {desc}
          </p>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );

};

export default ComponentCard;
