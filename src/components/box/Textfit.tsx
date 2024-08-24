import React, { useState, useRef, useEffect, PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

interface TextFitProps {
  children: string;
  width: number;
  height: number;
  minFontSize?: number;
  maxFontSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TextFit: React.FC<PropsWithChildren<TextFitProps>> = ({
  children,
  width,
  height,
  minFontSize = 11,
  maxFontSize = 121,
  className,
  style,
}) => {
  const [fontSize, setFontSize] = useState(maxFontSize);
  const textRef = useRef<HTMLDivElement>(null);
  const fitText = () => {
    if (textRef.current) {
      const element = textRef.current;
      let low = minFontSize;
      let high = maxFontSize;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        element.style.fontSize = `${ mid }px`;

        if (Math.abs(element.scrollWidth - width) <= 2 && Math.abs(element.scrollHeight - height) <= 2) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      setFontSize(high);
    }
  };

  useEffect(() => {
    fitText();
  }, [children, width, height, minFontSize, maxFontSize]);

  setTimeout(() => {
    fitText();
  }, 0);

  return (
    <motion.div
      className={ className }
      ref={ textRef }
      style={ {
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      } }
      initial={ { fontSize: minFontSize } }
      animate={ { fontSize: `${ fontSize }px` } }
      transition={ { type: 'spring', stiffness: 300, damping: 30 } }
    >
      { children }
    </motion.div>
  );
};

export default TextFit;
