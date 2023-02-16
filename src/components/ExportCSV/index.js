import React from "react";
import { CSVLink } from "react-csv";
import CSVImg from "../../images/csv.svg";

// const headers = [
//   { label: "id", key: "id" },
//   { label: "name", key: "name" },
//   { label: "count", key: "count" },
//   { label: "startDate", key: "startDate" },
//   { label: "endDate", key: "endDate" },
//   { label: "sosDate", key: "sosDate" },
//   { label: "filename", key: "filename" },
//   { label: "status", key: "status" },
//   { label: "owner", key: "owner" },
// ];
const headers = [
  "id",
  "name",
  "count",
  "startDate",
  "endDate",
  "sosDate",
  "filename",
  "status",
  "owner",
];

const csvTag = (data) => {
  return (
    <CSVLink {...data}>
      <img src={CSVImg} alt="Export to csv" />
    </CSVLink>
  );
};

const ExportCSV = ({ data }) => {
  const csvData = [[...Object.values(data)]];
  const csvReport = {
    data: csvData,
    headers: headers,
    filename: "PG Artwork.csv",
  };

  return <>{csvTag(csvReport)}</>;
};

export default ExportCSV;

export const ExportSelectedRows = ({ selectedRows }) => {
  if (!selectedRows || selectedRows.length === 0) return null;
  const allRows = selectedRows.map(
    ({
      id,
      name,
      count,
      startDate,
      endDate,
      sosDate,
      filename,
      status,
      owner,
    }) => [
      id ? id.toString() : "",
      name,
      count ? count.toString() : "",
      startDate ? startDate.toString() : "",
      endDate ? endDate.toString() : "",
      sosDate ? sosDate.toString() : "",
      filename,
      status,
      owner,
    ]
  );
  const csvReport = {
    data: allRows,
    headers: headers,
    filename: "Selected_Rows.csv",
  };
  return <>{csvTag(csvReport)}</>;
};
