// @flow
import axios from 'axios';

export const LEAVE_APPLICATION_REQUEST = 'LEAVE_APPLICATION_REQUEST';
export const LEAVE_APPLICATION_SUCCESS = 'LEAVE_APPLICATION_SUCCESS';
export const LEAVE_APPLICATION_FAILURE = 'LEAVE_APPLICATION_FAILURE';

export const requestLeaveApplication = (applicationDetails: Object) => {
  return { type: LEAVE_APPLICATION_REQUEST, applicationDetails };
};

export const receiveLeaveApplication = () => {
  return { type: LEAVE_APPLICATION_SUCCESS };
};

export const leaveApplicationFailure = (data: Object) => {
  return { type: LEAVE_APPLICATION_FAILURE, message: data.message };
};

export const fetchLeaveApplication = (applicationDetails: Object) => async (
  dispatch: Function,
  getState: Function
) => {
  try {
    dispatch(requestLeaveApplication(applicationDetails));

    let data = new FormData();
    data.append('user_id', applicationDetails.user_id);
    data.append('leave', applicationDetails.leave);
    data.append('leaveType', applicationDetails.leaveType);
    data.append('startDate', applicationDetails.startDate);
    data.append('endDate', applicationDetails.endDate);
    data.append('supervisorEmail', applicationDetails.supervisorEmail);
    data.append('secretaryEmail', applicationDetails.secretaryEmail);
    data.append('leaveDays', applicationDetails.leaveDays);
    data.append('applicationDays', applicationDetails.applicationDays);
    data.append('reason', applicationDetails.reason);
    data.append('sickSheet', applicationDetails.sickSheet);

    const response = await axios.post(
      'http://localhost:8080/applyforleave',
      data
    );

    if (response.status !== 201) {
      dispatch(leaveApplicationFailure(response.data));
    } else {
      dispatch(receiveLeaveApplication());
    }
  } catch (error) {
    console.log(error);
  }
};
