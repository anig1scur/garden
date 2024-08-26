import React, { useEffect, useState } from 'react';
import { BoxItem } from '@/common/types';
import { COLOR } from '@/common/const';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <div
        className="w-6 h-6 border border-gray-300 cursor-pointer rounded-full overflow-hidden"
        onClick={ () => onChange('') }
      >
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-white text-xs">X</span>
        </div>
      </div>
      { COLOR.map((color) => (
        <div
          key={ color }
          className={ `w-6 h-6 cursor-pointer rounded-full ${ value === color ? 'ring-2 ring-blue-500' : '' }` }
          style={ { backgroundColor: color } }
          onClick={ () => onChange(color) }
        />
      )) }
    </div>
  );
};

const DEFAULT_POS = { x: 0, y: 0, width: 0, height: 0 };

const FORM_CONFIGS = {
  rect: ['text', 'color', 'bgColor', 'href', 'desc'],
  curve: ['text', 'color', 'bgColor', 'href', 'desc'],
  smile: ['pos', 'bgColor', 'href', 'desc'],
  ghost: ['direction', 'bgColor', 'href', 'desc'],
};

type BoxEditorProps = {
  show: boolean;
  selectedBox: BoxItem | null;
  onBoxChange: (updatedBox: BoxItem) => void;
};

export const BoxEditor: React.FC<BoxEditorProps> = ({ show, selectedBox, onBoxChange }) => {
  const [box, setBox] = useState<BoxItem | null>(selectedBox);

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

    const commonProps = {
      name: key,
      value: value as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleInputChange(key as keyof BoxItem, e.target.value),
      className: "mt-1 block w-full text-black px-2 py-1 text-sm rounded-md border-gray-300 shadow-sm"
    };

    const formItems = {
      color: <ColorInput value={ value as string } onChange={ (color) => handleInputChange(key as keyof BoxItem, color) } />,
      bgColor: <ColorInput value={ value as string } onChange={ (color) => handleInputChange(key as keyof BoxItem, color) } />,
      desc: <textarea { ...commonProps } />,
      pos: (
        <div className="flex space-x-4">
          { ['lt', 'rt', 'lb', 'rb'].map((pos) => (
            <label key={ pos } className="inline-flex items-center">
              <input
                type="radio"
                name="pos"
                value={ pos }
                checked={ value ? value === pos : pos === 'lt' }
                onChange={ (e) => handleInputChange('pos', e.target.value) }
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm">{ pos }</span>
            </label>
          )) }
        </div>
      ),
      direction: (
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
      ),
      default: <input type="text" { ...commonProps } />
    };

    return (
      <div key={ key } className="mb-4">
        <label className="block text-sm font-medium mb-2">{ key.charAt(0).toUpperCase() + key.slice(1) }</label>
        { formItems[key as keyof typeof formItems] || formItems.default }
      </div>
    );
  };

  if (!show || !box) return null;

  return (
    <form className='bg-slate-100 bg-opacity-50 p-3 absolute w-56 ml-2 left-full top-0'>
      { FORM_CONFIGS[box.type as keyof typeof FORM_CONFIGS].map(renderFormItem) }
    </form>
  );
}

export default BoxEditor;
