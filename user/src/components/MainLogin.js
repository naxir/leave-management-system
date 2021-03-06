// @flow
import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import '../spinners.css';

import UserLogin from './UserLogin';

const moment = require('moment');

const LEAVE_RECORD = gql`
  {
    findLeaveRecord(leaveStatus: "approved", isArchived: "false") {
      id
      leaveName
      startDate
      endDate
      leaveDays
      user {
        othernames
        surname
      }
    }
  }
`;

type Props = {
  data: Object,
  dispatch: Function,
  isFetching: boolean,
  message: string
};

const MainLogin = (props: Props) => {
  const { data: { loading, error, findLeaveRecord } } = props;

  if (loading) {
    return (
      <div className="col-md-4 ml-auto mr-auto pt-4">
        <div className="loader1" />
      </div>
    );
  }

  if (error) {
    console.log(error.message);
    return (
      <div className="col-md-4 ml-auto mr-auto">
        <div className="text-center">
          <p>Something went wrong!</p>
        </div>
      </div>
    );
  }

  const leaveRecords = findLeaveRecord
    .filter(record => {
      // get current date and format it
      let dateToday = moment();

      let todayDate = dateToday.format('DD/MM/YYYY');

      // get end date and format it
      let end_Date = moment(record.endDate, 'DD/MM/YYYY').format('DD/MM/YYYY');

      // check if current date and end date is same
      let isCurrentDate = todayDate === end_Date ? true : false;

      // get end date and format it
      let eDate = moment(record.endDate, 'DD/MM/YYYY').format('MM/DD/YYYY');

      let endDate = moment(new Date(eDate));

      // check if end date is same as or falls after current date
      let isEndDate = endDate.isSameOrAfter(dateToday);

      // return true for current and future dates
      return isCurrentDate || isEndDate ? true : false;
    })
    .map(data => (
      <tr key={data.id}>
        <td>
          {data.user.othernames} {data.user.surname}
        </td>
        <td>{data.leaveName}</td>
        <td>{data.startDate}</td>
        <td>{data.endDate}</td>
        <td>{data.leaveDays}</td>
      </tr>
    ));

  return leaveRecords.length > 0 ? (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <div style={{ marginTop: '80px' }}>
            <div className="table-responsive">
              <table
                className="table table-bordered table-hover"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <thead className="thead-light">
                  <tr>
                    <th>Name</th>
                    <th>Leave type</th>
                    <th>Start date</th>
                    <th>End date</th>
                    <th>Leave days</th>
                  </tr>
                </thead>
                <tbody>{leaveRecords}</tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <UserLogin
            isFetching={props.isFetching}
            message={props.message}
            dispatch={props.dispatch}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="container">
      <div className="col-5 ml-auto mr-auto pt-4">
        <UserLogin
          isFetching={props.isFetching}
          message={props.message}
          dispatch={props.dispatch}
        />
      </div>
    </div>
  );
};

export default graphql(LEAVE_RECORD)(MainLogin);
