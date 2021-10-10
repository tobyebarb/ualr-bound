import { Link, BrowserRouter } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTable } from "react-table";
import { COLUMNS } from "./Columns";
import "./RegistrationRequestPage.css";

const RegistrationRequestPage = () => {
  const [requests, setRequests] = useState([
    {
      id: "000000",
      name: "Chris Stone",
      username: "ChrisS",
      email: "chrisstone22@gmail.com",
      accessLevel: "ROOT",
      dateCreated: "05-19-2021",
    },
    {
      id: "000001",
      name: "Julie Andrews",
      username: "JDrews",
      email: "jasoundofmusic@gmail.com",
      accessLevel: "ADMIN",
      dateCreated: "03-27-2021",
    },
    {
      id: "000002",
      name: "Abby Rowlan",
      username: "Abrow",
      email: "abbyrowlan@yahoo.com",
      accessLevel: "CALLER",
      dateCreated: "11-03-2021",
    },
  ]);

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => requests, []);

  const tableInstance = useTable({
    columns: columns,
    data: data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div>
      <table className="request-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {
                  row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  })
                }
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <p>
          <BrowserRouter>
            <Link
              to="/"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Dashboard
            </Link>
          </BrowserRouter>
        </p>
      </div>
    </div>
  );
};

export default RegistrationRequestPage;
