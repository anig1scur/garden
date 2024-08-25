import React, { useEffect } from 'react';
import { BoxItem } from '@/common/types';

const DEFAULT_POS = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}

const COMMON_ITEMS = ['bgColor', 'href', 'desc'] as const;
const TEXT_ITEMS = ['text', 'color'] as const;
const GHOST_ITEMS = ['direction'] as const;

type BoxEditorProps = {
  show: boolean;
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
        ...DEFAULT_POS,
        type: 'rect',
        bgColor: '#000000',
        color: '#ffffff',
        [key]: value,
      } as BoxItem);
    } else {
      const updatedBox = { ...box, [key]: value };
      setBox(updatedBox);
      onBoxChange(updatedBox);
    }
  };

  const renderFormItem = (key: string) => {
    const value = box?.[key as keyof BoxItem] || '';
    const isColor = key === 'bgColor' || key === 'color';
    const isTextArea = key === 'desc';
    const isDirection = key === 'direction';

    if (isDirection) {
      return (
        <div key={ key } className="mb-4">
          <label className="block text-sm font-medium mb-2">Direction</label>
          <div className="flex space-x-4">
            { ['left', 'right', 'top'].map((direction) => (
              <label key={ direction } className="inline-flex items-center">
                <input
                  type="radio"
                  name="direction"
                  value={ direction }
                  checked={ value ? value === direction : direction === 'left' }
                  onChange={ (e) => handleInputChange('direction', e.target.value) }
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-sm">{ direction }</span>
              </label>
            )) }
          </div>
        </div>
      );
    }

    return (
      <div key={ key } className="mb-4">
        <label className="block text-sm font-medium">{ key.charAt(0).toUpperCase() + key.slice(1) }</label>
        { isTextArea ? (
          <textarea
            name={ key }
            value={ value as string }
            onChange={ (e) => handleInputChange(key as keyof BoxItem, e.target.value) }
            className="mt-1 block w-full text-black px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm"
          />
        ) : (
          <input
            type={ isColor ? 'color' : 'text' }
            name={ key }
            value={ value as string }
            onChange={ (e) => handleInputChange(key as keyof BoxItem, e.target.value) }
            className={ `mt-1 block w-full ${ !isColor ? 'text-black px-2 py-1 text-sm' : '' } rounded-md border-gray-300 shadow-sm` }
          />
        ) }
      </div>
    );
  };

  if (!show || !box) return null;

  const itemsToRender = [
    ...(box.type === 'ghost' ? GHOST_ITEMS : TEXT_ITEMS),
    ...COMMON_ITEMS,
  ];

  return (
    <form className='bg-slate-100 bg-opacity-50 p-3 absolute w-64 ml-2 left-full top-0'>
      { itemsToRender.map(renderFormItem) }
    </form>
  );
}

export default BoxEditor;