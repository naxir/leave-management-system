// @flow
import React from 'react';
import { connect } from 'react-redux';

import { logoutUser } from '../actions/UserLogout';
import Navs from '../components/Header';

type Props = {
  isAuthenticated: boolean,
  dispatch: Function
};

const Header = (props: Props) => (
  <div className="Header">
    <Navs
      isAuthenticated={props.isAuthenticated}
      dispatch={props.dispatch}
      logoutUser={logoutUser}
    />
  </div>
);

const mapStateToProps = state => {
  const { userAuth } = state;
  const { isAuthenticated } = userAuth;

  return { isAuthenticated };
};

export default connect(mapStateToProps)(Header);
