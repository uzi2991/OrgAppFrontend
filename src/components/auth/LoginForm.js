import React, { useContext } from 'react';
import axios from 'axios';

import globalContext from '../../context/globalContext';
import { backendUrl } from '../../static/js/const';
import { useForm } from 'react-hook-form';

const LoginForm = ({ setErrMsgs }) => {
  const { register, handleSubmit, watch } = useForm();

  const email = watch('email', '');
  const password = watch('password', '');
  const { login } = useContext(globalContext);

  const onSubmit = async (data) => {
    const url = `${backendUrl}/auth/signin`;
    try {
      const res = await axios.post(url, data);
      login(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setErrMsgs({
          signup: false,
          err: true,
          msgs: { Invalid: 'username or password' },
        });
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="login-fieldset">
          <input
            className="sidebar-input border--gray border--onHoverBlue"
            type="text"
            name="email"
            placeholder="Email"
            ref={register({ required: true })}
          />
          <input
            className="sidebar-input border--gray border--onHoverBlue"
            type="password"
            name="password"
            placeholder="Password"
            ref={register({ required: true })}
          />
          {email.trim() !== '' && password.trim() !== '' ? (
            <button className="btn" type="submit">
              {' '}
              Login{' '}
            </button>
          ) : (
            <button className="btn btn--disabled" disabled>
              {' '}
              Login{' '}
            </button>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default LoginForm;
