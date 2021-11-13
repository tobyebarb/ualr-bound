import React, { useState, useContext, useRef, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Table from "../../components/Table/Table";
import DecisionButton from "../../components/Table/components/DecisionButton/DecisionButton";
import { Context } from "../../store/appContext";
import "./RegisterRequestPage.css";

const RegisterRequestPage = () => {
  const { store, actions } = useContext(Context);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  const rowHeight = 100;
  const tableMult = 0.95;
  const ridColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const nameColMult = store.window.width > 1650 ? 0.2 : 0.15;
  const usernameColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const emailColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const accessLevelColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const dateColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const decisionColMult = store.window.width > 1650 ? 0.1 : 0.15;

  const [tableWidth, setTableWidth] = useState(store.window.width * tableMult);

  const tableRef = useRef();

  const updateData = async () => {
    tableRef.current.updateData();
  };

  const decisionBtnClicked = async (data, isApproved) => {
    let res = await actions.updateRequestDecision(data, isApproved); //wait for response when all backend ops are done
    // check to make sure the it is waiting for res
    updateData(); // update table with new data
  };

  var data = [];

  async function getData() {
    data = await actions.getRegistrationRequests();
    return data;
  }

  async function getColumnDefs() {
    setTableWidth(store.window.width * tableMult);
    return [
      {
        headerName: "Request ID",
        field: "request_id",
        width: store.window.width * tableMult * ridColMult,
        sortable: true,
      },
      {
        headerName: "Name",
        field: "name",
        width: store.window.width * tableMult * nameColMult,
        sortable: true,
      },
      {
        headerName: "Username",
        field: "username",
        width: store.window.width * tableMult * usernameColMult,
        sortable: true,
      },
      {
        headerName: "Email",
        field: "email",
        width: store.window.width * tableMult * emailColMult,
        sortable: true,
      },
      {
        headerName: "Access Level",
        field: "access_level",
        width: store.window.width * tableMult * accessLevelColMult,
        sortable: true,
      },
      {
        headerName: "Date Created",
        field: "date_created",
        width: store.window.width * tableMult * dateColMult,
        sortable: true,
      },
      {
        headerName: "Approve/Deny",
        field: "decision",
        cellClass: "decision-btn-cell",
        width:
          store.window.width * tableMult * decisionColMult -
          (getScrollbarSize().width + 2),
        sortable: true,
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
        defaultCol={"request_id"}
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
