import React from 'react';
import { ReactComponent as MirrorSvg } from '@assets/mirror.svg';
import { ReactComponent as HexagonSvg } from '@assets/hexagon.svg';
import { ReactComponent as PetalSvg } from '@assets/petal.svg';
import { ReactComponent as RectangleSvg } from '@assets/rectangle.svg';

export interface ShapeConfig {
  id: string;
  FrameComponent?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  aspectRatioString?: string;
  clipPathNode?: React.ReactNode;
}

export const SHAPE_CONFIGS: Record<string, ShapeConfig> = {
  mirror: {
    id: 'mirror',
    FrameComponent: MirrorSvg,
    aspectRatioString: '385/731',
    clipPathNode: <path d="M0.117865 0.920218C0.080553 0.712070 0.026249 0.699428 0.117865 0.089501C0.415132 0.055820 0.578629 0.055968 0.865732 0.089501C0.959566 0.442252 0.956774 0.623294 0.865732 0.920218C0.568805 0.941471 0.404494 0.943878 0.117865 0.920218Z" />,
  },
  hexagon: {
    id: 'hexagon',
    FrameComponent: HexagonSvg,
    aspectRatioString: '400/400',
    clipPathNode: <path d="M 0.5 0.025 L 0.933 0.275 L 0.933 0.725 L 0.5 0.975 L 0.067 0.725 L 0.067 0.275 Z" />
  },
  petal: {
    id: 'petal',
    FrameComponent: PetalSvg,
    aspectRatioString: '400/400',
    clipPathNode: <path d="M 0.5 0.95 C 0.25 0.75 0.05 0.45 0.2 0.2 C 0.25 0.1 0.425 0.1 0.5 0.25 C 0.575 0.1 0.75 0.1 0.8 0.2 C 0.95 0.45 0.75 0.75 0.5 0.95 Z" />
  },
  rectangle: {
    id: 'rectangle',
    FrameComponent: RectangleSvg,
    aspectRatioString: '300/500',
    clipPathNode: <rect x="0.05" y = "0.03" width="0.9" height="0.94" rx="0.1" ry="0.06" />
  },
  none: {
    id: 'none',
  }
};
