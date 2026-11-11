import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  currentStep: 1 | 2 | 3 | 4;
  t: (key: string) => string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, t }) => {
  const steps = [
    { id: 1, label: t('stepper.request') },
    { id: 2, label: t('stepper.reviewCart') },
    { id: 3, label: t('stepper.safetyCheck') },
    { id: 4, label: t('stepper.pay') },
  ];

  return (
    <nav aria-label="Order progress" className="w-full py-2 px-4 bg-white/80 dark:bg-[#17211e]/80 backdrop-blur-sm border-b border-gray-200/70 dark:border-gray-800">
      <ol className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#0b6e4f] text-white'
                      : isActive
                      ? 'bg-[#d9a441] text-gray-950 ring-4 ring-[#d9a441]/25'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step.id}
                </span>
                <span
                  className={`text-xs font-semibold hidden sm:inline transition-colors ${
                    isActive
                      ? 'text-gray-900 dark:text-gray-100'
                      : isCompleted
                      ? 'text-[#0b6e4f] dark:text-emerald-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-3 bg-gray-200 dark:bg-gray-800 overflow-hidden rounded-full">
                  <div
                    className={`h-full bg-[#0b6e4f] transition-all duration-500 ${
                      isCompleted ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
