import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import FormattedText from '../common/FormattedText';

export default function DemoSlide({ slide }) {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = slide.exercise?.steps || [];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in slide-in-from-right-8 duration-700 bg-white">
      <div className="text-center py-12 px-8 lg:py-16 lg:px-12 bg-slate-50 border-b border-slate-100">
        <h2 className="slide-heading mb-4"><FormattedText text={slide.heading} /></h2>
        <div className="text-2xl lg:text-3xl text-slate-700 whitespace-pre-wrap font-medium max-w-[90%] mx-auto leading-tight">
          <FormattedText text={slide.content} />
        </div>
      </div>

      <div className="flex-1 p-8 lg:p-16 flex flex-col relative overflow-hidden">
        <div className="absolute top-4 right-4 text-[10rem] opacity-[0.02] pointer-events-none font-black text-slate-900 leading-none">DEMO</div>

        <div className="space-y-6 flex-1 relative z-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-8 lg:p-12 rounded-[2.5rem] text-3xl lg:text-5xl font-black transition-all duration-700 flex items-start gap-6 ${
                index < currentStep ? 'bg-slate-50 border-2 border-slate-100 text-slate-300 scale-95 blur-[2px] opacity-40' :
                index === currentStep ? 'bg-white border-[8px] border-blue-500 text-slate-900 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.25)] animate-in zoom-in-95' : 'opacity-0'
              }`}
            >
              <div className="flex-shrink-0 w-20 h-20 lg:w-28 lg:h-28 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-4xl lg:text-6xl shadow-inner border-4 border-blue-100">
                {index + 1}
              </div>
              <div className="leading-[1.2] pt-2"><FormattedText text={step} /></div>
            </div>
          ))}
        </div>

        {currentStep < steps.length && (
          <div className="mt-12 flex justify-center py-6">
            <button
              onClick={handleNextStep}
              className="flex items-center gap-4 px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-2xl lg:text-3xl font-black transition-all hover:-translate-y-2 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] active:translate-y-0"
            >
              Volgende stap <ChevronRight size={40} strokeWidth={4} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
