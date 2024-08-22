import React from 'react';
import { BoxProps } from '@/common/types';
import TextFit from '@/components/Textfit';

const Rect: React.FC<BoxProps> = ({ text, bgColor, color, width = 100, height = 100, className }) => {
  return (
    <TextFit
      className={ `p-3 text font-semibold font-mono ${ className }` }
      style={ {
        width: width,
        height: height,
        backgroundColor: bgColor,
        color: color,
      }
      }
      width={ width }
      height={ height }
    >
      { text }
    </TextFit>
  );
};

export default Rect;
