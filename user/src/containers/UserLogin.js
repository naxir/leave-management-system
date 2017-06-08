// @flow
import React from 'react';
import { connect } from 'react-redux';

import { fetchLogin } from '../actions/UserLogin';
import Login from '../components/UserLogin';

const UserLogin = ({ dispatch, isAuthenticated, message, isFetching }) =>
  <div className="UserLogin">
    {!isAuthenticated &&
      <Login
        isFetching={isFetching}
        message={message}
        onLoginClick={creds => dispatch(fetchLogin(creds))}
      />}
  </div>;

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated, message, isFetching } = userAuth;

  return { isAuthenticated, message, isFetching };
};

export default connect(mapStateToProps)(UserLogin);
