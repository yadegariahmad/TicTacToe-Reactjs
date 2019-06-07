import React, { useEffect, useContext } from 'react';
import { Alert } from 'react-bootstrap';
import { put, post, socket } from '../../util/request';
import { settingsContext, gameContext } from '../../store';
import SearchUser from '../../components/searchUser/searchUser';
import PageLoader from '../../components/pageLoader';

import './game.scss';

const Game = () =>
{
  const [settings, setSettings] = useContext(settingsContext);
  const [game, setGame] = useContext(gameContext);

  const recieveGameRequest = (data) =>
  {
    // eslint-disable-next-line no-restricted-globals
    const getPermission = confirm(`Player ${data.starter} wants to play with you`);
    setSettings({ ...settings, showLoader: true });

    const body = {
      playerId: localStorage.getItem('userId'),
      opponentUserName: data.starter,
      answer: getPermission,
    };
    post('game/respondRequest', JSON.stringify(body))
      .then((res) =>
      {
        setSettings({ ...settings, showLoader: false });
        if (res.status === 200)
        {
          setGame({
            gameId: res.gameId,
            opponentId: res.opponentId,
          });
        }
      })
      .catch(() =>
      {
        setSettings({ showLoader: false, message: 'danger.Something went wrong.' });
      });
  };

  useEffect(() =>
  {
    const userId = localStorage.getItem('userId');
    put('user/changeStatus', JSON.stringify({ userId, status: true }));

    socket.on(`gameRequest-${userId}`, (data) =>
    {
      console.log('aaa');

      if (!game)
      {
        recieveGameRequest(data);
      }
    });
  }, []);

  return (
    <div className="game">
      {settings.showLoader && <PageLoader />}
      <div className="background" />
      {settings.message && (
        <Alert
          variant={settings.message.split('.')[0]}
          onClose={() => { setSettings({ ...settings, error: '' }); }}
          dismissible
        >
          {settings.message.split('.')[1]}
        </Alert>
      )}
      <div className="main">
        <div className="search-container">
          {!game && <SearchUser />}
        </div>
      </div>
    </div>
  );
};

export default Game;
