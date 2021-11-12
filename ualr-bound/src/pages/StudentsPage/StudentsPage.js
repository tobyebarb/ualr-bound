import React, {useState, useContext, useRef, useEffect} from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Table from "../../components/Table/Table";
import { Context } from "../../store/appContext";
import { getScrollbarSize } from "../EditCallersPage/EditCallersPage";
import "./StudentsPage.css";

const StudentsPage = () => {
    const {store, actions} = useContext(Context);
    const [scrollbarWidth, setScrollbarWidth] = useState(0);
    const [selectStudentTNum, setSelectStudentTNum] = useState(null);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,});

    const rowHeight = 100;
    /*percentage of the screen the table should occupy*/
    const tableMult = 0.7;

    /*setting the percentage width for the column headers depending on screen size*/
    const TNumColMult = dimensions.width > 1650 ? 0.2 : 0.2;
    const nameColMult = dimensions.width > 1650 ? 0.3 : 0.3;
    const emailColMult = dimensions.width > 1650 ? 0.3 : 0.3;
    const statusColMult = dimensions.width > 1650 ? 0.2 : 0.2;

    let tableWidth = dimensions.width * tableMult;

    /*setting the width of each column of the table */
    let TNumWidth = tableWidth * TNumColMult;
    let nameWidth = tableWidth * nameColMult;
    let emailWidth = tableWidth * emailColMult;
    let statusWidth = tableWidth * statusColMult;

    /*using a table reference to utilize the functions inside the Table component*/
    const tableRef = useRef();

    /* Update changes made with the table 
    const updateData = async () => {
        tableRef.current.updateData();
    };
    */

    /*Recalculating column sizes */
    const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        tableWidth = dimensions.width - dimensions.width * tableMult;
        TNumWidth = tableWidth * TNumColMult;
        nameWidth = tableWidth * nameColMult;
        emailWidth = tableWidth * emailColMult;
        statusWidth = tableWidth * statusColMult;
    };

    var data = [];

  /*needed for the material UI overlay displaying the student information
    const rowSelectionCallBack = (studentTNum) => {
        setSelectStudentTNum(studentTNum);
        return studentTNum;
    };
    */

    async function getData() {
       /* data = await actions.getStudents();
        return data;
        */
        var studentData = [
            {
            TNumber: "0000001",
            name: "John Doe",
            email: "jdoe@gmail.com",
            status: "ACTIVE"
        },
        {
            TNumber: "0000002",
            name: "John Doe",
            email: "jdoe@gmail.com",
            status: "DEACTIVATED"
        },
        {
            TNumber: "0000003",
            name: "John Doe",
            email: "jdoe@gmail.com",
            status: "ACTIVE"
        },

    ]
        return studentData;
    }

    async function getColumnDefs() {
        return [
            {
                headerName: "T Number", field: "TNumber", width: TNumWidth
            },
            {
                headerName: "Name", field: "name", width: nameWidth
            },
            {
                headerName: "Email", field: "email", width: emailWidth
            },
            {
                headerName: "Status", field: "status", width: statusWidth,
                cellStyle: (params) => {
                    return params.value === "ACTIVE" 
                    ? {color: "green", fontWeight: "bold"}
                    : {color: "red", fontWeight: "bold"};
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
                    rowHeight={rowHeight}
                    tableWidth={tableWidth}
                    getData={getData}
                    getColumnDefs={getColumnDefs}
                    getFrameworkComponents={getFrameworkComponents}
                    handleResize={handleResize}    
                />
            </div>
            <NavigationBar />
        </div>
    )


};

export default StudentsPage

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