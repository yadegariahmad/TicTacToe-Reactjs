import React, { useState } from 'react';
import ErrorHandler from '../../components/errorHandler/errorHandler';
import SignUp from './sign-up';
import SignIn from './sign-in';
import './auth.scss';

const Auth = () =>
{
  const [mode, changeMode] = useState('signIn');
  const [error, setError] = useState(null);

  const containerClass = () => (mode === 'signIn' ? '' : 'right-panel-active');
  function errorHandlerFunc(err)
  {
    setError(err);
  }

  return (
    <div className="Auth">
      {error && <ErrorHandler error={error} close={() => { setError(null); }} />}
      <div className={`container ${containerClass()}`} id="container">

        <div className="form-container sign-up-container">
          <SignUp error={errorHandlerFunc} userCreated={changeMode} />
        </div>

        <div className="form-container sign-in-container">
          <SignIn error={errorHandlerFunc} />
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button type="button" className="ghost" onClick={() => { changeMode('signIn'); }}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button type="button" className="ghost" onClick={() => { changeMode('SignUp'); }}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
