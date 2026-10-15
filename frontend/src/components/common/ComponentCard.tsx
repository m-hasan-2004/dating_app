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
      className={`relative overflow-hidden rounded-2xl border border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-white/[0.03] shadow-soft hover:shadow-soft-hover transition-all duration-200 before:absolute before:top-0 before:inset-x-0 before:h-1 before:bg-gradient-to-r before:from-[var(--color-primary)] before:to-[var(--color-accent)] ${className}`}
    >
      {/* Card Header */}
      <div className="px-6 py-4.5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {desc && (
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
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
