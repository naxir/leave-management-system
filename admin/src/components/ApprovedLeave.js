import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const moment = require('moment');

const ApprovedRecordList = ({ approved_items }) => {
  const items = approved_items.map((record) => {
    // get current date and format it
    let dateToday = moment()
    let todayDate = dateToday.format('DD/MM/YYYY')

    // get end date and format it
    let end_Date =   moment(record.end_date, 'DD/MM/YYYY').format('DD/MM/YYYY')

    // check if current date and end date is same
    let isCurrentDate = (todayDate === end_Date ? true : false)

    // check if end date is same or greater than current date
    let eDate =   moment(record.end_date, 'DD/MM/YYYY').format('MM/DD/YYYY')
    let endDate = moment(new Date(eDate))
    let isEndDate = endDate.isSameOrAfter(dateToday)

    // display only current and future leaves
    if (isCurrentDate || isEndDate) {
      return (
        <tr key={record.id}>
          <td>{record.user.othernames} {record.user.surname}</td>
          <td>{record.leave_name}</td>
          <td>{record.leave_type}</td>
          <td>{record.start_date}</td>
          <td>{record.end_date}</td>
          <td>{record.leave_days}</td>
          <td>
            <Link to="/reset" className="btn btn-info btn-sm">Edit</Link>
          </td>
          <td>
            <Link to="/reset" className="btn btn-danger btn-sm">Delete</Link>
          </td>
        </tr>
      )
    }
    else {
      return (null)
    }
  })

  // check if there are current and upcoming approved leave
  const item = items.filter((val) =>
    val !== null).map((d) => {
      return d
          })

  if (item.length > 0) {
    return (
      <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="thead-default">
          <tr>
            <th>Name</th>
            <th>Leave</th>
            <th>Type</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Leave days</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
    )
  }
  else {
    return (
      <div className="container text-xs-center" style={{paddingTop: '100px'}}>
          <h1 className="display-4">There are no approved leave record.</h1>
      </div>
    )
  }
}

const ApprovedLeaveList = ({ approved_items }) => {
  return (
    <ApprovedRecordList approved_items={approved_items} />
  )
}

ApprovedLeaveList.propTypes = {
  approved_items: PropTypes.array.isRequired
}

export default ApprovedLeaveList
