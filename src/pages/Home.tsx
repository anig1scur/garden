import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import ShapeSVG from '@assets/shape1.svg?raw';
import { Rnd } from 'react-rnd';
import { useParams, useNavigate } from 'react-router-dom';
import { COLOR, RADIUS } from '@/common/const';
import { BoxItem, BoxProps, SvgInfo, PosProps } from '@/common/types';
import Sidebar from '@/components/sidebar';
import TextFit from '@/components/textfit';
import { data } from '@/common/mock';
import { ModeProvider, useModeContext } from '@/common/context';
import { motion, Variants } from 'framer-motion';
const randomColor = () => {
  return COLOR[Math.floor(Math.random() * COLOR.length)];
}

const randomRadius = () => {
  return RADIUS[Math.floor(Math.random() * RADIUS.length)];
}

const Rect: React.FC<BoxProps> = ({ text, bgColor, color, width = 100, height = 100, className }) => {

  return (
    <TextFit className={ `p-3 font-semibold font-mono ${ className }` } style={ {
      width: width,
      height: height,
      backgroundColor: bgColor,
      color: color,
    } }
      width={ width }
      height={ height }
    >
      { text }
    </TextFit>
  );
}

interface ContainerSize {
  width: number;
  height: number;
}

const Curve: React.FC<BoxProps> = ({
  text,
  bgColor,
  color,
  className,
  height = 100,
  width = 100,
}) => {
  const minFontSize = 12;
  const maxFontSize = 48;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width, height });
  const [svgInfo, setSvgInfo] = useState<SvgInfo>({
    pathD: '',
    width: width,
    height: height,
    viewBox: '0 0 100 100'
  });

  const extractInfo = (svgString: string): SvgInfo => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const pathElement = svgDoc.querySelector('path');
    const pathD = pathElement?.getAttribute('d') || '';
    const width = parseInt(svgDoc.documentElement.getAttribute('width') || '100');
    const height = parseInt(svgDoc.documentElement.getAttribute('height') || '100');
    const viewBox = svgDoc.documentElement.getAttribute('viewBox') || '0 0 100 100';
    return { pathD, width, height, viewBox };
  };

  const calculateFontSize = (containerWidth: number, containerHeight: number, textLength: number): number => {
    // 估算路径长度（这里使用容器对角线长度作为近似值）
    const pathLength = Math.sqrt(containerWidth * containerWidth + containerHeight * containerHeight);

    // 计算每个字符可用的空间
    const spacePerChar = pathLength / textLength;

    let fontSize = spacePerChar * (textLength / 6);

    // 限制字体大小在指定范围内
    fontSize = Math.max(minFontSize, Math.min(fontSize, maxFontSize));

    return fontSize;
  };

  useEffect(() => {
    const { pathD, width, height, viewBox } = extractInfo(ShapeSVG);
    setSvgInfo({ pathD, width, height, viewBox });
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!svgInfo.pathD) {
    return <div>Loading...</div>;
  }

  const { pathD, viewBox } = svgInfo;
  const fontSize = calculateFontSize(containerSize.width, containerSize.height, text.length);
  const textTranslate = text.length < 6 ? 'translate-y-3' : 'translate-y-2'
  return (
    <div ref={ containerRef } style={ { width, height } }>
      <svg width="100%" height="100%" viewBox={ viewBox } preserveAspectRatio="xMidYMid meet">
        <path
          d={ pathD }
          stroke={ bgColor }
          strokeWidth={ 36 }
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <path id="textPath" d={ pathD } />
        </defs>
        <text className={ `${ textTranslate } text-zinc-400` }>
          <textPath
            href="#textPath"
            className="font-bold"
            fill={ color }
            startOffset="50%"
            textAnchor="middle"
            style={ {
              fontSize: `${ fontSize }px`,
              letterSpacing: `${ fontSize * 0.05 }px`
            } }
          >
            { text }
          </textPath>
        </text>
      </svg>
    </div>
  );
};

