import { COLOR, RADIUS } from '@/common/const';

export const randomRadius = () => {
  return RADIUS[Math.floor(Math.random() * RADIUS.length)];
}

export const randomColor = () => {
  return COLOR[Math.floor(Math.random() * COLOR.length)];
}