import React from 'react';

/**
 * Formats text by replacing **text** with a styled span.
 * Also handles newlines by converting them to <br /> if needed, 
 * though whitespace-pre-wrap usually handles that.
 */
export default function FormattedText({ text }) {
  if (!text) return null;

  // Split text by **...** or *...* patterns
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Double stars: Dark blue and extra bold
          const content = part.slice(2, -2);
          return (
            <span key={index} className="text-blue-950 font-extrabold">
              {content}
            </span>
          );
        } else if (part.startsWith('*') && part.endsWith('*')) {
          // Single stars: Just bold
          const content = part.slice(1, -1);
          return (
            <span key={index} className="font-bold">
              {content}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}
