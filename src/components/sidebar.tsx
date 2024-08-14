import React from 'react';
import { BoxItem } from '../common/types'; // 假设我们在单独的文件中定义了类型

type SidebarProps = {
  selectedBox: BoxItem | null;
  onBoxChange: (updatedBox: BoxItem) => void;
  onNewBoxCreate: (newBox: Omit<BoxItem, 'x' | 'y' | 'width' | 'height'>) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ selectedBox, onBoxChange, onNewBoxCreate }) => {

  const [box, setBox] = React.useState<BoxItem | null>(selectedBox);
  const handleInputChange = (key: keyof BoxItem, value: string) => {
    if (!box) {
      setBox({
        text: value,
        bgColor: '#000000',
        color: '#ffffff',
        href: '',
        desc: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
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

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto fixed left-10 top-10">
      <h2 className="text-xl font-bold mb-4">
        { selectedBox ? 'Edit Box' : 'Create New Box' }
      </h2>
      <form onSubmit={ handleNewBoxCreate }>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Text</label>
          <input
            type="text"
            name="text"
            value={ box?.text || '' }
            onChange={ (e) => handleInputChange('text', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Background Color</label>
          <input
            type="color"
            name="bgColor"
            value={ selectedBox?.bgColor || '#000000' }
            onChange={ (e) => handleInputChange('bgColor', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Text Color</label>
          <input
            type="color"
            name="color"
            value={ selectedBox?.color || '#ffffff' }
            onChange={ (e) => handleInputChange('color', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Link (href)</label>
          <input
            type="url"
            name="href"
            value={ selectedBox?.href || '' }
            onChange={ (e) => handleInputChange('href', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="desc"
            value={ selectedBox?.desc || '' }
            onChange={ (e) => handleInputChange('desc', e.target.value) }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
