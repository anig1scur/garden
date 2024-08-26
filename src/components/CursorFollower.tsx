import React, { useRef, useEffect, ReactNode } from 'react';

interface CursorFollowerProps {
  children: ReactNode;
  offsetX?: number;
  offsetY?: number;
}

const CursorFollower: React.FC<CursorFollowerProps> = ({
  children,
  offsetX = 0,
  offsetY = 0
}) => {
  const followerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updatePosition);
      }
    };

    const updatePosition = () => {
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${ positionRef.current.x + offsetX }px, ${ positionRef.current.y + offsetY }px)`;
      }
      rafRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [offsetX, offsetY]);

  return (
    <div
      ref={ followerRef }
      style={ {
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      } }
    >
      { children }
    </div>
  );
}

export default CursorFollower;
