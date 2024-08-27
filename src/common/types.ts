
export type SvgInfo = {
  pathD: string | undefined;
  width: number;
  height: number;
  viewBox: string | undefined;
};

export type BoxType = 'rect' | 'curve' | 'ghost' | 'smile';

export const boxTypes: BoxType[] = ['rect', 'curve', 'ghost'];

export type BoxProps = {
  text?: string;
  bgColor?: string;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  desc?: string;
  href?: string;
  direction?: 'left' | 'right' | 'top';
  pos?: 'lt' | 'rt' | 'lb' | 'rb';
  curveType?: string;
  strokeWidth?: number;
};



export type PosProps = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ContainerSize = {
  width: number;
  height: number;
}

export type BoxItem = PosProps & BoxProps & {
  type?: BoxType;
}