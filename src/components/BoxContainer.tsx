import React from 'react';
import { Rnd } from 'react-rnd';
import { motion, Variants } from 'framer-motion';
import { BoxItem } from '@/common/types';
import Rect from '@/components/Rect';
import Curve from '@/components/Curve';

interface BoxContainerProps {
  boxes: BoxItem[];
  mode: string;
  onBoxChange: (index: number, newPosition: Partial<BoxItem>) => void;
  setSelectedBoxIndex: (index: number | null) => void;
}

const BoxContainer: React.FC<BoxContainerProps> = ({ boxes, mode, onBoxChange, setSelectedBoxIndex }) => {
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

  return (
    <div className='relative w-full h-svh mt-10'>
      <div className='absolute top-0 left-0 w-full h-full opacity-80' />
      { boxes.map((box, index) => {
        const BoxComponent = index % 2 === 0 ? Curve : Rect;
        return mode === 'edit' ? (
          <Rnd
            key={ index }
            default={ { x: box.x, y: box.y, width: box.width, height: box.height } }
            className='border-dashed border-[1px] border-white'
            onDragStop={ (e, d) => onBoxChange(index, { x: d.x, y: d.y }) }
            onResize={ (e, direction, ref, delta, position) => {
              onBoxChange(index, {
                x: position.x,
                y: position.y,
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
            } }
            onClick={ (e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedBoxIndex(index);
            } }
          >
            <BoxComponent { ...box } />
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
    </div>
  );
};

export default BoxContainer;