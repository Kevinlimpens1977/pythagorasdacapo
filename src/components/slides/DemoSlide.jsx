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
      <div className="text-center py-20 px-16 bg-slate-50 border-b border-slate-100">
        <h2 className="text-8xl lg:text-[10rem] font-black text-slate-900 mb-8 tracking-tighter leading-none"><FormattedText text={slide.heading} /></h2>
        <div className="text-4xl lg:text-6xl text-slate-700 whitespace-pre-wrap font-medium max-w-[90%] mx-auto leading-tight">
          <FormattedText text={slide.content} />
        </div>
      </div>

      <div className="flex-1 p-16 lg:p-32 flex flex-col relative overflow-hidden">
        <div className="absolute top-10 right-10 text-[15rem] opacity-[0.03] pointer-events-none font-black text-slate-900 leading-none">DEMO</div>
        
        <div className="space-y-12 flex-1 relative z-10">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`p-14 lg:p-20 rounded-[4rem] text-5xl lg:text-7xl font-black transition-all duration-700 flex items-start gap-12 ${
                index < currentStep ? 'bg-slate-50 border-2 border-slate-100 text-slate-300 scale-95 blur-[2px] opacity-40' : 
                index === currentStep ? 'bg-white border-[12px] border-blue-500 text-slate-900 shadow-[0_50px_100px_-20px_rgba(37,99,235,0.25)] animate-in zoom-in-95' : 'opacity-0'
              }`}
            >
              <div className="flex-shrink-0 w-32 h-32 lg:w-40 lg:h-40 bg-blue-50 text-blue-500 rounded-[2.5rem] flex items-center justify-center text-6xl lg:text-8xl shadow-inner border-4 border-blue-100">
                {index + 1}
              </div>
              <div className="leading-[1.1] pt-4"><FormattedText text={step} /></div>
            </div>
          ))}
        </div>

        {currentStep < steps.length && (
          <div className="mt-24 flex justify-center py-10">
            <button 
              onClick={handleNextStep}
              className="flex items-center gap-8 px-24 py-12 bg-blue-600 hover:bg-blue-700 text-white rounded-[3rem] text-5xl font-black transition-all hover:-translate-y-4 shadow-[0_40px_80px_-15px_rgba(37,99,235,0.4)] active:translate-y-0"
            >
              Volgende stap <ChevronRight size={72} strokeWidth={4} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
