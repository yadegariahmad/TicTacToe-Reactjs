import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

function App()
{
  return (
    <Fragment>
      <BrowserRouter basename="/">
        <Routes />
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
