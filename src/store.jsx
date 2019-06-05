import React, { useState } from 'react';

const settingsInitial = {
  showLoader: false,
  error: '',
};

export const settingsContext = React.createContext(settingsInitial);
export const opponentContext = React.createContext(null);

// eslint-disable-next-line react/prop-types
const Store = ({ children }) =>
{
  const [settings, setSettings] = useState(settingsInitial);
  const [opponent, setOpponent] = useState(null);

  return (
    <settingsContext.Provider value={[settings, setSettings]}>
      <opponentContext.Provider value={[opponent, setOpponent]}>
        {children}
      </opponentContext.Provider>
    </settingsContext.Provider>
  );
};

export default Store;
