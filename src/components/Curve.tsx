import React, { useRef, useEffect, useState } from 'react';
import { BoxProps, SvgInfo, ContainerSize } from '@/common/types';
import ShapeSVG from '@assets/shape1.svg?raw';
import { BASE_SIZE } from "@/utils/boxesUtils"

const extractInfo = (svgString: string): SvgInfo => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  const pathElement = svgDoc.querySelector('path');
  const pathD = pathElement?.getAttribute('d') || '';
  const width = parseInt(svgDoc.documentElement.getAttribute('width') || `${ BASE_SIZE }`);
  const height = parseInt(svgDoc.documentElement.getAttribute('height') || `${ BASE_SIZE }`);
  const viewBox = svgDoc.documentElement.getAttribute('viewBox') || `0 0 ${ width } ${ height }`;
  return { pathD, width, height, viewBox };
};

const calculateFontSize = (containerWidth: number, containerHeight: number, textLength: number): number => {
  // 估算路径长度（这里使用容器对角线长度作为近似值）
  const pathLength = Math.sqrt(containerWidth * containerWidth + containerHeight * containerHeight);
  // 计算每个字符可用的空间
  const spacePerChar = pathLength / textLength;

  let fontSize = spacePerChar * 1.25;


  return fontSize;
};
const Curve: React.FC<BoxProps> = ({
  text,
  bgColor,
  color,
  className,
  height = 100,
  width = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width, height });
  const [svgInfo, setSvgInfo] = useState<SvgInfo>({
    pathD: '',
    width: width,
    height: height,
    viewBox: `0 0 ${ width } ${ height }`,
  });

  useEffect(() => {
    const { pathD, width, height, viewBox } = extractInfo(ShapeSVG);
    setSvgInfo({ pathD, width, height, viewBox });

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!svgInfo.pathD) {
    return <div>Loading...</div>;
  }

  const { pathD, viewBox } = svgInfo;
  const fontSize = calculateFontSize(90, 90, text?.length || 12);
  const textTranslate = text?.length < 6 ? 'translate-y-3' : 'translate-y-2';

  return (
    <div ref={ containerRef } style={ { width, height } } className={ className }>
      <svg width="100%" height="100%" viewBox={ viewBox } preserveAspectRatio="xMidYMid meet">
        <path
          d={ pathD }
          stroke={ bgColor }
          strokeWidth={ 36 }
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <path id="textPath" d={ pathD } />
        </defs>
        <text className={ `${ textTranslate } text-zinc-400` }>
          <textPath
            href="#textPath"
            className="font-bold"
            fill={ color }
            startOffset="50%"
            textAnchor="middle"
            style={ {
              fontSize: `${ fontSize }px`,
              letterSpacing: `${ fontSize * 0.05 }px`
            } }
          >
            { text }
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default Curve;

