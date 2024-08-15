import React, { useRef, useEffect, useState } from 'react';
import ShapeSVG from '@assets/shape1.svg?raw';
import { Rnd } from 'react-rnd';
import { SAMPLE_TEXT, COLOR, RADIUS } from '@/common/const';
import { useMode } from '@/common/hooks';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { BoxItem, BoxProps, SvgInfo } from '@/common/types';
import Sidebar from '@/components/sidebar';

const randomColor = () => {
  return COLOR[Math.floor(Math.random() * COLOR.length)];
}

const randomRadius = () => {
  return RADIUS[Math.floor(Math.random() * RADIUS.length)];
}

const Rect: React.FC<BoxProps> = ({ text, bgColor, color }) => {

  return (
    <div
      style={ { backgroundColor: bgColor, color: color } }
      className={ `p-3 font-semibold font-mono text-2xl flex justify-center items-center ${ randomRadius() }` }
    >
      { text }
    </div>
  );
}

const Circle: React.FC<BoxProps> = ({ text, bgColor, color }) => {

  return (
    <div
      style={ { backgroundColor: bgColor, color: color } }
      className={ `p-3 font-semibold font-mono text-2xl flex justify-center items-center ${ randomRadius() }` }
    >
      { text }
    </div>
  );
}


const Curve: React.FC<BoxProps> = ({ text, bgColor, color }) => {

  const textRef = useRef(null);

  const [svgInfo, setSvgInfo] = useState<SvgInfo>({
    pathD: undefined,
    width: 0,
    height: 0,
    viewBox: undefined
  });

  const extractInfo = (svgString: string) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const pathElement = svgDoc.querySelector('path');
    const pathD = pathElement?.getAttribute('d') || '';
    const width = parseInt(svgDoc.documentElement.getAttribute('width') || '100');
    const height = parseInt(svgDoc.documentElement.getAttribute('height') || '100');
    const viewBox = svgDoc.documentElement.getAttribute('viewBox') || '0 0 100 100';
    return { pathD, width, height, viewBox };
  };


  const calculateFontSizeByWidthAndTextLength = (width: number, textLength: number) => {
    const averageLetterWidth = width / textLength;
    return averageLetterWidth;
  }


  useEffect(() => {
    const { pathD, width, height, viewBox } = extractInfo(ShapeSVG);
    setSvgInfo({ pathD, width, height, viewBox });
  }, []);

  if (!svgInfo) {
    return <div>Loading...</div>;
  }


  const { pathD, width, height, viewBox } = svgInfo;
  const fontSize = calculateFontSizeByWidthAndTextLength(width, text.length);

  return (
    <svg width={ width } height={ height } viewBox={ viewBox }>
      <path
        d={ pathD }
        stroke={ bgColor }
        strokeWidth={ 36 }
        strokeLinecap="round"
      />
      <defs>
        <path id="textPath" d={ pathD } />
      </defs>
      <text className='translate-y-3 text-zinc-400' >
        <textPath href="#textPath" className="font-bold" fill={ color } style={ {
          fontSize: `${ fontSize }px`,
          letterSpacing: `${ fontSize * 0.2 }px`
        } } ref={ textRef }>
          { text }
        </textPath>
      </text>
    </svg>
  );
};




