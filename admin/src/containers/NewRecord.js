// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { fetchLoginFromToken } from "../actions/AdminLogin";
import NewRecordForm from "../components/NewRecord";
import { submitNewUserRecord, clearNewUserRecord } from "../actions/NewRecord";

class NewRecord extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem("admin_token");

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token));
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearNewUserRecord());
  }

  render() {
    const {
      isAuthenticated,
      dispatch,
      message,
      isFetching
    } = this.props;

    return (
      <div className="NewRecord">
        {isAuthenticated
          ? <NewRecordForm
              isFetching={isFetching}
              message={message}
              dispatch={dispatch}
              onNewUserRecordSubmit={newUserDetails =>
                dispatch(submitNewUserRecord(newUserDetails))}
            />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, addUser } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, message } = addUser;

  return { auth_info, isAuthenticated, isFetching, message };
};

export default connect(mapStateToProps)(NewRecord);
