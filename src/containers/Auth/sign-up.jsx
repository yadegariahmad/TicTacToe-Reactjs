/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

  const changeHandler = (e) =>
  {
    const object = e.target.name;

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
      .then(res => res.data)
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

      <input
        onChange={(e) => { changeHandler(e); }}
        value={signUpForm.name.value}
        type="text"
        name="name"
        placeholder="Name"
      />
      {!signUpForm.name.valid && <span className="error">Name is required</span>}

      <input
        onChange={(e) => { changeHandler(e); }}
        value={signUpForm.userName.value}
        type="text"
        name="userName"
        placeholder="User Name"
      />
      {!signUpForm.userName.valid && <span className="error">User Name is required</span>}

      <input
        onChange={(e) => { changeHandler(e); }}
        value={signUpForm.email.value}
        type="email"
        name="email"
        placeholder="Email"
      />
      {!signUpForm.email.valid && <span className="error">e-mail format is incorrect</span>}

      <input
        onChange={(e) => { changeHandler(e); }}
        value={signUpForm.password.value}
        type="password"
        name="password"
        placeholder="Password"
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
