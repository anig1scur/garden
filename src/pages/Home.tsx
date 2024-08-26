import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BoxItem } from '@/common/types';
import { useModeContext } from '@/common/context';
import Sidebar from '@/components/Sidebar';
import BoxContainer from '@/components/BoxContainer';
import { initBoxes, handleBoxChange, handleNewBoxCreate } from '@/utils/boxesUtils';
import { fetchGarden, saveGarden } from '@/utils/apiUtils';

const Garden: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gardenId, setGardenId] = useState<string | null>(null);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const { mode } = useModeContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchGarden(id, setBoxes, setGardenId);
    } else {
      initBoxes(setBoxes);
    }
  }, [id]);

  const deleteBox = (index: number) => {
    setBoxes(prevBoxes => prevBoxes.filter((_, i) => i !== index));
    setSelectedBoxIndex(null);
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && selectedBoxIndex !== null && [containerRef.current, document.body].includes(e.target as HTMLElement)) {
        deleteBox(selectedBoxIndex);
      }

      else if ((e.key === 'ArrowUp' || e.key === '[') && selectedBoxIndex !== null) {

        const box = boxes[selectedBoxIndex];
        const newBoxes = boxes.filter((_, i) => i !== selectedBoxIndex);
        setBoxes([...newBoxes, box]);

      }

      else if ((e.key === 'ArrowDown' || e.key === ']') && selectedBoxIndex !== null) {

        const box = boxes[selectedBoxIndex];
        const newBoxes = boxes.filter((_, i) => i !== selectedBoxIndex);
        setBoxes([box, ...newBoxes]);
      }

    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [selectedBoxIndex]);

  const handleSaveGarden = async () => {
    const newId = await saveGarden(gardenId, boxes);
    if (newId && !gardenId) {
      setGardenId(newId);
      navigate(`/${ newId }`);
    }
  };

  return (
    <div className='max-h-screen cursor-ins overflow-auto justify-center' onClick={ () => {
      setSelectedBoxIndex(-1)
    }
    }>
      <Sidebar
        onSaveGarden={ handleSaveGarden }
        onNewBoxCreate={ (newBox) => handleNewBoxCreate(boxes, setBoxes, newBox) }
      />
      <BoxContainer
        boxes={ boxes }
        mode={ mode }
        containerRef={ containerRef }
        selectedBoxIdx={ selectedBoxIndex }
        onDeleteBox={ deleteBox }
        onNewBoxCreate={ (newBox) => handleNewBoxCreate(boxes, setBoxes, newBox) }
        onBoxChange={ (index, newPosition) => handleBoxChange(setBoxes, index, newPosition) }
        setSelectedBoxIndex={ setSelectedBoxIndex }
      />
    </div>
  );
};

export default Garden;
