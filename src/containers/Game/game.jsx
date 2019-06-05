import React, { useEffect, useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { put } from '../../util/request';
import { settingsContext } from '../../store';
import SearchUser from '../../components/searchUser/searchUser';
import PageLoader from '../../components/pageLoader';

import './game.scss';

const Game = () =>
{
  useEffect(() =>
  {
    const userId = localStorage.getItem('userId');
    put('user/changeStatus', JSON.stringify({ userId, status: true }));
  }, []);
  const [settings, setSettings] = useContext(settingsContext);

  return (
    <div className="game">
      {settings.showLoader && <PageLoader />}
      <div className="background" />
      {settings.error && (
        <Alert
          variant={settings.error.split('.')[0]}
          onClose={() => { setSettings({ ...settings, error: '' }); }}
          dismissible
        >
          {settings.error.split('.')[1]}
        </Alert>
      )}
      <div className="main">
        <div className="search-container">
          <SearchUser />
        </div>
      </div>
    </div>
  );
};

export default Game;
