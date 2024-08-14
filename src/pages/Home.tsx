import React, { useRef, useEffect, useState } from 'react';
import ShapeSVG from '@assets/shape1.svg?raw';
import { Rnd } from 'react-rnd';


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


const randomColor = () => {
  const list = [
    "pink",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
  ]

  return list[Math.floor(Math.random() * list.length)];
}


const randomRadius = () => {
  const list = [
    "rounded-none",
    "rounded-md",
    "rounded-xl",
    "rounded-3xl",
    "rounded-full",
  ]
  return list[Math.floor(Math.random() * list.length)];
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



type BoxPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
}


const Garden: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxPosition[]>([]);
  const containerWidth = 1000;
  const containerHeight = 1000;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  const [texts, setTexts] = useState<string[]>([]);

  const sampleTexts = [
    "BIO",
    "VITE",
    "JOY",
    "MUSIC",
    "SLEEP",
    "REACT",
  ];

  const isOverlapping = (newPos: BoxPosition, existingPositions: BoxPosition[]): boolean => {
    return existingPositions.some(pos =>
      newPos.x < pos.x + pos.width &&
      newPos.x + newPos.width > pos.x &&
      newPos.y < pos.y + pos.height &&
      newPos.y + newPos.height > pos.y
    );
  };

  const generateSpiralPosition = (index: number, baseSize: number): BoxPosition => {
    const angle = index * 0.5
    const radius = baseSize * Math.sqrt(index);
    const x = centerX + radius * Math.cos(angle) - baseSize / 2
    const y = centerY + radius * Math.sin(angle) - baseSize / 2
    const size = baseSize * (1 - index * 0.001);
    return { x, y, width: size, height: size };
  };

  useEffect(() => {
    const newSvgs: BoxPosition[] = [];
    const numSvgs = 12;
    const baseSize = 90;

    for (let i = 0;i < numSvgs;i++) {
      let newPosition: BoxPosition;
      let attempts = 0;
      const maxAttempts = 100;

      do {
        newPosition = generateSpiralPosition(attempts, baseSize);
        attempts++;
      } while (isOverlapping(newPosition, newSvgs) && attempts < maxAttempts);

      if (attempts < maxAttempts) {
        newSvgs.push(newPosition);
      } else {
        console.log(`Couldn't place SVG ${ i } after ${ maxAttempts } attempts`);
      }
    }

    setBoxes(newSvgs);
  }, []);

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='flex mt-10 gap-10 items-center'>
        <div className='text-white text-4xl font-bold'>Garden</div>
        <textarea className='w-full h-16 p-2 rounded-xl bg-white font-semibold placeholder:text-zinc-400' placeholder='What makes you you?' onChange={ (e) => setTexts(e.target.value.split('\n').filter(
          (text) => text.length > 0 && text.length < 12
        )) } />
      </div>
      <div style={ { width: containerWidth, height: containerHeight, position: 'relative', overflow: 'hidden' } }>
        { boxes.map((box, index) => {

          const _texts = texts.length === 0 ? sampleTexts : texts;

          const text = _texts[index % _texts.length];
          const bgColor = randomColor();
          return (
            <Rnd
              default={ {
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
              } } >
              {
                index % 2 === 0 ?
                  <Curve text={ text } bgColor={ bgColor } color='white' /> :
                  <Rect text={ text } bgColor={ 'white' } color='black' />
              }
            </Rnd>
          );
        }) }
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className='bg-black'>
      <Garden />
    </div>
  );
};

export default App;
