/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Request from '../../util/request';
import { email, length, required } from '../../util/validators';
import './_index.scss';

const SignIn = ({ error }) =>
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

  const changeHandler = (e) =>
  {
    const object = e.target.name;

    let isValid = true;
    for (const validator of logInForm[object].validators)
    {
      isValid = isValid && validator(e.target.value);
    }

    setValues({
      ...logInForm,
      object: {
        ...object,
        value: e.target.value,
        valid: isValid,
      },
    });

    let formIsValid = true;
    // eslint-disable-next-line guard-for-in
    for (const input in logInForm)
    {
      formIsValid = formIsValid && logInForm[input].valid;
    }

    setValues({
      ...logInForm,
      formIsValid,
    });
  };

  const signIn = (e) =>
  {
    e.preventDefault();

    const graphqlQuery = {
      query: `
        {
          login(email: "${logInForm.email.value}", password: "${logInForm.password.value}") {
            token
            userId
          }
        }
      `,
    };
    Request.post(JSON.stringify(graphqlQuery))
      .then(res => res.JSON())
      .then((resData) =>
      {
        if (resData.errors && resData.errors[0].status === 422)
        {
          throw new Error("Validation failed. Make sure the email address isn't used yet!");
        }
        if (resData.errors)
        {
          throw new Error('User login failed!');
        }
        console.log(resData);

        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);

        localStorage.setItem('token', resData.data.login.token);
        localStorage.setItem('userId', resData.data.login.userId);
        localStorage.setItem('expiryDate', expiryDate.toISOString());
      })
      .catch((err) =>
      {
        console.log(err);
        error(err);
      });
  };

  return (
    <form onSubmit={(e) => { signIn(e); }}>
      <h1>Sign in</h1>
      <br />

      <input
        onChange={(e) => { changeHandler(e); }}
        value={logInForm.email.value}
        type="email"
        name="email"
        placeholder="Email"
      />
      {!logInForm.email.valid && <span className="error">e-mail format is incorrect</span>}

      <input
        onChange={(e) => { changeHandler(e); }}
        value={logInForm.password.value}
        type="password"
        name="password"
        placeholder="Password"
      />
      {!logInForm.password.valid && <span className="error">Password min length is 5</span>}

      <button type="submit" disabled={!logInForm.formIsValid}>Sign In</button>
    </form>
  );
};

SignIn.propTypes = {
  error: PropTypes.func.isRequired,
};

export default SignIn;
