// @flow
import React from 'react';

import { graphql, gql, compose } from 'react-apollo';

import { UserRecord, RecordList } from '../components/UserRecord';

const User_Detail = gql`
  {
    user(id: "VXNlcjozMQ==") {
      id
      othernames
      surname
      annual
      sick
      bereavement
      christmas
      maternity
      gender
    }
  }
`;

const User_Record = gql`
  {
    user(id: "VXNlcjozMQ==") {
      leaverecord {
        edges {
          node {
            id
            leaveName
            leaveDays
            startDate
            endDate
            leaveReason
            leaveStatus
          }
        }
      }
    }
  }
`;

type Props = {
  userDetail: Object,
  userRecord: Object
};

const UserRecords = (props: Props) => {
  return (
    <div className="UserRecords">
      <UserRecord user_detail={props.userDetail} />
      <RecordList user_record={props.userRecord} />
    </div>
  );
};

export default compose(
  graphql(User_Detail, { name: 'userDetail' }),
  graphql(User_Record, { name: 'userRecord' })
)(UserRecords);
