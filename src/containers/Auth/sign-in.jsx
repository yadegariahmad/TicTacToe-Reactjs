/* eslint-disable no-restricted-syntax */
import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { post } from '../../util/request';
import { email, length, required } from '../../util/validators';
import { settingsContext } from '../../store';
import './_index.scss';

const SignIn = ({ error, history }) =>
{
  const logInFormInit = {
    email: {
      value: '',
      valid: false,
      validators: [email, required],
    },
    password: {
      value: '',
      valid: false,
      validators: [required, length],
    },
    formIsValid: false,
  };

  const [logInForm, setValues] = useState(logInFormInit);
  const [settings, setSettings] = useContext(settingsContext);

  const changeHandler = object => (e) =>
  {
    let isValid = true;
    for (const validator of logInForm[object].validators)
    {
      isValid = isValid && validator(e.target.value);
    }

    let updatedForm = {
      ...logInForm,
      [object]: {
        ...logInForm[object],
        value: e.target.value,
        valid: isValid,
      },
    };

    let formIsValid = true;
    // eslint-disable-next-line guard-for-in
    for (const input in updatedForm)
    {
      if (input !== 'formIsValid')
      {
        formIsValid = formIsValid && updatedForm[input].valid;
      }
    }

    updatedForm = {
      ...updatedForm,
      formIsValid,
    };

    setValues(updatedForm);
  };

  const signIn = (e) =>
  {
    e.preventDefault();
    setSettings({ ...settings, showLoader: true });

    const body = {
      email: logInForm.email.value,
      password: logInForm.password.value,
    };

    post('auth/login', JSON.stringify(body))
      .then((resData) =>
      {
        setSettings({ ...settings, showLoader: false });
        if (resData.status === 201)
        {
          localStorage.setItem('token', resData.content.token);
          localStorage.setItem('TTTuserId', resData.content.userId);

          setValues(logInFormInit);
          history.push('/Main');
        } else
        {
          throw new Error(resData.message);
        }
      })
      .catch((err) =>
      {
        setSettings({ ...settings, showLoader: false });
        error(err.message);
      });
  };

  return (
    <form onSubmit={(e) => { signIn(e); }}>
      <h1>Sign in</h1>
      <br />
      <TextField
        label="Email"
        type="email"
        value={logInForm.email.value}
        onChange={changeHandler('email')}
        margin="normal"
      />
      {!logInForm.email.valid && <span className="error">e-mail format is incorrect</span>}

      <TextField
        label="Password"
        onChange={changeHandler('password')}
        value={logInForm.password.value}
        type="password"
        margin="normal"
      />
      {!logInForm.password.valid && <span className="error">Password min length is 5</span>}

      <button type="submit" disabled={!logInForm.formIsValid}>Sign In</button>
    </form>
  );
};

SignIn.propTypes = {
  error: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(SignIn);
