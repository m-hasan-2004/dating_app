import React, { useState } from "react";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo" | "optionThree"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo" | "optionThree") =>
    selected === option
      ? "shadow-xs text-slate-900 font-semibold dark:text-white bg-white dark:bg-gray-800"
      : "text-slate-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 border border-slate-200/60 dark:bg-gray-900 dark:border-gray-800">
      <button
        onClick={() => setSelected("optionOne")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-slate-900 dark:hover:text-white transition-colors ${getButtonClass(
          "optionOne"
        )}`}
      >
        Monthly
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-slate-900 dark:hover:text-white transition-colors ${getButtonClass(
          "optionTwo"
        )}`}
      >
        Quarterly
      </button>

      <button
        onClick={() => setSelected("optionThree")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-slate-900 dark:hover:text-white transition-colors ${getButtonClass(
          "optionThree"
        )}`}
      >
        Annually
      </button>
    </div>
  );
};

export default ChartTab;
