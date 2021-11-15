import React, { useState, useContext, useRef, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Table from "../../components/Table/Table";
import UserDetails from "../../components/Table/components/UserDetails/UserDetails";
import { Context } from "../../store/appContext";
import "./EditCallersPage.css";
import UserDetailsModal from "../../components/Table/components/UserDetailsModal/UserDetailsModal";
import { FileUploader } from "../../App";

const EditCallersPage = () => {
  const { store, actions } = useContext(Context);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [selectedUID, setSelectedUID] = useState(null);

  const rowHeight = 100;
  const tableMult = 0.7;
  const idColMult = store.window.width > 1650 ? 0.1 : 0.1;
  const nameColMult = store.window.width > 1650 ? 0.3 : 0.3;
  const accessLevelColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const dateColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const statusColMult = store.window.width > 1650 ? 0.2 : 0.2;

  const [tableWidth, setTableWidth] = useState(store.window.width * tableMult);

  const fileRef = useRef(null);
  useEffect(() => {
    if (store.ui.importIsVisible) {
      fileRef.current.openUploader();
    }
  }, [store.ui.importIsVisible]);

  /*
    ID: 10
    NAME:30
    ACCESS_LEVEL:20
    DATE:20
    STATUS:20
  */

  // let tableWidth = window.width * tableMult;

  // let idWidth = tableWidth * idColMult;
  // let nameWidth = tableWidth * nameColMult;
  // let accessLevelWidth = tableWidth * accessLevelColMult;
  // let dateWidth = tableWidth * dateColMult;
  // let statusWidth = tableWidth * statusColMult;

  const tableRef = useRef();
  const detailsRef = useRef();

  const updateData = async () => {
    tableRef.current.updateData();
  };

  const updateDetails = async () => {
    detailsRef.current.fetchData();
  };

  var data = [];

  const rowSelectionCallback = (uid) => {
    setSelectedUID(uid);
    return uid;
  };

  async function getData() {
    data = await actions.getCallers();
    return data;
  }

  async function getColumnDefs() {
    setTableWidth(store.window.width * tableMult);
    return [
      {
        headerName: "User ID",
        field: "user_id",
        width: store.window.width * tableMult * idColMult,
        sortable: true,
      },
      {
        headerName: "Name",
        field: "name",
        width: store.window.width * tableMult * nameColMult,
        sortable: true,
      },
      {
        headerName: "Access Level",
        field: "access_level",
        width: store.window.width * tableMult * accessLevelColMult,
        sortable: true,
      },
      {
        headerName: "Created",
        field: "date_created",
        width: store.window.width * tableMult * dateColMult,
        sortable: true,
      },
      {
        headerName: "Status",
        field: "status",
        width: store.window.width * tableMult * statusColMult,
        sortable: true,
        cellStyle: (params) => {
          return params.value === "ACTIVE"
            ? { color: "green", fontWeight: "bold" }
            : { color: "red", fontWeight: "bold" };
        },
      },
    ];
  }

  async function getFrameworkComponents() {
    return [];
  }

  useEffect(() => {
    setScrollbarWidth(getScrollbarSize().width);
  }, []);

  return (
    <div className="edit-callers-container">
      <div className="table-components">
        <Table
          ref={tableRef}
          option={"editCallers"}
          rowHeight={rowHeight}
          tableWidth={tableWidth}
          getData={getData}
          getColumnDefs={getColumnDefs}
          getFrameworkComponents={getFrameworkComponents}
          rowSelectionCallback={rowSelectionCallback}
          defaultCol={"user_id"}
        />
        <UserDetails
          ref={detailsRef}
          updateData={updateData}
          selectedUID={selectedUID}
        />
      </div>
      <UserDetailsModal
        updateData={updateData}
        updateFunc={updateDetails}
        selectedUID={selectedUID}
      />
      <NavigationBar />
      <FileUploader ref={fileRef} />
    </div>
  );
};

export default EditCallersPage;

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
