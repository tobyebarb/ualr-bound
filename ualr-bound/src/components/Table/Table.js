import React, { useState, useEffect, useContext } from "react";
import "./Table.css";
import DecisionButton from "./components/DecisionButton/DecisionButton";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import SearchIcon from "../../icons/SearchIcon";
import { Context } from "../../store/appContext";
import * as constants from "../../utils/Constants";

const Table = () => {
  const { store, actions } = useContext(Context);
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [frameworkComponents, setFrameworkComponents] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onSearchFocus = () => setSearchFocused(true);
  const onSearchBlur = () => setSearchFocused(false);

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
  };

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    tableWidth = dimensions.width - dimensions.width * tableMult;

    ridWidth = tableWidth * ridColMult;
    nameWidth = tableWidth * nameColMult;
    usernameWidth = tableWidth * usernameColMult;
    emailWidth = tableWidth * emailColMult;
    accessLevelWidth = tableWidth * accessLevelColMult;
    dateWidth = tableWidth * dateColMult;
    decisionWidth = tableWidth * decisionColMult;
  };

  const rowHeight = 100;

  const tableMult = 0.95;

  const ridColMult = 0.1;
  const nameColMult = 0.2;
  const usernameColMult = 0.2;
  const emailColMult = 0.2;
  const accessLevelColMult = 0.1;
  const dateColMult = 0.1;
  const decisionColMult = 0.1;

  const focusedColor = "#582633";

  let tableWidth = dimensions.width * tableMult;

  let ridWidth = tableWidth * ridColMult;
  let nameWidth = tableWidth * nameColMult;
  let usernameWidth = tableWidth * usernameColMult;
  let emailWidth = tableWidth * emailColMult;
  let accessLevelWidth = tableWidth * accessLevelColMult;
  let dateWidth = tableWidth * dateColMult;
  let decisionWidth =
    tableWidth * decisionColMult - (getScrollbarSize().width + 2);

  var data = [];

  const updateData = async () => {
    data = await actions.getRegistrationRequests();
    setRowData(data);
  };

  const decisionBtnClicked = async (data, isApproved) => {
    let res = await actions.updateRequestDecision(data, isApproved); //wait for response when all backend ops are done
    // check to make sure the it is waiting for res
    updateData(); // update table with new data
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    setScrollbarWidth(getScrollbarSize().width);
    setFrameworkComponents([{ decisionButtonRenderer: DecisionButton }]);
    setColumnDefs([
      { headerName: "Request ID", field: "request_id", width: ridWidth },
      { headerName: "Name", field: "name", width: nameWidth },
      { headerName: "Username", field: "username", width: usernameWidth },
      { headerName: "Email", field: "email", width: emailWidth },
      {
        headerName: "Access Level",
        field: "access_level",
        width: accessLevelWidth,
      },
      { headerName: "Date Created", field: "date_created", width: dateWidth },
      {
        headerName: "Approve/Deny",
        field: "decision",
        cellClass: "decision-btn-cell",
        width: decisionWidth,
        cellRendererFramework: (params) => {
          return (
            <DecisionButton params={params} updateRows={decisionBtnClicked} />
          );
        },
      },
    ]);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function createRowData() {
    data = await actions.getRegistrationRequests();
    console.log("DATA: ", data);
    setRowData(data);
  }

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    createRowData();
  }

  return (
    <div className="table-container">
      <div
        className="ag-theme-balham table-root"
        style={{
          height: "80vh",
          width: tableWidth,
        }}
      >
        <div className="table-searchbar-container">
          <SearchIcon focused={searchFocused} focusedColor={focusedColor} />
          <input
            type="search"
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            className="table-searchbar"
            onChange={onFilterTextChange}
            placeholder="Search for a request..."
          />
        </div>
        <AgGridReact
          onGridReady={onGridReady}
          rowHeight={rowHeight}
          frameworkComponents={frameworkComponents}
          columnDefs={columnDefs}
          rowData={rowData}
          scrollbarWidth={0}
        />
      </div>
    </div>
  );
};

export default Table;

export const getScrollbarSize = () => {
  const { body } = document;
  const scrollDiv = document.createElement("div");

  // Append element with defined styling
  scrollDiv.setAttribute(
    "style",
    "width: 1337px; height: 1337px; position: absolute; left: -9999px; overflow: scroll;"
  );
  body.appendChild(scrollDiv);

  // Collect width & height of scrollbar
  const calculateValue = (type) =>
    scrollDiv[`offset${type}`] - scrollDiv[`client${type}`];
  const scrollbarWidth = calculateValue("Width");
  const scrollbarHeight = calculateValue("Height");

  // Remove element
  body.removeChild(scrollDiv);

  return {
    width: scrollbarWidth,
    height: scrollbarHeight,
  };
};
