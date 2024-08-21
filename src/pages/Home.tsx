import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BoxItem } from '@/common/types';
import { useModeContext } from '@/common/context';
import Sidebar from '@/components/sidebar';
import BoxContainer from '@/components/BoxContainer';
import { initBoxes, handleBoxChange, handleNewBoxCreate } from '@/utils/boxesUtils';
import { fetchGarden, saveGarden } from '@/utils/apiUtils';

const Garden: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxItem[]>([]);
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

  const handleSaveGarden = async () => {
    const newId = await saveGarden(gardenId, boxes);
    if (newId && !gardenId) {
      setGardenId(newId);
      navigate(`/${ newId }`);
    }
  };

  return (
    <div className='flex justify-center p-10 bg-noise'>
      <Sidebar
        selectedBox={ selectedBoxIndex !== null ? boxes[selectedBoxIndex] : null }
        onBoxChange={ (updatedBox) => {
          if (selectedBoxIndex !== null) {
            handleBoxChange(setBoxes, selectedBoxIndex, updatedBox);
          }
        } }
        onNewBoxCreate={ (newBox) => handleNewBoxCreate(boxes, setBoxes, newBox) }
      />
      <div className='bg-pink-500 text-white w-36 text-center rounded-sm h-fit p-1' onClick={ handleSaveGarden }>
        Save Garden
      </div>
      <BoxContainer
        boxes={ boxes }
        mode={ mode }
        onBoxChange={ (index, newPosition) => handleBoxChange(setBoxes, index, newPosition) }
        setSelectedBoxIndex={ setSelectedBoxIndex }
      />
    </div>
  );
};

export default Garden;
