import FormattedText from '../common/FormattedText';

export default function TheorySlide({ slide }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch justify-center min-h-[calc(100vh-160px)] w-full h-full animate-in fade-in zoom-in-95 duration-700">
      {/* Tekst Gedeelte */}
      <div className={`flex flex-col justify-center ${slide.image ? 'w-full md:w-1/2' : 'w-full text-center'} bg-white p-8 md:p-16 lg:p-24`}>
        <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-slate-900 mb-12 tracking-tighter leading-[0.8] break-words">
          <FormattedText text={slide.heading} />
        </h2>
        <div className="text-4xl md:text-5xl lg:text-7xl leading-[1.05] text-slate-700 whitespace-pre-wrap font-medium w-full">
          <FormattedText text={slide.content} />
        </div>
      </div>

      {/* Afbeelding Gedeelte (indien aanwezig) */}
      {slide.image && (
        <div className="w-full md:w-1/2 flex justify-center items-center bg-slate-50/30 p-8 lg:p-16">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={slide.image} 
              alt={slide.heading} 
              className="rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] object-contain w-full h-full border-[8px] border-white max-h-[75vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
