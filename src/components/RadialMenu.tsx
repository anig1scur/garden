// components/RadialMenu.tsx
import React, { useEffect, useRef } from 'react';

interface RadialMenuProps {
  position: { x: number; y: number };
  onSelect: (type: 'curve' | 'rect') => void;
  onClose: () => void;
}

const RadialMenu: React.FC<RadialMenuProps> = ({ position, onSelect, onClose }) => {

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    }

  }, [])

  return (
    <div
      ref={ ref }
      className="fixed z-50"
      style={ { left: position.x, top: position.y } }
      onClick={ (e) => e.stopPropagation() }
    >
      <div className="bg-white rounded-full shadow-lg p-2 flex items-center justify-center" style={ { width: '120px', height: '120px' } }>
        <button
          className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full w-12 h-12"
          onClick={ () => onSelect('curve') }
        >
          Curve
        </button>
        <button
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full w-12 h-12"
          onClick={ () => onSelect('rect') }
        >
          Rect
        </button>
      </div>
    </div>
  );
};

export default RadialMenu;
