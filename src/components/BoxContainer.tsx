import React, { useState, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { motion, Variants } from 'framer-motion';
import { BoxItem } from '@/common/types';
import Rect from '@/components/Rect';
import Curve from '@/components/Curve';
import { randomColor } from '@/utils/randomUtils';
import BoxEditor from '@/components/BoxEditor';
import RadialMenu from './RadialMenu';

interface BoxContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  boxes: BoxItem[];
  mode: string;
  onBoxChange: (index: number, newPosition: Partial<BoxItem>) => void;
  selectedBoxIdx: number | null;
  setSelectedBoxIndex: (index: number | null) => void;
  onNewBoxCreate: (newBox: BoxItem) => void;
}

const getBoxComponent = (type?: string) => {
  switch (type) {
    case 'curve':
      return Curve;
    case 'rect':
      return Rect;
    default:
      return Rect;
  }
}

const BoxContainer: React.FC<BoxContainerProps> = ({ containerRef, boxes, mode, onBoxChange, selectedBoxIdx, setSelectedBoxIndex, onNewBoxCreate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);
  const [showRadialMenu, setShowRadialMenu] = useState(false);
  const [radialMenuPosition, setRadialMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [newComponentType, setNewComponentType] = useState<'curve' | 'rect' | undefined>(undefined);

  const boxVariants: Variants = {
    hover: {
      scale: 1.25,
      transition: { duration: 0.2, staggerChildren: 0.1 },
      zIndex: 999,
    }
  };

  const descVariants: Variants = {
    rest: { display: "none", opacity: 0 },
    hover: { display: "block", opacity: 1 },
  };

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (mode === 'edit') {
      setShowRadialMenu(true);
      setRadialMenuPosition({ x: e.clientX, y: e.clientY });
    }
  }, [mode]);

  const handleRadialMenuSelect = useCallback((type: 'curve' | 'rect') => {
    setNewComponentType(type);
    setShowRadialMenu(false);

    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const newBox: BoxItem = {
        type,
        x: radialMenuPosition.x - rect.left + container.scrollLeft,
        y: radialMenuPosition.y - rect.top + container.scrollTop,
        width: 100,
        height: 100,
        text: '',
        desc: '',
        color: 'white',
        bgColor: randomColor(),
      };
      onNewBoxCreate(newBox);
    }
  }, [radialMenuPosition, onNewBoxCreate]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode === 'edit' && e.target === containerRef.current) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setIsDragging(true);
        setDragStart({
          x: e.clientX - rect.left + container.scrollLeft,
          y: e.clientY - rect.top + container.scrollTop
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStart) {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setCurrentPosition({
          x: e.clientX - rect.left + container.scrollLeft,
          y: e.clientY - rect.top + container.scrollTop
        });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && dragStart && mode === 'edit') {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const endX = e.clientX - rect.left + container.scrollLeft;
        const endY = e.clientY - rect.top + container.scrollTop;

        const width = Math.abs(endX - dragStart.x);
        const height = Math.abs(endY - dragStart.y);

        setIsDragging(false);
        setDragStart(null);
        setCurrentPosition(null);

        if (width < 20 || height < 20) {
          return;
        }

        const x = Math.min(endX, dragStart.x);
        const y = Math.min(endY, dragStart.y);

        const newBox: BoxItem = {
          x,
          y,
          width,
          height,
          text: '',
          desc: '',
          color: 'white',
          type: newComponentType,
          bgColor: randomColor()
        };

        onNewBoxCreate(newBox);
      }
    }
  };


  return (
    <div
      className='relative w-full max-h-screen h-screen overflow-auto select-none'
      onContextMenu={ handleContextMenu }
      onPointerDown={ handleMouseDown }
      onPointerMove={ handleMouseMove }
      onPointerUp={ handleMouseUp }
      ref={ containerRef }
      style={ { cursor: isDragging ? 'crosshair' : 'default' } }
    >
      { boxes.map((box, index) => {
        const BoxComponent = getBoxComponent(box.type)
        const selected = index === selectedBoxIdx;
        return mode === 'edit' ? (
          <Rnd
            key={ index }
            default={ { x: box.x, y: box.y, width: box.width, height: box.height } }
            className={ `border-2 border-dashed border-white ${ selected && "z-10" }` }
            onDragStop={ (e, d) => onBoxChange(index, { x: d.x, y: d.y }) }
            onResize={ (e, direction, ref, delta, position) => {
              onBoxChange(index, {
                x: position.x,
                y: position.y,
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
            } }
          >
            <div
              onClick={ (e) => e.stopPropagation() }
              onDoubleClick={ () => setSelectedBoxIndex(index) }>
              <BoxComponent
                { ...box } />
              <BoxEditor show={ selected } selectedBox={ box } onBoxChange={ (updatedBox) => onBoxChange(index, updatedBox) } />
            </div>
          </Rnd>
        ) : (
          <motion.div
            key={ index }
            initial="rest"
            whileHover="hover"
            animate="rest"
            variants={ boxVariants }
            style={ { position: 'absolute', left: box.x, top: box.y } }
          >
            <BoxComponent { ...box } />
            <motion.div
              className='absolute backdrop-blur-sm top-[100%] right-0 p-3 bg-white bg-opacity-50'
              variants={ descVariants }
            >
              { box.desc }
            </motion.div>
          </motion.div>
        );
      }) }
      { isDragging && dragStart && currentPosition && (
        <div
          className="absolute border-2 border-dashed border-white bg-white bg-opacity-20"
          style={ {
            left: Math.min(dragStart.x, currentPosition.x),
            top: Math.min(dragStart.y, currentPosition.y),
            width: Math.abs(currentPosition.x - dragStart.x),
            height: Math.abs(currentPosition.y - dragStart.y),
          } }
        />
      ) }
      { showRadialMenu && (
        <RadialMenu
          position={ radialMenuPosition }
          onSelect={ handleRadialMenuSelect }
          onClose={ () => setShowRadialMenu(false) }
        />
      ) }
    </div>
  );
};

export default BoxContainer;
