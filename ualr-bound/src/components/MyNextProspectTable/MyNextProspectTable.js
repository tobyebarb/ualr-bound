import React, { useContext, useState, useEffect } from "react";
import "./MyNextProspectTable.css";
import ualrLogo from "../../icons/UALR Logo.svg";
import { Redirect } from "react-router-dom";
import { Context } from "../../store/appContext";
import StudentDetails from "../../components/Table/components/StudentDetails/StudentDetails";

const MyNextProspectTable = (props) => {
  const { store, actions } = useContext(Context);

  const [studentSRAData, setStudentSRAData] = useState(null);

  var data = {
    name: "Toby Ebarb",
    phone: "(501)410-3655",
    term: "SPRING 2022",
    numTimesCalled: "1",
    dateCalled: "2021-10-11",
    prevCaller: "Aaron Murtishaw",
    callResponse: "RESPONDED?",
    callNotes:
      "Toby was very mean and didn't respond to any questions. What an asshole.",
  };

  useEffect(() => {
    setStudentSRAData(data);
  }, []);

  if (props.initialized) {
    return (
      <div className="prospect-table-container">
        <div className="prospect-top-section">
          <div className="prospect-top-text-container">
            <p>Next Prospect:</p>
            <p>{studentSRAData.name}</p>
          </div>
          <div className="prospect-top-text-container">
            <p>Phone Number:</p>
            <p>{studentSRAData.phone}</p>
          </div>
        </div>
        <div className="prospect-mid-section">
          <div className="prospect-mid-text-container">
            <p>Term:</p>
            <p>{studentSRAData.term}</p>
          </div>
          <div className="prospect-mid-text-container">
            <p>Number of Times Called:</p>
            <p>{studentSRAData.numTimesCalled}</p>
          </div>
          <div className="prospect-mid-text-container">
            <p>Last Called On:</p>
            <p>
              {studentSRAData.dateCalled ? studentSRAData.dateCalled : "N/A"}
            </p>
          </div>
          <div className="prospect-mid-text-container">
            <p>Next Prospect:</p>
            <p>
              {studentSRAData.prevCaller ? studentSRAData.prevCaller : "N/A"}
            </p>
          </div>
        </div>
        <div className="prospect-bottom-section">
          <div className="prospect-bottom-text-container">
            <p>Caller Response:</p>
            <p>{studentSRAData.callResponse}</p>
          </div>
          <div className="prospect-bottom-text-container">
            <p>Caller Notes:</p>
            <p>{studentSRAData.callNotes}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="prospect-table-container">
        <p>Welcome to your "MyNextProspect" dashboard!</p>
        <p>
          Click on the next button in the bottom-right to get your next
          prospect!
        </p>
      </div>
    );
  }
};

export default MyNextProspectTable;
