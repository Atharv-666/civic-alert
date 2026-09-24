import React from 'react';
import { AlertTriangle, Wrench, CheckCircle2 } from 'lucide-react';

const steps = [
  { key: 'Pending', label: 'Pending', icon: AlertTriangle },
  { key: 'In Progress', label: 'In Progress', icon: Wrench },
  { key: 'Resolved', label: 'Resolved', icon: CheckCircle2 },
];

const StatusTracker = ({ status = 'Pending' }) => {
  const getStepIndex = (currentStatus) => {
    switch (currentStatus) {
      case 'In Progress':
        return 1;
      case 'Resolved':
        return 2;
      case 'Pending':
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="w-full py-2">
      <div className="relative flex items-center justify-between w-full">
        {/* Background connector bar */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />

        {/* Active progress connector bar */}
        <div
          className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 transition-all duration-500 rounded-full ${
            status === 'Resolved'
              ? 'bg-emerald-500'
              : status === 'In Progress'
              ? 'bg-blue-600'
              : 'bg-red-500'
          }`}
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          let badgeBg = 'bg-slate-100 text-slate-400 border-slate-300';
          if (isCompleted) {
            if (step.key === 'Pending') badgeBg = 'bg-red-500 text-white border-red-500 ring-4 ring-red-100';
            if (step.key === 'In Progress') badgeBg = 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100';
            if (step.key === 'Resolved') badgeBg = 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100';
          }

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${badgeBg}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 tracking-tight ${
                  isCurrent
                    ? step.key === 'Resolved'
                      ? 'text-emerald-700 font-bold'
                      : step.key === 'In Progress'
                      ? 'text-blue-700 font-bold'
                      : 'text-red-700 font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusTracker;
