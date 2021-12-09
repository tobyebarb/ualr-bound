import React, { useContext, useState, useEffect } from "react";
import "./MyNextProspectTable.css";
import { ReactComponent as UALRLogo } from "../../icons/UALR Logo.svg";
import { Redirect } from "react-router-dom";
import { Context } from "../../store/appContext";
import StudentDetails from "../../components/Table/components/StudentDetails/StudentDetails";
import { Modal } from "@material-ui/core";
import SRAProspectModal from "./components/SRAProspectModal/SRAProspectModal";

const MyNextProspectTable = (props) => {
  const { store, actions } = useContext(Context);

  const [studentSRAData, setStudentSRAData] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const handleUpdate = async () => {
    if (studentSRAData !== null) {
      actions.setProspectModalVisibility(true);
    }
  };

  useEffect(() => {
    let initialize = async () => {
      if (props.selectedTNumber) {
        try {
          const data = await actions.getStudentInfo(props.selectedTNumber);
          setStudentData(data);
          const sra = await actions.getStudentSRAInfo(props.selectedTNumber);
          setStudentSRAData(sra);
          console.log("DATA:", data);
          console.log("SRA:", sra);
        } catch (err) {
          console.log("Error", err);
          setStudentData(null);
          setStudentSRAData(null);
        }
      }
      return 1;
    };

    initialize();
  }, [props.selectedTNumber]);

  if (props.initialized) {
    return (
      <div className="prospect-table-container">
        <div id="top-section" className="prospect-section">
          <div className="prospect-text-container">
            <p>Next Prospect:</p>
            <p>{studentData ? studentData.name : "Loading..."}</p>
          </div>
          <div className="prospect-text-container">
            <p>Phone Number:</p>
            <p>{studentData ? studentData.phone : "Loading..."}</p>
          </div>
        </div>
        <div id="mid-section" className="prospect-section">
          <div className="prospect-text-container">
            <p>Term:</p>
            <p>{studentSRAData ? studentSRAData.term : "Loading..."}</p>
          </div>
          <div className="prospect-text-container">
            <p>Number of Times Called:</p>
            <p>
              {studentSRAData ? studentSRAData.numTimesCalled : "Loading..."}
            </p>
          </div>
          <div className="prospect-text-container">
            <p>Last Called On:</p>
            <p>
              {studentSRAData
                ? studentSRAData.dateCalled
                  ? studentSRAData.dateCalled
                  : "N/A"
                : "Loading"}
            </p>
          </div>
          <div className="prospect-text-container">
            <p>Previous Caller:</p>
            <p>
              {studentSRAData
                ? studentSRAData.prevCaller
                  ? studentSRAData.prevCaller
                  : "N/A"
                : "Loading"}
            </p>
          </div>
        </div>
        <div id="bot-section" className="prospect-section">
          <div className="prospect-text-container">
            <p>Previous Caller Response:</p>
            <p>
              {studentSRAData
                ? studentSRAData.callResponse
                  ? studentSRAData.callResponse
                  : "N/A"
                : "Loading"}
            </p>
          </div>
          <div className="prospect-text-container">
            <p>Previous Caller Notes:</p>
            <p>
              {studentSRAData
                ? studentSRAData.callNotes
                  ? studentSRAData.callNotes
                  : "N/A"
                : "Loading"}
            </p>
          </div>
        </div>
        <div className="prospect-update-button-container">
          <button onClick={handleUpdate} className="prospect-update-button">
            Update Call Info
          </button>
        </div>
        <SRAProspectModal selectedTNumber={props.selectedTNumber} />
      </div>
    );
  } else {
    return (
      <div className="prospect-table-container">
        <div className="prospect-table-text-noninit">
          <p>Welcome to your "MyNextProspect" dashboard!</p>
          <p>
            Click on the next button in the bottom-right to get your next
            prospect!
          </p>
        </div>

        <div className="ualr-logo">
          <UALRLogo />
        </div>
      </div>
    );
  }
};

export default MyNextProspectTable;
