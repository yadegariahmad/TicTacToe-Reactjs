import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import Store from './store';
import { put } from './util/request';

function App()
{
  window.onbeforeunload = (e) =>
  {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (userId)
    {
      put('user/changeStatus', JSON.stringify({ userId, status: false }));
    }
  };

  return (
    <Store>
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    </Store>
  );
}

export default App;
