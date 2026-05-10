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
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors z-[1000]"
              title="Sluit afbeelding (of druk ESC)"
            >
              <X size={32} strokeWidth={3} />
            </button>

            {/* Image */}
            <img
              src={src}
              alt={alt}
              className="w-full h-auto rounded-2xl shadow-2xl"
            />

            {/* Instructions */}
            <div className="text-center mt-4 text-white text-sm font-medium">
              Klik om te sluiten of druk ESC
            </div>
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
