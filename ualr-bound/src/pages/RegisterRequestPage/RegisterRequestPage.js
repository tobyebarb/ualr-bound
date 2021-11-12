import React, { useState, useContext, useRef, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Table from "../../components/Table/Table";
import DecisionButton from "../../components/Table/components/DecisionButton/DecisionButton";
import { Context } from "../../store/appContext";
import "./RegisterRequestPage.css";

const RegisterRequestPage = () => {
  const { store, actions } = useContext(Context);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const rowHeight = 100;
  const tableMult = 0.95;

  const ridColMult = dimensions.width > 1650 ? 0.1 : 0.1;
  const nameColMult = dimensions.width > 1650 ? 0.2 : 0.15;
  const usernameColMult = dimensions.width > 1650 ? 0.2 : 0.2;
  const emailColMult = dimensions.width > 1650 ? 0.2 : 0.2;
  const accessLevelColMult = dimensions.width > 1650 ? 0.1 : 0.1;
  const dateColMult = dimensions.width > 1650 ? 0.1 : 0.1;
  const decisionColMult = dimensions.width > 1650 ? 0.1 : 0.15;

  let tableWidth = dimensions.width * tableMult;

  let ridWidth = tableWidth * ridColMult;
  let nameWidth = tableWidth * nameColMult;
  let usernameWidth = tableWidth * usernameColMult;
  let emailWidth = tableWidth * emailColMult;
  let accessLevelWidth = tableWidth * accessLevelColMult;
  let dateWidth = tableWidth * dateColMult;
  let decisionWidth =
    tableWidth * decisionColMult - (getScrollbarSize().width + 2);

  const tableRef = useRef();

  const updateData = async () => {
    tableRef.current.updateData();
  };

  const decisionBtnClicked = async (data, isApproved) => {
    let res = await actions.updateRequestDecision(data, isApproved); //wait for response when all backend ops are done
    // check to make sure the it is waiting for res
    updateData(); // update table with new data
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

  var data = [];

  async function getData() {
    data = await actions.getRegistrationRequests();
    return data;
  }

  async function getColumnDefs() {
    return [
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
    ];
  }

  async function getFrameworkComponents() {
    return [{ decisionButtonRenderer: DecisionButton }];
  }

  useEffect(() => {
    setScrollbarWidth(getScrollbarSize().width);
  }, []);

  return (
    <div className="register-request-container">
      <Table
        ref={tableRef}
        rowHeight={rowHeight}
        tableWidth={tableWidth}
        getData={getData}
        getColumnDefs={getColumnDefs}
        getFrameworkComponents={getFrameworkComponents}
        handleResize={handleResize}
      />
      <NavigationBar />
    </div>
  );
};

export default RegisterRequestPage;

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
