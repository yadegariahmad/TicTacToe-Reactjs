import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { put } from './util/request';

// window.addEventListener('unload', (e) =>
// {
//   e.preventDefault();
//   const userId = localStorage.getItem('TTTuserId');
//   if (userId)
//   {
//     put('user/changeStatus', JSON.stringify({ userId, status: false }));
//   }
// });

window.onbeforeunload = (event) =>
{
  if (event)
  {
    const userId = localStorage.getItem('TTTuserId');
    if (userId)
    {
      put('user/changeStatus', JSON.stringify({ userId, status: false }));
    }
  }
  return true;
};

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'));
