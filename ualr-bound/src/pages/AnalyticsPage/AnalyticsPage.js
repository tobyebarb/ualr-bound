import { jssPreset } from "@material-ui/styles";
import React, { useState, useContext, useRef, useEffect } from "react";
import { FileUploader } from "../../App";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AnalyticsModal from "../../components/Table/components/AnalyticsModal/AnalyticsModal";
import Table from "../../components/Table/Table";
import { Context } from "../../store/appContext";
import { getScrollbarSize } from "../EditCallersPage/EditCallersPage";
import "./AnalyticsPage.css";

const AnalyticsPage = () => {
  const { store, actions } = useContext(Context);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  const rowHeight = 100;

  /*percentage of the screen the table should occupy*/
  const tableMult = 0.9;
  const [tableWidth, setTableWidth] = useState(store.window.width * tableMult);

  /*percentage of the table columns depending on screen size*/
  const TNumColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const nameColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const callResponse0ColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const callResponse1ColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const wasEmailedColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const wasCalledColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const numCalledColMult = store.window.width > 1650 ? 0.09 : 0.09;
  const ethnicityColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const sexColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const programColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const collegeColMult = store.window.width > 1650 ? 0.3 : 0.3;
  const departmentColMult = store.window.width > 1650 ? 0.2 : 0.2;

  const tableRef = useRef();

  const fileRef = useRef(null);
  useEffect(() => {
    if (store.ui.importIsVisible) {
      fileRef.current.openUploader();
    }
  }, [store.ui.importIsVisible]);

  var data = [];

  async function getData() {
    data = await actions.getStudentsSRA();
    return data;
  }

  async function getColumnDefs() {
    setTableWidth(store.window.width * tableMult);
    return [
      {
        headerName: "T Number",
        field: "tNumber",
        width: store.window.width * tableMult * TNumColMult,
        sortable: true,
      },
      {
        headerName: "Name",
        field: "name",
        width: store.window.width * tableMult * nameColMult,
        sortable: true,
      },
      {
        headerName: "1st Call Disposition",
        field: "callResponse0",
        width: store.window.width * tableMult * callResponse0ColMult,
        sortable: true,
      },
      {
        headerName: "2nd Call Disposition",
        field: "callResponse1",
        width: store.window.width * tableMult * callResponse1ColMult,
        sortable: true,
      },
      {
        headerName: "Was Emailed?",
        field: "wasEmailed",
        width: store.window.width * tableMult * wasEmailedColMult,
        sortable: true,
      },
      {
        headerName: "Was Called?",
        field: "wasCalled",
        width: store.window.width * tableMult * wasCalledColMult,
        sortable: true,
      },
      {
        headerName: "Times Called",
        field: "numTimesCalled",
        width: store.window.width * tableMult * numCalledColMult,
        sortable: true,
      },
      {
        headerName: "Ethnicity",
        field: "ethnicity",
        width: store.window.width * tableMult * ethnicityColMult,
        sortable: true,
      },
      {
        headerName: "Sex",
        field: "sex",
        width: store.window.width * tableMult * sexColMult,
        sortable: true,
      },
      {
        headerName: "Program",
        field: "program",
        width: store.window.width * tableMult * programColMult,
        sortable: true,
      },
      {
        headerName: "College",
        field: "college",
        width: store.window.width * tableMult * collegeColMult,
        sortable: true,
      },
      {
        headerName: "Department",
        field: "department",
        width: store.window.width * tableMult * departmentColMult,
        sortable: true,
      },
    ];
  }

  async function getFrameworkComponents() {
    return [];
  }

  useEffect(() => {
    setScrollbarWidth(getScrollbarSize().width);
  }, []);

  const openModal = () => {
    actions.setAnalyticModalVisibility(true);
  };

  return (
    <div className="analytics-table-container">
      <div className="table-components">
        <Table
          ref={tableRef}
          rowHeight={rowHeight}
          tableWidth={tableWidth}
          getData={getData}
          getColumnDefs={getColumnDefs}
          getFrameworkComponents={getFrameworkComponents}
          defaultCol={"tnum"}
        />
      </div>
      <div className="analytics-button-container">
        <button className="analytics-button" onClick={openModal}>
          More Analytics
        </button>
      </div>
      <AnalyticsModal />
      <NavigationBar />
      <FileUploader ref={fileRef} />
    </div>
  );
};

export default AnalyticsPage;
