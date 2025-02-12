import { useState } from 'react';
import Image from 'next/image';

const ZoomableImage = ({ src, alt, width, height, className }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="relative w-full">
      <div 
        className={`
          cursor-zoom-in
          transition-all duration-300 ease-in-out
          ${isZoomed ? 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4' : ''}
        `}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`
            transition-transform duration-300 ease-in-out
            ${className}
            ${isZoomed ? 'max-h-[90vh] w-auto h-auto object-contain cursor-zoom-out' : ''}
          `}
          priority={true}
        />
      </div>
      {isZoomed && (
        <button
          onClick={() => setIsZoomed(false)}
          className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ZoomableImage;