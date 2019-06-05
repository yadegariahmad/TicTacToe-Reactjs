import React, { useEffect } from 'react';
import { put } from '../../util/request';
import SearchUser from '../../components/searchUser/searchUser';
import './game.scss';

const Game = () =>
{
  const userId = localStorage.getItem('userId');
  useEffect(() =>
  {
    put('user/changeStatus', JSON.stringify({ userId, status: true }));
  });

  return (
    <div className="game">
      <div className="background" />
      <div className="main">
        <div className="search-container">
          <SearchUser />
        </div>
      </div>
    </div>
  );
};

export default Game;
