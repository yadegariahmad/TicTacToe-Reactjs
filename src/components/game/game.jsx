import React, { useState, useContext } from 'react';
import { post, socket } from '../../util/request';
import { settingsContext, gameContext } from '../../store';
import './game.scss';

const Game = () =>
{
  const xoInitial = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const [xo, xoSetter] = useState(xoInitial);

  return (
    <div className="game">
      <div className="grid-container">
        <div className="grid-item">X {xo[0][0]}</div>
        <div className="grid-item">X{xo[0][1]}</div>
        <div className="grid-item">X{xo[0][2]}</div>
        <div className="grid-item">O{xo[1][0]}</div>
        <div className="grid-item">O{xo[1][1]}</div>
        <div className="grid-item">O{xo[1][2]}</div>
        <div className="grid-item">X{xo[2][0]}</div>
        <div className="grid-item">X{xo[2][1]}</div>
        <div className="grid-item">X{xo[2][2]}</div>
      </div>
    </div>
  );
};

export default Game;
