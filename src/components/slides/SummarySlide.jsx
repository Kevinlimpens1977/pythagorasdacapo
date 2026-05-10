import FormattedText from '../common/FormattedText';
import { CheckCircle } from 'lucide-react';

export default function SummarySlide({ slide }) {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-full animate-in fade-in zoom-in-95 duration-1000 bg-white p-8 lg:p-16">
      <div className="w-40 h-40 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-12 shadow-[0_30px_60px_-10px_rgba(34,197,94,0.3)] border-[8px] border-white animate-bounce">
        <CheckCircle size={100} strokeWidth={4} />
      </div>
      <h2 className="slide-heading mb-12 break-words w-full"><FormattedText text={slide.heading} /></h2>
      <div className="slide-content whitespace-pre-wrap text-left bg-slate-50 p-12 lg:p-24 rounded-[3.5rem] border-[10px] border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] w-full">
        <FormattedText text={slide.content} />
      </div>
    </div>
  );
}
