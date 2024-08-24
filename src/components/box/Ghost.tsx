import React, { useRef, useEffect, useState } from 'react';
import { BoxProps, SvgInfo, ContainerSize } from '@/common/types';
import { BASE_SIZE } from "@/utils/boxesUtils"


const Ghost: React.FC<BoxProps> = ({
  bgColor,
  className,
  height = BASE_SIZE,
  width = BASE_SIZE,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width, height });


  return (
    <div ref={ containerRef } style={ { width, height } } className={ className }>
      <svg width="100%" height="100%" viewBox={ "0 0 218 163" } preserveAspectRatio="xMidYMid meet">
        <path d="M33.5 125.908C13.7934 128.279 3.15596 130.609 0 108.908C30.0625 96.2362 33.5464 98.6584 33.5 52.4082C56.4077 7.73499 77.8138 -5.02149 129.5 1.66661C169.127 13.2032 184.024 27.3863 184.5 80.1664C192.88 95.1307 198.855 99.3973 217.5 107.666C219.207 124.088 212.291 127.649 185.5 123.666C185 133.5 185 154.166 185 154.166C183 160.166 172.83 163.003 164.5 158.667L136 130.167L121 156.408C118.833 157.575 114.1 162.167 108.5 162.167C102.9 162.167 89.5 140.833 83.5 130.167C70.6417 145.292 62.9429 155.488 53.5 158.667C50.2023 161.261 36.1513 159.78 34.5 156.408C34.1482 155.69 33.5 136.908 33.5 125.908Z" fill={ bgColor } />
      </svg>
    </div>
  );
};

export default Ghost;
