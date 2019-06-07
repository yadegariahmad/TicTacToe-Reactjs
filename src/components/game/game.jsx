/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useContext, useEffect } from 'react';
import { post, socket } from '../../util/request';
import { gameContext } from '../../store';
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

  const changeArrayTypeToNumber = array => array.map(item => Number(item));

  useEffect(() =>
  {
    const userId = localStorage.getItem('userId');
    socket.on(`changeTurn-${userId}`, (data) =>
    {
      const arrayHomes = data.squareNumber.split('.');
      const opponentType = game.type === 'X' ? 'O' : 'X';
      setGame({ ...game, turn: userId });
      setXO([...xo], xo[arrayHomes[0]][arrayHomes[1]] = opponentType);
    });
  }, []);

  const selectSquare = (number) =>
  {
    const { type } = game;
    const arrayHomes = changeArrayTypeToNumber(number.split('.'));

    if (xo[arrayHomes[0]][arrayHomes[1]])
    {
      alert('Select an empty square');
    } else if (game.turn === localStorage.getItem('userId'))
    {
      setXO([...xo], xo[arrayHomes[0]][arrayHomes[1]] = type);

      const body = {
        gameId: game.gameId,
        playerId: localStorage.getItem('userId'),
        squareNumber: number,
      };
      console.log(body);
      
      post('game/changeTurn', JSON.stringify(body))
        .then(() =>
        {
          setGame({ ...game, turn: game.opponentId });
        });
    } else
    {
      alert('Not your turn');
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
