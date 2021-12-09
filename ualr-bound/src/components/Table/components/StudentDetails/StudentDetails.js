import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";
import { Context } from "../../../../store/appContext";
import "./StudentDetails.css";

const StudentDetails = React.forwardRef((props, ref) => {
  const { store, actions } = useContext(Context);
  const [studentData, setStudentData] = useState(null);

  const dataRef = useRef();

  const fetchData = async () => {
    try {
      const data = await actions.getStudentInfo(props.selectedTNumber);
      setStudentData(data);
    } catch (err) {
      console.log("Error", err);
      setStudentData(null);
    }
    if (props.updateData) props.updateData();
  };

  useImperativeHandle(ref, () => ({
    fetchData,
  }));

  useEffect(() => {
    if (props.selectedTNumber !== null) {
      // Add inner async function
      const fetchData = async () => {
        try {
          const data = await actions.getStudentInfo(props.selectedTNumber);
          setStudentData(data);
        } catch (err) {
          console.log("Error", err);
          setStudentData(null);
        }
      };

      // Call function immediately
      fetchData();
    }
  }, [props.selectedTNumber]);

  const handleDeactivate = async () => {
    if (studentData !== null) {
      var data = {
        status: studentData.status === "ACTIVE" ? false : true,
      };
      const res = await actions.modifyStudent(studentData.tNumber, data);
      fetchData();
      return res;
    }
  };

  const handleModify = async () => {
    if (studentData !== null) {
      //console.log("Modifying ", studentData);
      actions.setStudentModalVisibility(true);
    }
  };

  if (studentData === null) {
    return (
      <div className="student-details-container">
        <div
          className="student-details"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <p>No Student Selected.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="student-details-container">
        <div className="student-details">
          <ul>
            <li>
              <p className="student-details-header">T Number:</p>
              <p>{studentData.tNumber}</p>
            </li>
            <li>
              <p className="student-details-header">Full Name:</p>
              <p>{studentData.name}</p>
            </li>
            <li>
              <p className="student-details-header">Level:</p>
              <p>{studentData.level}</p>
            </li>
            <li>
              <p className="student-details-header">Program:</p>
              <p>{studentData.program}</p>
            </li>
            <li>
              <p className="student-details-header">College:</p>
              <p>{studentData.college}</p>
            </li>
            <li>
              <p className="student-details-header">Primary Department:</p>
              <p>{studentData.department}</p>
            </li>
            <li>
              <p className="student-details-header">Decision:</p>
              <p>{studentData.decision}</p>
            </li>
            <li>
              <p className="student-details-header">Admit Date:</p>
              <p>{studentData.admitDate}</p>
            </li>
            <li>
              <p className="student-details-header">Street Address:</p>
              <p>{studentData.address}</p>
            </li>
            <li>
              <p className="student-details-header">City:</p>
              <p>{studentData.city}</p>
            </li>
            <li>
              <p className="student-details-header">State:</p>
              <p>{studentData.state}</p>
            </li>
            <li>
              <p className="student-details-header">Zip Code:</p>
              <p>{studentData.zip}</p>
            </li>
            <li>
              <p className="student-details-header">Phone:</p>
              <p>{studentData.phone}</p>
            </li>
            <li>
              <p className="student-details-header">Email:</p>
              <p>{studentData.email}</p>
            </li>
            <li>
              <p className="student-details-header">UALR Email:</p>
              <p>{studentData.emailSchool}</p>
            </li>
            <li>
              <p className="student-details-header">Ethnicity:</p>
              <p>{studentData.ethnicity}</p>
            </li>
            <li>
              <p className="student-details-header">Sex:</p>
              <p>{studentData.sex}</p>
            </li>
            <li>
              <p className="student-details-header">Admission Type:</p>
              <p>{studentData.admissionType}</p>
            </li>
            <li>
              <p className="student-details-header">Student Type:</p>
              <p>{studentData.studentType}</p>
            </li>
            <li>
              <p className="student-details-header">Status:</p>
              <p>{studentData.status}</p>
            </li>
          </ul>
        </div>
        {props.buttonOption ? (
          <div className="student-button-container">
            {studentData.status === "ACTIVE" ? (
              <button onClick={handleDeactivate}>Deactivate Student</button>
            ) : (
              <button onClick={handleDeactivate}>Activate Student</button>
            )}
            <button onClick={handleModify}>Modify Student</button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
});

export default StudentDetails;