const Garden: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const containerWidth = 1000;
  const containerHeight = 1000;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  const [texts, setTexts] = useState<string[]>([]);
  const { mode, toggleMode } = useMode();
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);

  const isOverlapping = (newPos: BoxItem, existingPositions: BoxItem[]): boolean => {
    return existingPositions.some(pos =>
      newPos.x < pos.x + pos.width &&
      newPos.x + newPos.width > pos.x &&
      newPos.y < pos.y + pos.height &&
      newPos.y + newPos.height > pos.y
    );
  };

  const handleBoxChange = (index: number, newPosition: { x: number; y: number; width: number; height: number }) => {
    setBoxes(prevBoxes =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, ...newPosition } : box
      )
    );
  };
  const generateSpiralBox = (index: number, baseSize: number): BoxItem => {
    const angle = index * 0.5;
    const radius = baseSize * Math.sqrt(index);
    const x = centerX + radius * Math.cos(angle) - baseSize / 2;
    const y = centerY + radius * Math.sin(angle) - baseSize / 2;
    const size = baseSize * (1 - index * 0.001);
    const _texts = texts.length === 0 ? SAMPLE_TEXT : texts;
    const text = _texts[index % _texts.length];
    const bgColor = randomColor();
    const color = 'white';

    return {
      x,
      y,
      width: size,
      height: size,
      text,
      bgColor,
      color,
    };
  };

  useEffect(() => {
    const newBoxes: BoxItem[] = [];
    const numBoxes = 12;
    const baseSize = 90;

    for (let i = 0;i < numBoxes;i++) {
      let newBox: BoxItem;
      let attempts = 0;
      const maxAttempts = 100;

      do {
        newBox = generateSpiralBox(attempts, baseSize);
        attempts++;
      } while (isOverlapping(newBox, newBoxes) && attempts < maxAttempts);

      if (attempts < maxAttempts) {
        newBoxes.push(newBox);
      } else {
        console.log(`Couldn't place box ${ i } after ${ maxAttempts } attempts`);
      }
    }

    setBoxes(newBoxes);
  }, [texts]);


  useEffect(() => {
    const newSvgs: BoxItem[] = [];
    const numSvgs = 12;
    const baseSize = 90;

    for (let i = 0;i < numSvgs;i++) {
      let newBox: BoxItem;
      let attempts = 0;
      const maxAttempts = 100;

      do {
        newBox = generateSpiralBox(attempts, baseSize);
        attempts++;
      } while (isOverlapping(newBox, newSvgs) && attempts < maxAttempts);

      if (attempts < maxAttempts) {
        newSvgs.push(newBox);
      } else {
        console.log(`Couldn't place SVG ${ i } after ${ maxAttempts } attempts`);
      }
    }

    setBoxes(newSvgs);
  }, []);

  const handleNewBoxCreate = (newBox: Omit<BoxItem, 'x' | 'y' | 'width' | 'height'>) => {
    const baseSize = 90;
    const newPosition = generateSpiralBox(boxes.length, baseSize);
    setBoxes(prevBoxes => [...prevBoxes, { ...newPosition, ...newBox }]);
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <Sidebar
        selectedBox={ selectedBoxIndex !== null ? boxes[selectedBoxIndex] : null }
        onBoxChange={ (updatedBox) => {
          if (selectedBoxIndex !== null) {
            handleBoxChange(selectedBoxIndex, updatedBox);
          }
        } }
        onNewBoxCreate={ handleNewBoxCreate }
      />
      <div className='flex mt-10 gap-10 items-center'>
        <div className='text-white text-4xl font-bold'>Garden</div>
        <button
          onClick={ toggleMode }
          className='px-4 py-2 bg-blue-500 text-white rounded-md'
        >
          { mode === 'edit' ? 'Editing' : 'Viewing' }
        </button>
      </div>
      <div
        onClick={ () => setSelectedBoxIndex(null) }
        style={ { width: containerWidth, height: containerHeight, position: 'relative', overflow: 'hidden' } }>
        { boxes.map((box, index) => {
          const BoxComponent = index % 2 === 0 ? Curve : Rect;
          return (
            <Popover key={ index } >
              <Rnd
                default={ {
                  x: box.x,
                  y: box.y,
                  width: box.width,
                  height: box.height,
                } }
                disableDragging={ mode === 'view' }
                enableResizing={ mode === 'edit' }
                onDragStop={ (e, d) => {
                  if (mode === 'edit') {
                    handleBoxChange(index, { ...box, x: d.x, y: d.y });
                  }
                } }
                onResizeStop={ (e, direction, ref, delta, position) => {
                  if (mode === 'edit') {
                    handleBoxChange(index, {
                      x: position.x,
                      y: position.y,
                      width: ref.offsetWidth,
                      height: ref.offsetHeight,
                    });
                  }
                } }
                onClick={ (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (mode === 'edit') {
                    setSelectedBoxIndex(index);
                  } else if (box.href) {
                    window.open(box.href, '_blank');
                  }
                } }
              >
                <PopoverButton>
                  <BoxComponent
                    text={ box.text }
                    bgColor={ box.bgColor }
                    color={ box.color }
                  />
                </PopoverButton>
              </Rnd>
              { mode === 'view' && box.desc && (

                <PopoverPanel transition anchor="bottom"
                  className="p-2 rounded-xl bg-white mt-2 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                >
                  { box.desc }
                </PopoverPanel>) }
            </Popover>
          );
        }) }
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <Garden />
  );
};

export default App;
