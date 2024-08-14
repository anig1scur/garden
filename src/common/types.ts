
type SvgInfo = {
  pathD: string | undefined;
  width: number;
  height: number;
  viewBox: string | undefined;
};

type BoxProps = {
  text: string;
  bgColor?: string;
  color?: string;
};


type BoxItem = {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  bgColor: string;
  color: string;
  href?: string;
  desc?: string;
};

export {
  SvgInfo,
  BoxProps,
  BoxItem
}
