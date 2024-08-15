import React, { useEffect } from 'react';
import { BoxItem } from '../common/types';
import { useModeContext } from '@/common/context';

type SidebarProps = {
  selectedBox: BoxItem | null;
  onBoxChange: (updatedBox: BoxItem) => void;
  onNewBoxCreate: (newBox: Omit<BoxItem, 'x' | 'y' | 'width' | 'height'>) => void;
};

const DEFAULT_POS = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

const Sidebar: React.FC<SidebarProps> = ({ selectedBox, onBoxChange, onNewBoxCreate }) => {

  const [box, setBox] = React.useState<BoxItem | null>(selectedBox);

  useEffect(() => {
    setBox(selectedBox);
  }, [selectedBox]);

  const handleInputChange = (key: keyof BoxItem, value: string) => {
    if (!box) {
      setBox({
        text: value,
        bgColor: '#000000',
        color: '#ffffff',
        ...DEFAULT_POS,
      });
    }
    if (box) {
      setBox({ ...box, [key]: value });
      onBoxChange({ ...box, [key]: value });
    }
  };

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
    <div className="w-64 text-white p-4 overflow-y-auto flex-grow flex-shrink-0">
      <div className='flex mt-5 gap-10 items-center'>
        <div className='text-4xl font-bold'>Garden</div>
        <button
          onClick={ toggleMode }
          className='p-2 py-1 bg-pink-500 text-white rounded-md'
        >
          { mode === 'edit' ? 'Editing' : 'Viewing' }
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4 mt-4">
        { selectedBox ? 'Edit Box' : 'Create New Box' }
      </h2>
      <form onSubmit={ handleNewBoxCreate }>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Text</label>
          <input
            type="text"
            name="text"
            value={ box?.text || '' }
            onChange={ (e) => handleInputChange('text', e.target.value) }
            className="mt-1 block w-full text-black px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Background Color</label>
          <input
            type="color"
            name="bgColor"
            value={ selectedBox?.bgColor || '#000000' }
            onChange={ (e) => handleInputChange('bgColor', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Text Color</label>
          <input
            type="color"
            name="color"
            value={ selectedBox?.color || '#ffffff' }
            onChange={ (e) => handleInputChange('color', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Link</label>
          <input
            type="url"
            name="href"
            value={ selectedBox?.href || '' }
            onChange={ (e) => handleInputChange('href', e.target.value) }
            className="mt-1 block w-full text-black px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm"


          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="desc"
            value={ selectedBox?.desc || '' }
            onChange={ (e) => handleInputChange('desc', e.target.value) }
            className="mt-1 block w-full text-black px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm"
          />
        </div>
        { !selectedBox && (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
          >
            Create New Box
          </button>
        ) }
      </form>
    </div>
  );
};

export default Sidebar;
