import { BoxItem } from '@/common/types';
import { data } from '@/common/mock';
import { randomColor, randomRadius } from '@/utils/randomUtils';

export const BASE_SIZE = 120;
const containerWidth = screen.availWidth;
const containerHeight = screen.availHeight;
const centerX = containerWidth / 2;
const centerY = containerHeight / 2;

export const initBoxes = (setBoxes: React.Dispatch<React.SetStateAction<BoxItem[]>>) => {
  const newBoxes: BoxItem[] = [];
  const numBoxes = data.length;
  const baseSize = BASE_SIZE;

  for (let i = 0;i < numBoxes;i++) {
    let newBox: BoxItem;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      newBox = generateSpiralBox(attempts, i, baseSize);
      attempts++;
    } while (isOverlapping(newBox, newBoxes) && attempts < maxAttempts);

    if (attempts < maxAttempts) {
      newBoxes.push(newBox);
    } else {
      newBoxes.push(newBox)
      console.error(`Couldn't place box ${ i } after ${ maxAttempts } attempts`);
    }
  }

  setBoxes(newBoxes);
};

export const handleBoxChange = (
  setBoxes: React.Dispatch<React.SetStateAction<BoxItem[]>>,
  index: number,
  newPosition: Partial<BoxItem>
) => {
  setBoxes(prevBoxes =>
    prevBoxes.map((box, i) =>
      i === index ? { ...box, ...newPosition } : box
    )
  );
};

export const handleNewBoxCreate = (
  boxes: BoxItem[],
  setBoxes: React.Dispatch<React.SetStateAction<BoxItem[]>>,
  newBox: Omit<BoxItem, 'x' | 'y' | 'width' | 'height' | 'type'>
) => {
  const newPosition = generateSpiralBox(boxes.length + 3, boxes.length + 1, BASE_SIZE);
  setBoxes(prevBoxes => [...prevBoxes, { ...newPosition, ...newBox }]);
};

const generateSpiralBox = (attempts: number, index: number, baseSize: number): BoxItem => {
  const angle = attempts * 0.5;
  const radius = baseSize * Math.sqrt(attempts);
  const x = centerX + (radius * Math.cos(angle) - baseSize / 5) / 2;
  const y = centerY + (radius * Math.sin(angle) - baseSize / 5) / 2;
  const size = baseSize * (1 - attempts * 0.001);

  const box = data[index];

  const text = box?.key.en;
  const desc = box?.desc.en;
  const href = box?.href || '';
  const bgColor = randomColor();
  const borderRadius = randomRadius();
  const color = 'black';
  const type = index % 2 === 0 ? 'curve' : 'rect'

  return {
    x,
    y,
    width: size,
    height: size,
    type,
    text,
    href,
    bgColor,
    color,
    desc,
    className: borderRadius,
  };
};

const isOverlapping = (newPos: BoxItem, existingPositions: BoxItem[]): boolean => {
  return existingPositions.some(pos =>
    newPos.x < (pos.x + pos.width) &&
    newPos.x + newPos.width > pos.x &&
    newPos.y < (pos.y + pos.height) &&
    newPos.y + newPos.height > pos.y
  );
};
