
import React, { useEffect } from 'react';
import { BoxItem } from '@/common/types';

const DEFAULT_POS = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

type BoxEditorProps = {
  show: Boolean;
  selectedBox: BoxItem | null;
  onBoxChange: (updatedBox: BoxItem) => void;
};

export const BoxEditor: React.FC<BoxEditorProps> = ({ show, selectedBox, onBoxChange }) => {
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

  return (
    show && <form className='bg-slate-100 bg-opacity-50 p-3 absolute w-64 ml-2 left-full top-0' >
      <div className="mb-4">
        <label className="block text-sm font-medium text-black">Text</label>
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
    </form>
  );
}

export default BoxEditor;
