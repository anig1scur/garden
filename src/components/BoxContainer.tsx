import React, { useState, useRef } from 'react';
import { motion, Variants, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { BoxItem } from '@/common/types';
import Rect from '@/components/Rect';
import Curve from '@/components/Curve';
import { randomColor } from '@/utils/randomUtils';
import BoxEditor from '@/components/BoxEditor';

interface BoxContainerProps {
  boxes: BoxItem[];
  mode: string;
  onBoxChange: (index: number, newPosition: Partial<BoxItem>) => void;
  selectedBoxIdx: number | null;
  setSelectedBoxIndex: (index: number | null) => void;
  onNewBoxCreate: (newBox: BoxItem) => void;
}

const boxVariants: Variants = {
  initial: { x: 0, y: 0 },
  hover: {
    scale: 1.25,
    transition: { duration: 0.2, staggerChildren: 0.1 },
    zIndex: 999,
  }
};

const descVariants: Variants = {
  initial: { display: "none" },
  hover: { display: "block" },
};

const BoxContainer: React.FC<BoxContainerProps> = ({ boxes, mode, onBoxChange, selectedBoxIdx, setSelectedBoxIndex, onNewBoxCreate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);

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
          bgColor: randomColor()
        };

        onNewBoxCreate(newBox);
      }
    }
  };

  const handleDragEnd = (index: number) => (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const xDirection = info.offset.x > 0 ? 1 : -1;
    const yDirection = info.offset.y > 0 ? 1 : -1;
    const xVelocity = Math.min(Math.abs(info.velocity.x), 1);
    const yVelocity = Math.min(Math.abs(info.velocity.y), 1);
    // const rotation = Math.floor(velocity * 40 * direction);

    onBoxChange(index, {
      x: boxes[index].x + info.offset.x + xVelocity * 100 * xDirection,
      y: boxes[index].y + info.offset.y + yVelocity * 100 * yDirection,
      // rotate: boxes[index].rotate ? boxes[index].rotate + rotation : rotation
    });
  };

  return (
    <div
      className='relative opacity-80 w-full max-h-screen h-screen overflow-auto select-none'
      onPointerDown={ handleMouseDown }
      onPointerMove={ handleMouseMove }
      onPointerUp={ handleMouseUp }
      ref={ containerRef }
      style={ { cursor: isDragging ? 'crosshair' : 'default' } }
    >
      { boxes.map((box, index) => {
        const BoxComponent = index % 2 === 0 ? Curve : Rect;
        const selected = index === selectedBoxIdx;

        return mode === 'edit' ? (
          <motion.div
            key={ index }
            drag
            dragElastic={ 0.1 }
            dragMomentum={ true }
            initial={
              {
                x: box.x,
                y: box.y
              }
            }
            animate={
              {
                x: box.x,
                y: box.y
              }
            }
            dragTransition={ { timeConstant: 200, power: 0.1 } }
            onDragEnd={ handleDragEnd(index) }
            style={ {
              position: 'absolute',
              width: box.width,
              height: box.height,
            } }
            transition={ {
              type: "spring",
              stiffness: 50,
              damping: 30,
              mass: 1,
              restDelta: 0.001,
            } }
            className={ `border-2 border-dashed border-white ${ selected && "z-10" }` }
            onClick={ (e) => e.stopPropagation() }
            onDoubleClick={ () => setSelectedBoxIndex(index) }
          >
            <BoxComponent { ...box } />
            <BoxEditor
              show={ selected }
              selectedBox={ box }
              onBoxChange={ (updatedBox) => onBoxChange(index, updatedBox) }
            />
          </motion.div>
        ) : (
          <motion.div
            key={ index }
            initial={ "initial" }
            animate={ { x: box.x, y: box.y } }
            whileHover="hover"
            variants={ boxVariants }
            style={ { position: 'absolute' } }
            transition={ {
              type: "spring",
              stiffness: 50,
              damping: 30,
              mass: 1,
              restDelta: 0.001,
            } }
          >
            <BoxComponent { ...box } />
            { box.desc && <motion.div
              transition={ {
                type: "just"
              } }
              className='absolute backdrop-blur-sm top-[100%] right-0 p-3 bg-white bg-opacity-50'
              variants={ descVariants }
            >
              { box.desc }
            </motion.div> }
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
    </div>
  );
};

export default BoxContainer;