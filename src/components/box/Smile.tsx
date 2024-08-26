
import { FC, useRef, useEffect, useState } from 'react';
import { BoxProps } from '@/common/types';
import { BASE_SIZE } from "@/utils/boxesUtils"

const SmilePositions = {
  lt: 'rotate-[270deg] translate-x-[100%] translate-y-[100%]',
  rt: 'rotate-[180deg] translate-x-[300%] translate-y-[100%]',
  lb: 'rotate-[0deg] translate-x-[100%] translate-y-[300%]',
  rb: 'rotate-[90deg] translate-x-[300%] translate-y-[300%]',
}

const Smile: FC<BoxProps> = ({
  bgColor,
  color,
  pos = 'lb',
  className,
  height = BASE_SIZE,
  width = BASE_SIZE,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={ containerRef } style={ { width, height, backgroundColor: bgColor, borderRadius: '100%' } } className={ className }>
      <svg width="20%" height="20%" viewBox="0 0 47 51" fill="none" className={ ` ${ SmilePositions[pos] }` } preserveAspectRatio="xMidYMid meet">
        <rect x="29.1592" y="6.96509" width="10" height="12" transform="rotate(121.158 29.1592 6.96509)" fill={ color } />
        <rect x="15.9404" y="27.417" width="10" height="12" transform="rotate(121.158 15.9404 27.417)" fill={ color } />
        <path d="M33.8401 30.2411C38.6228 22.7713 39.4081 13.8872 36.7464 6.09925L44.1941 3.67798C47.5537 13.6186 46.5327 24.9392 40.4345 34.4634C34.4132 43.8676 24.7298 49.509 14.442 50.717L13.4375 42.9503C21.5105 42.0304 29.1172 37.6173 33.8401 30.2411Z" fill={ color } />
      </svg>
    </div >
  );
};

export default Smile;
