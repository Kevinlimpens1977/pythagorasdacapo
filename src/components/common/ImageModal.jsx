import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ImageModal({ src, alt = 'Afbeelding' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Clickable Image with zoom indicator */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-full group rounded-[3rem] overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        <img
          src={src}
          alt={alt}
          className="relative rounded-[3rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)] border-[8px] border-white w-full object-contain max-h-[50vh] group-hover:brightness-95 transition-all duration-200 cursor-pointer"
        />

        {/* Zoom indicator overlay */}
        <div className="absolute inset-0 rounded-[3rem] bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
          <div className="bg-white/90 group-hover:bg-white rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200">
            <ZoomIn size={24} className="text-blue-600" />
          </div>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm overflow-auto animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button - fixed position */}
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-4 right-4 text-white hover:text-blue-400 transition-colors z-[1001] bg-black/50 hover:bg-black/70 rounded-full p-2"
            title="Sluit afbeelding (of druk ESC)"
          >
            <X size={32} strokeWidth={3} />
          </button>

          {/* Image container - centered with padding */}
          <div
            className="flex items-center justify-center min-h-screen p-4 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="rounded-2xl shadow-2xl max-h-[90vh] w-auto"
              style={{
                transform: 'scale(1.75)',
                transformOrigin: 'center center'
              }}
            />
          </div>

          {/* Instructions - fixed position */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-6 py-3 rounded-full">
            Klik om te sluiten of druk ESC
          </div>
        </div>
      )}

      {/* Keyboard handler */}
      {isOpen && (
        <div
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          tabIndex={0}
          style={{ position: 'fixed', left: '-9999px' }}
        />
      )}
    </>
  );
}
