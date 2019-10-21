import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import SignUp from './sign-up';
import SignIn from './sign-in';
import PageLoader from '../../components/pageLoader';
import { settingsContext } from '../../store';
import './auth.scss';

const Auth = ({ history }) =>
{
  const [mode, changeMode] = useState('signIn');
  const [error, setError] = useState('');
  const [settings] = useContext(settingsContext);

  useEffect(() =>
  {
    const token = localStorage.getItem('TTTtoken');

    if (token)
    {
      history.push('/Main');
    }
  }, []);

  const containerClass = () => (mode === 'signIn' ? '' : 'right-panel-active');
  const errorHandlerFunc = (err) =>
  {
    setError(err);
  };

  return (
    <div className="Auth">
      {settings.showLoader && <PageLoader />}
      <Dialog
        open={error.length > 0}
        onClose={() => setError('')}
      >
        <DialogTitle>
          {error}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setError('')} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
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

Auth.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Auth;
