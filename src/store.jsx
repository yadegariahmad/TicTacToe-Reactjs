import React, { useState } from 'react';

const settingsInitial = {
  showLoader: false,
  message: '',
};

export const settingsContext = React.createContext(settingsInitial);
export const gameContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
const Store = ({ children }) =>
{
  const [settings, setSettings] = useState(settingsInitial);
  const [game, setGame] = useState(null);

  return (
    <settingsContext.Provider value={[settings, setSettings]}>
      <gameContext.Provider value={[game, setGame]}>
        {children}
      </gameContext.Provider>
    </settingsContext.Provider>
  );
};

export default Store;
