import { useState } from 'react';

type Mode = 'edit' | 'view';

export const useMode = (initialMode: Mode = 'edit') => {
  const [mode, setMode] = useState<Mode>(initialMode);

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'edit' ? 'view' : 'edit');
  };

  return { mode, toggleMode };
};
