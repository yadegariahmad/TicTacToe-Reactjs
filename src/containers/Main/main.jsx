import React, { useState, useEffect, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import { put, post, socket } from '../../util/request';
import { settingsContext, gameContext } from '../../store';
import SearchUser from '../../components/searchUser/searchUser';
import Game from '../../components/game/game';
import PageLoader from '../../components/pageLoader';

import './main.scss';

const Main = () =>
{
  const [request, setRequest] = useState({ player: '', answer: null });
  const [settings, setSettings] = useContext(settingsContext);
  const [game, setGame] = useContext(gameContext);

  const respondGameRequest = (answer) =>
  {
    setSettings({ ...settings, showLoader: true });
    setRequest({ ...request, player: '' });

    const body = {
      playerId: localStorage.getItem('TTTuserId'),
      opponentUserName: request.player,
      answer,
    };
    post('game/respondRequest', JSON.stringify(body))
      .then((res) =>
      {
        setSettings({ ...settings, showLoader: false });

        // if answer == false => status == 210
        if (res.status === 200)
        {
          setGame({
            gameId: res.content.gameId,
            opponentId: res.content.opponentId,
            turn: res.content.opponentId,
            type: 'O',
          });
        }
      })
      .catch(() =>
      {
        setSettings({ showLoader: false, message: 'Something went wrong.' });
      });
  };

  useEffect(() =>
  {
    const userId = localStorage.getItem('TTTuserId');
    put('user/changeStatus', JSON.stringify({ userId, status: true }));

    socket.on(`gameRequest-${userId}`, (data) =>
    {
      if (!game)
      {
        setRequest({ ...request, player: data.starter });
      }
    });
  }, []);

  const handleClose = () =>
  {
    setSettings({ ...settings, message: '' });
  };

  return (
    <div className="main-container">
      {settings.showLoader && <PageLoader />}
      <div className="background" />

      <Dialog
        open={settings.message.length > 0}
        onClose={handleClose}
      >
        <DialogTitle>
          {settings.message}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={request.player.length > 0}
        onClose={() => respondGameRequest(false)}
      >
        <DialogTitle>
          {`${request.player} wants to play with you.`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => respondGameRequest(true)} color="primary">
            OK
          </Button>
          <Button onClick={() => respondGameRequest(false)} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>

      <div className="main">
        {!game && (
          <div className="search-container">
            <SearchUser />
          </div>
        )}
        <div className="game-container">
          {game && <Game />}
        </div>
      </div>
    </div>
  );
};

export default Main;
