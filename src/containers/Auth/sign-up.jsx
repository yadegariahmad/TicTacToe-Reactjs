/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { post } from '../../util/request';
import { email, length, required } from '../../util/validators';
import './_index.scss';

const SignUp = ({ error, userCreated }) =>
{
  const SignUpFormInit = {
    email: {
      value: '',
      valid: false,
      validators: [email, required],
    },
    password: {
      value: '',
      valid: false,
      validators: [required, length({ min: 5 })],
    },
    name: {
      value: '',
      valid: false,
      validators: [required],
    },
    userName: {
      value: '',
      valid: false,
      validators: [required],
    },
    formIsValid: false,
  };

  const [signUpForm, setValues] = useState(SignUpFormInit);

  const changeHandler = object => (e) =>
  {
    let isValid = true;
    for (const validator of signUpForm[object].validators)
    {
      isValid = isValid && validator(e.target.value);
    }

    let updatedForm = {
      ...signUpForm,
      [object]: {
        ...signUpForm[object],
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

  const signUp = (e) =>
  {
    e.preventDefault();

    const body = {
      name: signUpForm.name.value,
      email: signUpForm.email.value,
      userName: signUpForm.userName.value,
      password: signUpForm.password.value,
    };

    post('auth/signup', JSON.stringify(body))
      .then((resData) =>
      {
        if (resData.status === 201)
        {
          userCreated('signIn');
          setValues(SignUpFormInit);
        } else
        {
          throw new Error(resData.message);
        }
      })
      .catch((err) =>
      {
        error(err.message);
      });
  };

  return (
    <form onSubmit={(e) => { signUp(e); }}>
      <h1>Sign in</h1>
      <br />

      <TextField
        label="Full Name"
        value={signUpForm.name.value}
        onChange={changeHandler('name')}
        margin="normal"
      />
      {!signUpForm.name.valid && <span className="error">Name is required</span>}

      <TextField
        label="User Name"
        value={signUpForm.userName.value}
        onChange={changeHandler('userName')}
        margin="normal"
      />
      {!signUpForm.userName.valid && <span className="error">User Name is required</span>}

      <TextField
        label="Email"
        type="email"
        value={signUpForm.email.value}
        onChange={changeHandler('email')}
        margin="normal"
      />
      {!signUpForm.email.valid && <span className="error">e-mail format is incorrect</span>}

      <TextField
        label="Password"
        onChange={changeHandler('password')}
        value={signUpForm.password.value}
        type="password"
        margin="normal"
      />
      {!signUpForm.password.valid && <span className="error">Password min length is 5</span>}

      <button type="submit" disabled={!signUpForm.formIsValid}>Sign Up</button>
    </form>
  );
};

SignUp.propTypes = {
  error: PropTypes.func.isRequired,
  userCreated: PropTypes.func.isRequired,
};

export default SignUp;
