
import { FC, useRef, useEffect, useState } from 'react';
import { BoxProps } from '@/common/types';
import { BASE_SIZE } from "@/utils/boxesUtils"

type EyesProps = {
  direction?: 'left' | 'right' | 'top'
}


const Eyes: FC<EyesProps> = ({ direction }) => {
  const getTranslate = () => {
    if (direction === 'left') return 'translate-x-[-50%] translate-y-[50%]';
    if (direction === 'right') return 'translate-x-[50%] translate-y-[50%]';
    return '';
  };

  return (
    <div className={ `w-[45%] m-auto h-8 flex justify-between ${ direction === 'top' ? 'translate-y-[5%]' : 'translate-y-[100%]' }` }>
      { [0, 1].map((i) => (
        <div key={ i } className='rounded-full bg-white w-8 h-8'>
          <div className={ `rounded-full w-4 h-4 m-auto bg-black ${ getTranslate() }` }></div>
        </div>
      )) }
    </div>
  );
};

const Ghost: FC<BoxProps> = ({
  bgColor,
  className,
  height = BASE_SIZE,
  width = BASE_SIZE,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={ containerRef } style={ { width, height } } className={ className }>
      <svg width="100%" height="100%" viewBox={ "0 0 219 163" } preserveAspectRatio="xMidYMid meet">
        <g className='bound'>
          <path d="M32 127.112C12.2934 129.484 6.5 128.612 0 113.112C12.5 96.1123 31.5 110.112 34.5 59.1125C37.144 14.1652 75.8138 -5.40883 127.5 1.27927C162.5 8.1123 177 26.6123 180.5 51.1123C185.5 103.112 205 103.612 219 106.112C219 127.612 204.5 129.779 185 125.521C184.366 175.834 171.158 171.617 134 129.779C123.744 154.279 117.825 163.793 106.5 161.779C100.986 160.799 87.5 140.446 81.5 129.779C47.7491 172.473 32 173.112 32 127.112Z" fill={bgColor} />
        </g>
        <foreignObject className='h-full translate-y-[5%]  w-full'>
          <Eyes direction='right' />
        </foreignObject>
      </svg>
    </div>
  );
};

export default Ghost;
