interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < currentStep
                  ? 'bg-green-500 text-white'
                  : i === currentStep
                  ? 'bg-royal-600 text-white ring-4 ring-royal-100'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-sm font-semibold ${
                i <= currentStep ? 'text-navy-900' : 'text-slate-400'
              }`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-6 sm:w-10 h-0.5 rounded-full transition-all duration-300 ${
                i < currentStep ? 'bg-green-500' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
