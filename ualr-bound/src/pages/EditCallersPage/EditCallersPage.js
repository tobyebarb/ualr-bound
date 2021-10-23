import React, { useState, useContext, useRef, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Table from "../../components/Table/Table";
import { Context } from "../../store/appContext";
import "./EditCallersPage.css";

const EditCallersPage = () => {
  const { store, actions } = useContext(Context);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const rowHeight = 100;
  const tableMult = 0.7;

  /*
    ID: 10
    NAME:30
    ACCESS_LEVEL:20
    DATE:20
    STATUS:20
  */

  const idColMult = dimensions.width > 1650 ? 0.1 : 0.1;
  const nameColMult = dimensions.width > 1650 ? 0.3 : 0.3;
  const accessLevelColMult = dimensions.width > 1650 ? 0.2 : 0.2;
  const dateColMult = dimensions.width > 1650 ? 0.2 : 0.2;
  const statusColMult = dimensions.width > 1650 ? 0.2 : 0.2;

  let tableWidth = dimensions.width * tableMult;

  let idWidth = tableWidth * idColMult;
  let nameWidth = tableWidth * nameColMult;
  let accessLevelWidth = tableWidth * accessLevelColMult;
  let dateWidth = tableWidth * dateColMult;
  let statusWidth = tableWidth * statusColMult;

  const tableRef = useRef();

  const updateData = async () => {
    tableRef.current.updateData();
  };

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    tableWidth = dimensions.width - dimensions.width * tableMult;

    idWidth = tableWidth * idColMult;
    nameWidth = tableWidth * nameColMult;
    accessLevelWidth = tableWidth * accessLevelColMult;
    dateWidth = tableWidth * dateColMult;
    statusWidth = tableWidth * statusColMult;
  };

  var data = [];

  async function getData() {
    data = await actions.getCallers();
    return data;
  }

  async function getColumnDefs() {
    return [
      { headerName: "User ID", field: "user_id", width: idWidth },
      { headerName: "Name", field: "name", width: nameWidth },
      {
        headerName: "Access Level",
        field: "access_level",
        width: accessLevelWidth,
      },
      { headerName: "Created", field: "date_created", width: dateWidth },
      {
        headerName: "Status",
        field: "status",
        width: statusWidth,
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
