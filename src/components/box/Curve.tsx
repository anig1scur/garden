import React, { useRef, useEffect, useState } from 'react';
import { BoxProps, SvgInfo, ContainerSize } from '@/common/types';
import { BASE_SIZE } from "@/utils/boxesUtils"

interface CurveProps extends BoxProps {
  curveType?: string;
  strokeWidth?: number;
}

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
  const pathLength = Math.sqrt(containerWidth * containerWidth + containerHeight * containerHeight);
  const spacePerChar = pathLength / textLength;
  return spacePerChar * 0.8;
};

const Curve: React.FC<CurveProps> = ({
  text,
  bgColor,
  color,
  className,
  height = BASE_SIZE,
  width = BASE_SIZE,
  curveType = 'curve_1',
  strokeWidth = 36,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width, height });
  const [svgInfo, setSvgInfo] = useState<SvgInfo>({
    pathD: '',
    width: width,
    height: height,
    viewBox: `0 0 ${ width } ${ height }`,
  });
  const [pathId, setPathId] = useState(`path-${ Date.now() }`);

  useEffect(() => {
    const loadSVG = async () => {
      try {
        const svgModule = await import(`@assets/${ curveType }.svg?raw`);
        const svgContent = svgModule.default;
        const { pathD, width, height, viewBox } = extractInfo(svgContent);
        setSvgInfo({ pathD, width, height, viewBox });
        // Generate a new unique ID for the path
        setPathId(`path-${ Date.now() }-${ Math.random().toString(36).substr(2, 9) }`);
      } catch (error) {
        console.error(`Failed to load SVG: ${ curveType }.svg`, error);
      }
    };

    loadSVG();

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
  }, [curveType]);

  if (!svgInfo.pathD) {
    return <div>Loading...</div>;
  }

  const { pathD, viewBox, width: svgWidth, height: svgHeight } = svgInfo;
  const fontSize = calculateFontSize(svgWidth, svgHeight, text?.length || 12);
  const textOffset = Math.min(svgWidth, svgHeight) * 0.1;

  return (
    <div ref={ containerRef } style={ { width, height } } className={ className }>
      <svg width="100%" height="100%" viewBox={ viewBox } preserveAspectRatio="xMidYMid meet">
        <path
          d={ pathD }
          stroke={ bgColor }
          strokeWidth={ strokeWidth }
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <path id={ pathId } d={ pathD } />
        </defs>
        <text className="text-zinc-400" dy={ textOffset }>
          <textPath
            href={ `#${ pathId }` }
            className="font-bold text"
            fill={ color }
            startOffset="50%"
            textAnchor="middle"
            style={ {
              fontSize: `${ fontSize }px`,
              letterSpacing: `${ fontSize * 0.05 }px`,
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
