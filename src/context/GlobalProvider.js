import React, { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

import { backendUrl } from '../static/js/const';
import { authAxios } from '../static/js/util';
import globalContext from './globalContext';
import {
  globalReducer,
  LOGIN,
  LOGOUT,
  SET_BOARD_CONTEXT,
} from './globalReducer';

const GlobalProvider = (props) => {
  const history = useHistory();
  const [globalState, dispatch] = useReducer(globalReducer, {
    authUser: null,
    checkedAuth: false,
    board: null,
    setBoard: null,
  });

  const login = async (resData) => {
    localStorage.setItem('token', resData.token);
    dispatch({ type: LOGIN, user: resData.user });
    history.push('/');
  };

  const checkAuth = async () => {
    const url = backendUrl + '/auth/';
    try {
      const { data: user } = await authAxios.get(url);
      dispatch({ type: LOGIN, user });
    } catch (err) {
      dispatch({ type: LOGOUT });
    }
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem('token');
    history.push('/login');
  };

  const setBoardContext = (project, setProject) => {
    dispatch({ type: SET_BOARD_CONTEXT, project, setProject });
  };

  return (
    <globalContext.Provider
      value={{
        authUser: globalState.authUser,
        checkedAuth: globalState.checkedAuth,
        board: globalState.board,
        setBoard: globalState.setBoard,
        checkAuth,
        login,
        logout,
        setBoardContext,
      }}
    >
      {props.children}
    </globalContext.Provider>
  );
};

export default GlobalProvider;
