import React, { useEffect, useRef, useState } from 'react';

interface TextSphereProps {
  texts: string[];
  radius?: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Point2D {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

const TextSphere: React.FC<TextSphereProps> = ({ texts, radius = 250 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // To make the sphere look full, repeat texts if there are too few
  const minItems = 50;
  const displayTexts = [...texts];
  while (displayTexts.length > 0 && displayTexts.length < minItems) {
    displayTexts.push(...texts);
  }
  const itemsCount = displayTexts.length;

  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

  const pointsRef = useRef<Point3D[]>([]);
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Generate evenly distributed points using Fibonacci sphere
    const points: Point3D[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians

    for (let i = 0;i < itemsCount;i++) {
      const y = 1 - (i / (itemsCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({ x: x * radius, y: y * radius, z: z * radius });
    }
    pointsRef.current = points;
  }, [itemsCount, radius]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Base rotation speed
      rotationRef.current.x += 0.002;
      rotationRef.current.y += 0.001;

      const sinX = Math.sin(rotationRef.current.x);
      const cosX = Math.cos(rotationRef.current.x);
      const sinY = Math.sin(rotationRef.current.y);
      const cosY = Math.cos(rotationRef.current.y);

      const center = { x: radius, y: radius }; // Assuming container is 2x radius

      const containerRect = containerRef.current?.getBoundingClientRect();
      const mouseX = mousePos.x;
      const mouseY = mousePos.y;

      pointsRef.current.forEach((point, i) => {
        // Rotate around Y axis
        const x1 = point.x * cosY - point.z * sinY;
        const z1 = point.z * cosY + point.x * sinY;
        const y1 = point.y;

        // Rotate around X axis
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = z1 * cosX + y1 * sinX;

        // 3D to 2D projection
        // Perspective calculation
        const perspective = 300; // Field of view equivalent
        const zDepth = z2 + 2 * radius; // Move sphere forward so z > 0
        const scaleByDistance = perspective / (perspective + zDepth);

        // Base screen projection coordinates (center of container)
        const screenX = x2 * scaleByDistance + center.x;
        const screenY = y2 * scaleByDistance + center.y;

        // Depth perception (z-based)
        // Normalize Z from [-radius, radius] to [0, 1] for relative depth calculation
        const normalizedZ = (z2 + radius) / (2 * radius);

        // Items in front (z > 0) are larger and brighter
        const baseScale = 0.5 + (1 - normalizedZ) * 0.8; // Front is ~1.3, back is ~0.5
        const baseOpacity = 0.2 + (1 - normalizedZ) * 0.8; // Front is 1.0, back is 0.2
        const zIndex = Math.floor((1 - normalizedZ) * 100);

        let hoverScaleMult = 1;
        let hoverOpacityMult = 1;

        // Offset mouse by rect to match canvas space
        const localMouseX = mouseX - (containerRect?.left || 0);
        const localMouseY = mouseY - (containerRect?.top || 0);

        // Calculate distance to mouse in 2D space
        const dX = screenX - localMouseX;
        const dY = screenY - localMouseY;
        const distToMouse = Math.sqrt(dX * dX + dY * dY);

        const interactionRadius = 150; // Radius of effect

        if (distToMouse < interactionRadius && containerRect && (mouseX !== -9999)) {
          // Smooth falloff (1 at center, 0 at edge)
          const falloff = 1 - (distToMouse / interactionRadius);
          // Ease out sine
          const smoothFalloff = Math.sin(falloff * Math.PI / 2);

          hoverScaleMult = 1 + smoothFalloff * 1.5; // Up to 2.5x bigger
          hoverOpacityMult = 1 + smoothFalloff * 2; // Up to 3x opacity
        }

        const finalScale = baseScale * hoverScaleMult;
        const finalOpacity = Math.min(1, baseOpacity * hoverOpacityMult);

        const el = itemsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${ screenX }px, ${ screenY }px, 0) translate(-50%, -50%) scale(${ finalScale })`;
          el.style.opacity = finalOpacity.toString();
          el.style.zIndex = zIndex.toString();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos, radius]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -9999, y: -9999 });
  };

  if (displayTexts.length === 0) {
    return null;
  }

  return (
    <div
      ref={ containerRef }
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={ { minWidth: radius * 2, minHeight: radius * 2 } }
      onMouseMove={ handleMouseMove }
      onMouseLeave={ handleMouseLeave }
    >
      {/* 
        We rely on the absolute centering in the CSS transform `translate(-50%, -50%)`
        so we just place the elements at top-left 0,0 and translate them to their screen position.
      */}
      { displayTexts.map((text, i) => (
        <div
          key={ i }
          ref={ (el) => (itemsRef.current[i] = el) }
          className="absolute top-0 left-0 whitespace-nowrap text-pink-500 font-bold transition-colors duration-300 pointer-events-none"
          style={ {
            willChange: 'transform, opacity',
            transformOrigin: '50% 50%',
          } }
        >
          { text }
        </div>
      )) }
    </div>
  );
};

export default TextSphere;
