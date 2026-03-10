import React from 'react';
import { ReactComponent as MirrorSvg } from '@assets/mirror.svg';

export interface ShapeConfig {
  id: string;
  FrameComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  aspectRatioString: string;
  clipPathData: string;
}

export const SHAPE_CONFIGS: Record<string, ShapeConfig> = {
  mirror: {
    id: 'mirror',
    FrameComponent: MirrorSvg,
    aspectRatioString: '385/731',
    clipPathData: 'M0.117865 0.920218C0.080553 0.712070 0.026249 0.699428 0.117865 0.089501C0.415132 0.055820 0.578629 0.055968 0.865732 0.089501C0.959566 0.442252 0.956774 0.623294 0.865732 0.920218C0.568805 0.941471 0.404494 0.943878 0.117865 0.920218Z',
  }
  // Add new shapes here in the future
};
