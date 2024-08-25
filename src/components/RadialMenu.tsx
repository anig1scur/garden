// components/RadialMenu.tsx
import { BoxType } from '@/common/types';
import React, { useEffect, useRef } from 'react';

interface MenuItem {
  id: BoxType;
  label: string;
  icon?: string;
}

const ITEMS: MenuItem[] = [
  { id: 'rect', label: 'Rect' },
  { id: 'curve', label: 'Curve' },
  { id: 'ghost', label: 'Ghost' },
  { id: 'smile', label: 'Smile' },
];

interface RadialMenuProps {
  position: { x: number; y: number };
  items?: MenuItem[];
  onSelect: (id: BoxType) => void;
  onClose: () => void;
}

const RadialMenu: React.FC<RadialMenuProps> = ({ position, items = ITEMS, onSelect, onClose }) => {
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
  }, [onClose]);

  const renderButtons = () => {
    const totalItems = Math.min(items.length, 6);
    const angleStep = (2 * Math.PI) / totalItems;
    const radius = 50; // Adjust this value to change the circle size

    return items.slice(0, 6).map((item, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return (
        <button
          key={ item.id }
          className="absolute bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-sm"
          style={ {
            transform: `translate(${ x }px, ${ y }px)`,
          } }
          onClick={ () => onSelect(item.id) }
        >
          { item.icon ? (
            <span role="img" aria-label={ item.label }>
              { item.icon }
            </span>
          ) : (
            item.label
          ) }
        </button>
      );
    });
  };

  return (
    <div
      ref={ ref }
      className="fixed z-50"
      style={ { left: position.x, top: position.y } }
      onClick={ (e) => e.stopPropagation() }
    >
      <div className="bg-white bg-opacity-60 w-36 h-36 rounded-full shadow-lg p-2 flex items-center justify-center relative">
        { renderButtons() }
      </div>
    </div>
  );
};

export default RadialMenu;
