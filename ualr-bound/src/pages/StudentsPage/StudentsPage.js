import React, { useState, useContext, useRef, useEffect } from "react";
import { FileUploader } from "../../App";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import StudentDetails from "../../components/Table/components/StudentDetails/StudentDetails";
import StudentDetailsModal from "../../components/Table/components/StudentDetailsModal/StudentDetailsModal";
import Table from "../../components/Table/Table";
import { Context } from "../../store/appContext";
import { getScrollbarSize } from "../EditCallersPage/EditCallersPage";
import "./StudentsPage.css";

const StudentsPage = () => {
  const { store, actions } = useContext(Context);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [selectStudentTNum, setSelectStudentTNum] = useState(null);

  const rowHeight = 100;

  /*percentage of the screen the table should occupy*/
  const tableMult = 0.7;
  const [tableWidth, setTableWidth] = useState(store.window.width * tableMult);

  /*setting the percentage width for the column headers depending on screen size*/
  const TNumColMult = store.window.width > 1650 ? 0.2 : 0.2;
  const nameColMult = store.window.width > 1650 ? 0.3 : 0.3;
  const emailColMult = store.window.width > 1650 ? 0.3 : 0.3;
  const statusColMult = store.window.width > 1650 ? 0.2 : 0.2;

  /*using a table reference to utilize the functions inside the Table component*/
  const tableRef = useRef();
  const detailsRef = useRef();

  const fileRef = useRef(null);
  useEffect(() => {
    if (store.ui.importIsVisible) {
      fileRef.current.openUploader();
    }
  }, [store.ui.importIsVisible]);

  /* Update changes made with the table */
  const updateData = async () => {
    tableRef.current.updateData();
  };

  const updateDetails = async () => {
    detailsRef.current.fetchData();
  };

  var data = [];

  //needed for the material UI overlay displaying the student information
  const rowSelectionCallback = (studentTNum) => {
    setSelectStudentTNum(studentTNum);
    return studentTNum;
  };

  async function getData() {
    data = await actions.getStudents();
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
        headerName: "Email",
        field: "email",
        width: store.window.width * tableMult * emailColMult,
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
    <div className="students-container">
      <div className="table-components">
        <Table
          ref={tableRef}
          option={"studentsPage"}
          rowHeight={rowHeight}
          tableWidth={tableWidth}
          getData={getData}
          getColumnDefs={getColumnDefs}
          getFrameworkComponents={getFrameworkComponents}
          rowSelectionCallback={rowSelectionCallback}
          defaultCol={"tNumber"}
        />
        <StudentDetails
          ref={detailsRef}
          updateData={updateData}
          selectedTNumber={selectStudentTNum}
          buttonOption={true}
        />
      </div>
      <StudentDetailsModal
        updateData={updateData}
        updateFunc={updateDetails}
        selectedTNumber={selectStudentTNum}
      />
      <NavigationBar />
      <FileUploader ref={fileRef} />
    </div>
  );
};

export default StudentsPage;

/*handle resizing the scrollbar*/
/*export const getScrollbarSize = () => {
    const {body} = document;
    const scrollDiv = document.createElement("div");

    //Append element with defined styling
    scrollDiv.setAttribut(
        "style",
        "width: 1337px; height: 1337px; position: absolute; left: -9999px; overflow: scroll;"
    );
    body.appendChild(scrollDiv);

    //Calculate width and height of the scrollbar
    const calculateValue = (type) => {
        scrollDiv['offset${type}'] - scrollDiv['client${type}'];
    }
    const scrollbarWidth = calculateValue("Width");
    const scrollbarHeight = claculateValue("Height");

    //Remove the element 
    body.removeChild(scroll);

    return{
        width: scrollbarWidth;
        height: scrollbarHeight
    }
}*/
