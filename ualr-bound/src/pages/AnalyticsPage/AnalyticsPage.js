import { jssPreset } from "@material-ui/styles";
import React, { useState, useContext, useRef, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AnalyticsModal from "../../components/Table/components/AnalyticsModal/AnalyticsModal";
import Table from "../../components/Table/Table";
import { Context } from "../../store/appContext";
import { getScrollbarSize } from "../EditCallersPage/EditCallersPage";
import "./AnalyticsPage.css";

const AnalyticsPage = () => {
    const{ store, actions} = useContext(Context);
    const [scrollbarWidth, setScrollbarWidth] = useState(0);
    
    const rowHeight = 100;

    /*percentage of the screen the table should occupy*/
    const tableMult = 0.7;
    const [tableWidth, setTableWidth] = useState(store.window.width * tableMult);

    /*percentage of the table columns depending on screen size*/
    const TNumColMult = store.window.width > 1650 ? 0.15 : 0.15;
    const nameColMult = store.window.width > 1650 ? 0.2 : 0.2;
    const callDisColMult = store.window.width > 1650 ? 0.2 : 0.2;
    const wasEmailedColMult = store.window.width > 1650 ? 0.15 : 0.15;
//onst dateEmailedColMult = store.window.width > 1650 ? 0.1 : 0.1;
    const wasCalledColMult = store.window.width > 1650 ? 0.15 : 0.15;
//    const dateCalledColMult = store.window.width > 1650 ? 0.1 : 0.1;
    const numCalledColMult = store.window.width > 1650 ? 0.15 : 0.15;
    const ethnicityColMult = store.window.width > 1650 ? 0.1 : 0.1;
    const sexColMult = store.window.width > 1650 ? 0.1 : 0.1;
    const majorColMult = store.window.width > 1650 ? 0.15 : 0.15;

    const tableRef = useRef();
    
    var data = [
        {
            tnum: "T012345",
            name: "John Doe",
            callDis: " ",
            wasEmailed: "yes",
            //dateEmailed: "06/12/2021",
            wasCalled: "yes",
            //dateCalled: "06/12/2021"
            timesCalled: "2",
            ethnicity: "black",
            sex: "M",
            major: "English"
        },
        {
            tnum: "T789554",
            name: "Lacy Jones",
            callDis: " ",
            wasEmailed: "yes",
            //dateEmailed: "06/12/2021",
            wasCalled: "yes",
            //dateCalled: "06/12/2021"
            timesCalled: "2",
            ethnicity: "White",
            sex: "F",
            major: "Psychology"
        },
        {
            tnum: "T698523",
            name: "Xing Lang",
            callDis: " ",
            wasEmailed: "no",
            //dateEmailed: "06/12/2021",
            wasCalled: "yes",
            //dateCalled: "06/12/2021"
            timesCalled: "1",
            ethnicity: "Asian",
            sex: "F",
            major: "Biology"
        },
        {
            tnum: "T846521",
            name: "Jason Smith",
            callDis: " ",
            wasEmailed: "no",
            //dateEmailed: "06/12/2021",
            wasCalled: "no",
            //dateCalled: "06/12/2021"
            timesCalled: "0",
            ethnicity: "Hispanic",
            sex: "M",
            major: "Archeology"
        },
    ];

    async function getData() {
        let analytics = data;

        return analytics;
    }

    async function getColumnDefs() {
        setTableWidth(store.window.width * tableMult);
        return [
            {
                headerName: "T Number",
                field: "tnum",
                width: store.window.width * tableMult * TNumColMult
            },
            {
                headerName: "Name",
                field: "name",
                width: store.window.width * tableMult * nameColMult
            },
            {
                headerName: "Call Disposition",
                field: "callDis",
                width: store.window.width * tableMult * callDisColMult
            },
            {
                headerName: "Was Emailed",
                field: "wasEmailed",
                width: store.window.width * tableMult * wasEmailedColMult
            },
            {
                headerName: "Was Called",
                field: "wasCalled",
                width: store.window.width * tableMult * wasCalledColMult
            },
            {
                headerName: "Times Called",
                field: "timesCalled",
                width: store.window.width * tableMult * numCalledColMult
            },
            {
                headerName: "Ethnicity",
                field: "ethnicity",
                width: store.window.width * tableMult * ethnicityColMult
            },
            {
                headerName: "Sex",
                field: "sex",
                width: store.window.width * tableMult * sexColMult
            },
            {
                headerName: "Major",
                field: "major",
                width: store.window.width * tableMult * majorColMult
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
        return(
            <div>
                <AnalyticsModal/>
            </div>
        )
    }


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
            <button
                onClick={openModal}
            >
                More Analytics
            </button>
            <NavigationBar/>
        </div>
    );


}

export default AnalyticsPage;