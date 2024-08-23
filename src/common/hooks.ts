import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type Mode = 'edit' | 'view';

export const useMode = () => {
  const [params] = useSearchParams();


  const [mode, setMode] = useState<Mode>((params.get('mode') as Mode) || 'edit')

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'edit' ? 'view' : 'edit');
  };

  return { mode, toggleMode };
};
