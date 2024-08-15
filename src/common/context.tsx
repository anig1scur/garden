import React, { createContext, useContext, ReactNode } from 'react';
import { useMode } from './hooks';

type ModeContextType = {
  mode: 'edit' | 'view';
  toggleMode: () => void;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

type ModeProviderProps = {
  children: ReactNode;
};

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const modeValue = useMode();

  return (
    <ModeContext.Provider value={ modeValue } >
      { children }
    </ModeContext.Provider>
  );
};

export const useModeContext = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useModeContext must be used within a ModeProvider');
  }
  return context;
};
