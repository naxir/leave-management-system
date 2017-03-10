import React, { PropTypes } from "react";
import { Link } from "react-router-dom";

const SickSheetList = ({ sickSheet_items }) => {
  const itemNodes = sickSheet_items.map(record => (
    <tr key={record.id}>
      <td>{record.user.othernames}{" "}{record.user.surname}</td>
      <td>{record.start_date}</td>
      <td>{record.end_date}</td>
      <td>{record.leave_days}</td>
      <td>{record.date_posted}</td>
      <td>
        <Link
          className="btn btn-primary btn-sm"
          to={`/sicksheetrecord/${record.file_name}`}
        >
          Download
        </Link>
      </td>
    </tr>
  ));

  return itemNodes.length > 0
    ? <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <thead className="thead-default">
            <tr>
              <th>Name</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Leave days</th>
              <th>Date applied</th>
              <th>Sick sheet</th>
            </tr>
          </thead>
          <tbody>
            {itemNodes}
          </tbody>
        </table>
      </div>
    : <div className="text-center" style={{ paddingTop: "40px" }}>
        <h1 className="display-4">
          There are no approved sick leave record with medical certificate.
        </h1>
      </div>;
};

SickSheetList.propTypes = { sickSheet_items: PropTypes.array.isRequired };

export default SickSheetList;
