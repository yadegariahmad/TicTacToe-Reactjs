import React from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';
import Store from './store';
// import { put } from './util/request';

function App()
{
  return (
    <Store>
      <HashRouter basename="/">
        <Routes />
      </HashRouter>
    </Store>
  );
}

export default App;
