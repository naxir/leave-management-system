// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import '../spinners.css';

import { fetchLoginFromToken } from '../actions/AdminLogin';
import { fetchApprovedLeave } from '../actions/ApprovedLeave';
import { submitEditApprovedLeave } from '../actions/EditLeave';
import { submitDeleteLeave } from '../actions/DeleteLeave';
import ApprovedLeaveList from '../components/ApprovedLeave';

class ApprovedLeave extends Component {
  componentDidMount() {
    const { dispatch, auth_info } = this.props;
    let admin_token = auth_info.admin_token
      ? auth_info.admin_token
      : localStorage.getItem('admin_token');

    if (admin_token) {
      dispatch(fetchLoginFromToken(admin_token, fetchApprovedLeave));
    }
  }

  render() {
    const {
      isAuthenticated,
      approved_items,
      public_holiday,
      isFetching,
      dispatch,
      isEditLeaveFetching,
      editLeaveMessage
    } = this.props;

    return (
      <div className="container">
        {isAuthenticated
          ? isFetching
              ? <div className="text-center">
                  <div className="loader1" />
                </div>
              : <ApprovedLeaveList
                  approved_items={approved_items}
                  public_holiday={public_holiday}
                  dispatch={dispatch}
                  isEditLeaveFetching={isEditLeaveFetching}
                  editLeaveMessage={editLeaveMessage}
                  onEditApprovedLeaveSubmit={editLeaveData =>
                    dispatch(submitEditApprovedLeave(editLeaveData))}
                  onDeleteLeaveSubmit={deleteLeaveData =>
                    dispatch(submitDeleteLeave(deleteLeaveData))}
                />
          : <Redirect to="/" />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { adminAuth, approvedLeave, publicHoliday, editLeave } = state;
  const { auth_info, isAuthenticated } = adminAuth;
  const { isFetching, approved_items } = approvedLeave;
  const { public_holiday } = publicHoliday;
  const { isEditLeaveFetching, editLeaveMessage } = editLeave;

  return {
    auth_info,
    isAuthenticated,
    approved_items,
    public_holiday,
    isFetching,
    isEditLeaveFetching,
    editLeaveMessage
  };
};

export default connect(mapStateToProps)(ApprovedLeave);
