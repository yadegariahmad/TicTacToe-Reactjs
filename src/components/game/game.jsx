/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useContext, useEffect } from 'react';
import { post, socket } from '../../util/request';
import { changeArrayTypeToNumber } from '../../util/misc';
import { gameContext, settingsContext } from '../../store';
import './game.scss';

const Game = () =>
{
  const xoInitial = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const [xo, setXO] = useState(xoInitial);
  const [game, setGame] = useContext(gameContext);
  const [settings, setSettings] = useContext(settingsContext);

  useEffect(() =>
  {
    const userId = localStorage.getItem('userId');
    socket.on(`changeTurn-${userId}`, (data) =>
    {
      const arrayHomes = changeArrayTypeToNumber(data.squareNumber.split('.'));
      const opponentType = game.type === 'X' ? 'O' : 'X';
      setGame({ ...game, turn: userId });
      setXO([...xo, xo[arrayHomes[0]][arrayHomes[1]] = opponentType]);
    });

    socket.on(`finish-${userId}`, (data) =>
    {
      const arrayHomes = changeArrayTypeToNumber(data.squareNumber.split('.'));
      const opponentType = game.type === 'X' ? 'O' : 'X';
      setXO([...xo, xo[arrayHomes[0]][arrayHomes[1]] = opponentType]);

      if (data.draw)
      {
        setSettings({ ...settings, message: 'No winner' });
      } else
      {
        const { winner } = data;
        setSettings({ ...settings, message: `${winner} won` });
      }

      setGame(null);
    });
  }, []);

  const checkUserWinning = (squareNumberArray) =>
  {
    const first = squareNumberArray[0];
    const second = squareNumberArray[1];
    const selected = xo[first][second];
    let retVal = false;

    switch (squareNumberArray.join('.'))
    {
      case '0.0':
        if (
          ((selected === xo[0][1]) && (selected === xo[0][2]))
          || ((selected === xo[1][0]) && (selected === xo[2][0]))
          || ((selected === xo[1][1]) && (selected === xo[2][2]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '0.1':
        if (
          ((selected === xo[0][0]) && (selected === xo[0][2]))
          || ((selected === xo[1][1]) && (selected === xo[2][1]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '0.2':
        if (
          ((selected === xo[0][1]) && (selected === xo[0][0]))
          || ((selected === xo[1][2]) && (selected === xo[2][2]))
          || ((selected === xo[1][1]) && (selected === xo[2][0]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '1.0':
        if (
          ((selected === xo[0][0]) && (selected === xo[2][0]))
          || ((selected === xo[1][1]) && (selected === xo[1][2]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '1.1':
        if (
          ((selected === xo[1][0]) && (selected === xo[1][2]))
          || ((selected === xo[0][1]) && (selected === xo[2][1]))
          || ((selected === xo[0][2]) && (selected === xo[2][0]))
          || ((selected === xo[0][0]) && (selected === xo[2][2]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '1.2':
        if (
          ((selected === xo[0][2]) && (selected === xo[2][2]))
          || ((selected === xo[1][1]) && (selected === xo[1][0]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '2.0':
        if (
          ((selected === xo[2][1]) && (selected === xo[2][2]))
          || ((selected === xo[1][0]) && (selected === xo[0][0]))
          || ((selected === xo[1][1]) && (selected === xo[0][2]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '2.1':
        if (
          ((selected === xo[2][0]) && (selected === xo[2][2]))
          || ((selected === xo[1][1]) && (selected === xo[0][1]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      case '2.2':
        if (
          ((selected === xo[2][1]) && (selected === xo[2][0]))
          || ((selected === xo[1][2]) && (selected === xo[0][2]))
          || ((selected === xo[1][1]) && (selected === xo[0][0]))
        )
        {
          retVal = true;
        } else
        {
          retVal = false;
        }
        break;

      default:
        break;
    }

    return retVal;
  };

  const checkDraw = () =>
  {
    let draw = true;

    // check if all squares are marked
    for (let i = 0; i < xo.length; i += 1)
    {
      if (draw)
      {
        for (let j = 0; j < xo[i].length; j += 1)
        {
          if (xo[i][j] === null)
          {
            draw = false;
            break;
          }
        }
      } else
      {
        break;
      }
    }

    return draw;
  };

  const selectSquare = (squareNumber) =>
  {
    const { type } = game;
    const arrayHomes = changeArrayTypeToNumber(squareNumber.split('.'));

    if (xo[arrayHomes[0]][arrayHomes[1]])
    {
      setSettings({ ...settings, message: 'Select an empty square' });
    } else if (game.turn === localStorage.getItem('userId'))
    {
      setXO([...xo, xo[arrayHomes[0]][arrayHomes[1]] = type]);

      if (checkUserWinning(arrayHomes))
      {
        setSettings({ ...settings, showLoader: true });
        const body = {
          gameId: game.gameId,
          playerId: localStorage.getItem('userId'),
          squareNumber,
          draw: false,
        };

        post('game/finish', JSON.stringify(body))
          .then(() =>
          {
            setSettings({ showLoader: false, message: 'You won' });
            setGame(null);
          });
      } else if (checkDraw())
      {
        setSettings({ ...settings, showLoader: true });
        const body = {
          gameId: game.gameId,
          playerId: localStorage.getItem('userId'),
          squareNumber,
          draw: true,
        };

        post('game/finish', JSON.stringify(body))
          .then(() =>
          {
            setSettings({ showLoader: false, message: 'No winner' });
            setGame(null);
          });
      } else
      {
        setSettings({ ...settings, showLoader: true });
        const body = {
          gameId: game.gameId,
          playerId: localStorage.getItem('userId'),
          squareNumber,
        };

        post('game/changeTurn', JSON.stringify(body))
          .then(() =>
          {
            setSettings({ ...settings, showLoader: false });
            setGame({ ...game, turn: game.opponentId });
          });
      }
    } else
    {
      setSettings({ ...settings, message: 'Not your turn' });
    }
  };

  return (
    <div className="game">
      <div className="grid-container">
        <div id="grid-item" onClick={() => { selectSquare('0.0'); }}>{xo[0][0]}</div>
        <div id="grid-item" onClick={() => { selectSquare('0.1'); }}>{xo[0][1]}</div>
        <div id="grid-item" onClick={() => { selectSquare('0.2'); }}>{xo[0][2]}</div>
        <div id="grid-item" onClick={() => { selectSquare('1.0'); }}>{xo[1][0]}</div>
        <div id="grid-item" onClick={() => { selectSquare('1.1'); }}>{xo[1][1]}</div>
        <div id="grid-item" onClick={() => { selectSquare('1.2'); }}>{xo[1][2]}</div>
        <div id="grid-item" onClick={() => { selectSquare('2.0'); }}>{xo[2][0]}</div>
        <div id="grid-item" onClick={() => { selectSquare('2.1'); }}>{xo[2][1]}</div>
        <div id="grid-item" onClick={() => { selectSquare('2.2'); }}>{xo[2][2]}</div>
      </div>
    </div>
  );
};

export default Game;
