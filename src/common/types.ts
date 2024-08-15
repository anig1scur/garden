
export type SvgInfo = {
  pathD: string | undefined;
  width: number;
  height: number;
  viewBox: string | undefined;
};

export type BoxProps = {
  text: string;
  bgColor?: string;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
};

export type PosProps = {
  x: number;
  y: number;
  width: number;
  height: number;
}


export type BoxItem = PosProps & {
  text: string;
  bgColor: string;
  color: string;
  href?: string;
  desc?: string;
  className?: string;
};
