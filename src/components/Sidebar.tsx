import React, { useEffect } from 'react';
import { BoxItem } from '../common/types';
import { useModeContext } from '@/common/context';
import { SHAPE_CONFIGS } from '@/common/shapeConfigs';

type SidebarProps = {
  onSaveGarden: () => void;
  onNewBoxCreate: (newBox: Omit<BoxItem, 'x' | 'y' | 'width' | 'height'>) => void;
  shapeId: string;
  onShapeChange: (newShapeId: string) => void;
};


const Sidebar: React.FC<SidebarProps> = ({ onSaveGarden, onNewBoxCreate, shapeId, onShapeChange }) => {

  const [box, setBox] = React.useState<BoxItem | null>(null);

  const handleNewBoxCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newBox = {
      text: form.text.value,
      bgColor: form.bgColor.value,
      color: form.color.value,
      href: form.href.value,
      desc: form.desc.value,
    };
    onNewBoxCreate(newBox);
    form.reset();
  };
  const { mode, toggleMode } = useModeContext();

  return (
    <div className="w-64 text-white p-4 overflow-y-auto z-50 absolute flex-grow flex-shrink-0">
      <div className='flex mt-5 gap-10 flex-col items-start'>
        <div className='flex gap-3 items-center'>
          <div className='bg-logo w-8 h-8 bg-contain' />
          <div className='text-4xl font-bold text-pink-500'>Garden</div>
        </div>
        <div className='flex gap-5'>
          <button
            onClick={ toggleMode }
            className='p-2 py-1 bg-pink-500 text-white rounded-md'
          >
            { mode === 'edit' ? 'Editing' : 'Viewing' }
          </button>
          <button
            onClick={ onSaveGarden }
            className='p-2 py-1 bg-pink-500 text-white rounded-md'
          >Save</button>
        </div>
        <div className='flex mt-4 items-center gap-3  text-pink-500 '>
          <label className='font-bold text-sm uppercase tracking-widest'>Frame Shape</label>
          <select
            value={ shapeId }
            onChange={ (e) => onShapeChange(e.target.value) }
            className='bg-transparent border border-pink-500/50 rounded-md p-1 px-2 outline-none focus:border-pink-400'
          >
            { Object.keys(SHAPE_CONFIGS).map(key => (
              <option key={ key } value={ key } className="bg-zinc-800 ">
                { key.charAt(0).toUpperCase() + key.slice(1) }
              </option>
            )) }
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
