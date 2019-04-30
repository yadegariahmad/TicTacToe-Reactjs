import React from 'react';
import SearchUser from '../../components/searchUser/searchUser';
import './game.scss';

const Game = () => (
  <div className="game">
    <div className="background" />
    <div className="main">
      <div className="search-container">
        <SearchUser />
      </div>
    </div>
  </div>
);

export default Game;
