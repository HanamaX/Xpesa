// filepath: /D:/hci 15/context/VoiceContext.js
import React, { createContext, useState } from 'react';

export const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <VoiceContext.Provider value={{ voiceEnabled, setVoiceEnabled }}>
      {children}
    </VoiceContext.Provider>
  );
};