const Garden: React.FC = () => {
  const containerWidth = screen.availWidth * 0.8;
  const containerHeight = screen.availHeight * 0.8;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  const { mode } = useModeContext();
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);

  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const [gardenId, setGardenId] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchGarden(id);
    } else {
      initBoxes();
    }
  }, [id]);

  const fetchGarden = async (id: string) => {
    console.log('fetching garden:', id);
    try {
      const response = await axios.get<{ boxes: BoxItem[] }>(`https://api.piggy.lol/gardens/${ id }`);
      setBoxes(response.data.boxes);
      setGardenId(id);
    } catch (error) {
      console.error('Failed to fetch garden:', error);
    }
  };

  const saveGarden = async () => {
    try {
      if (gardenId) {
        await axios.put(`https://api.piggy.lol/gardens/${ gardenId }`, { boxes });
      } else {
        const response = await axios.post<{ id: string }>('https://api.piggy.lol/gardens', { boxes });
        setGardenId(response.data.id);
        navigate(`/${ response.data.id }`);
      }
    } catch (error) {
      console.error('Failed to save garden:', error);
    }
  };

  const isOverlapping = (newPos: BoxItem, existingPositions: BoxItem[]): boolean => {
    return existingPositions.some(pos =>
      newPos.x < pos.x + pos.width &&
      newPos.x + newPos.width > pos.x &&
      newPos.y < pos.y + pos.height &&
      newPos.y + newPos.height > pos.y
    );
  };

  const handleBoxChange = (index: number, newPosition: PosProps) => {
    setBoxes(prevBoxes =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, ...newPosition } : box
      )
    );
  };

  const generateSpiralBox = (attempts: number, index: number, baseSize: number): BoxItem => {
    const angle = attempts * 0.5;
    const radius = baseSize * Math.sqrt(attempts);
    const x = centerX + radius * Math.cos(angle) - baseSize / 2;
    const y = centerY + radius * Math.sin(angle) - baseSize / 2;
    const size = baseSize * (1 - attempts * 0.001);
    const text = data[index].key.cn;
    const desc = data[index].desc.cn;
    const href = data[index].href || '';
    const bgColor = randomColor();
    const borderRadius = randomRadius();
    const color = 'black';

    return {
      x,
      y,
      width: size,
      height: size,
      text,
      href,
      bgColor,
      color,
      desc,
      className: borderRadius,
    };
  };


  const initBoxes = React.useCallback(() => {

    const newBoxes: BoxItem[] = [];
    const numBoxes = data.length;
    const baseSize = 90;
    let index = 0;

    for (let i = 0;index < numBoxes;i++) {
      let newBox: BoxItem;
      let attempts = 0;
      const maxAttempts = 100;

      do {
        newBox = generateSpiralBox(attempts, index, baseSize);
        attempts++;
      } while (isOverlapping(newBox, newBoxes) && attempts < maxAttempts);

      if (attempts < maxAttempts) {
        newBoxes.push(newBox);
        index += 1;
      } else {
        console.log(`Couldn't place box ${ i } after ${ maxAttempts } attempts`);
      }
    }

    setBoxes(newBoxes);
  }, []);



  const handleNewBoxCreate = (newBox: Omit<BoxItem, 'x' | 'y' | 'width' | 'height'>) => {
    const baseSize = 90;
    const newPosition = generateSpiralBox(boxes.length, data.length + 1, baseSize);
    setBoxes(prevBoxes => [...prevBoxes, { ...newPosition, ...newBox }]);
  };

  const boxVariants: Variants = {

    hover: {
      scale: 1.5,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
      },
      zIndex: 999,
    }
  }

  const variants: Variants = {
    rest: {
      display: "none",
      opacity: 0,
    },
    hover: {
      display: "block",
      opacity: 1,
    }
  }

  return (
    <div className='flex justify-center p-10'>
      <Sidebar
        selectedBox={ selectedBoxIndex !== null ? boxes[selectedBoxIndex] : null }
        onBoxChange={ (updatedBox) => {
          if (selectedBoxIndex !== null) {
            handleBoxChange(selectedBoxIndex, updatedBox);
          }
        } }
        onNewBoxCreate={ handleNewBoxCreate }
      />
      <div className='bg-pink-500 text-white w-36 text-center rounded-sm h-fit p-1' onClick={ saveGarden }>Save Garden</div>

      <div className='relative w-full h-svh mt-10'>
        <div className='absolute top-0 left-0 w-full h-full opacity-80' />
        { boxes.map((box, index) => {
          const BoxComponent = index % 2 === 0 ? Curve : Rect;
          return (
            mode === 'edit' ? (
              <Rnd
                key={ index }
                default={ {
                  x: box.x,
                  y: box.y,
                  width: box.width,
                  height: box.height,
                } }
                className='border-dashed border-[1px] border-white'
                onDragStop={ (e, d) => {
                  handleBoxChange(index, { ...box, x: d.x, y: d.y });
                } }
                onResize={ (e, direction, ref, delta, position) => {
                  handleBoxChange(index, {
                    x: position.x,
                    y: position.y,
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  });
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
                <BoxComponent
                  { ...box }
                />
              </Rnd>) : (
              <motion.div initial="rest" whileHover={ "hover" } animate="rest" variants={ boxVariants } style={ { position: 'absolute', left: box.x, top: box.y } }>
                <BoxComponent

                  { ...box }
                />
                <motion.div
                  className='absolute backdrop-blur-sm top-[100%] right-0 p-3 bg-white bg-opacity-50'
                  variants={ variants }
                >
                  { box.desc }
                </motion.div>
              </motion.div>
            )
          );
        }) }
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ModeProvider>
      <Garden />
    </ModeProvider>
  );
};

export default App;
