import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import { put } from './util/request';

function App()
{
  window.addEventListener('beforeunload', (e) =>
  {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (userId)
    {
      put('user/changeStatus', JSON.stringify({ userId, status: false }));
    }
  });
  return (
    <BrowserRouter basename="/">
      <Routes />
    </BrowserRouter>
  );
}

export default App;
