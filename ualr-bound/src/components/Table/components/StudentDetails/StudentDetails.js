import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { Context } from "../../../../store/appContext";
import "./StudentDetails.css";

const StudentDetails = (props) => {
  const { store, actions } = useContext(Context);
  const [studentData, setStudentData] = useState(null);

  const dataRef = useRef();

  const fetchData = async () => {
    try {
      const data = await actions.getStudents(props.selectedUID);
      setStudentData(data);
    } catch (err) {
      console.log("Error", err);
      setStudentData(null);
    }
    props.updateData();
  };

  useEffect(() => {
    if (props.selectedUID !== null) {
      // Add inner async function
      const fetchData = async () => {
        try {
          const data = await actions.getStudents(props.selectedUID);
          setStudentData(data);
        } catch (err) {
          console.log("Error", err);
          setStudentData(null);
        }
      };

      // Call function immediately
      fetchData();
    }
  }, [props.selectedUID]);

  useEffect(() => {
    console.log("data: ", studentData);
  }, [studentData]);

//   const handleDeactivate = async () => {
//     if (studentData !== null) {
//       var data = {
//         activationStatus: studentData.status === "ACTIVE" ? false : true,
//       };
//       const res = await actions.modifyUser(parseInt(studentData.id), data);
//       fetchData();
//       return res;
//     }
//   };

//   const handleModify = async () => {
//     if (studentData !== null) {
//       console.log("Modifying ", studentData);
//       actions.setModalVisibility(true);
//     }
//   };

// useEffect (() => {
//     var studentData = {
//         "tnum": "T00032343",
//         "fullName": "Jonathan Alan Haskett",
//         "level": "Senior",
//         "primaryProgram": "Computer Science",
//         "primaryCollege": "EIT",
//         "primaryDepartment": "Computer Science",
//         "streetAddress1": "4710 Sam Peck Rd",
//         "streetAddress2": "Apt 6411",
//         "streetAddress3": null,
//         "city": "Little Rock",
//         "state": "Arkansas",
//         "zipCode": "72225",
//         "phoneAreaCode": "501",
//         "phoneNumber": "555-7777",
//         "phoneExtension": null,
//         "email": "jhaskett@gmail.com",
//         "ualrEmail": "jhaskett@ualr.edu",
//         "ethnicity": "white",
//         "sex": "male",
//         "admissionType": "Transfer",
//         "studentType": "Terrible"
//     }
//     setStudentData(studentData)
// }, [])

  if (studentData === null) {
    return (
      <div className="student-details-container">
        <div
          className="student-details"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <p>No User Selected.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="student-details-container">
        <div className="student-details">
          <ul>
            <li>
              <p className="student-details-header">TNumber:</p>
              <p>{studentData.tnum}</p>
            </li>
            <li>
              <p className="student-details-header">FullName:</p>
              <p>{studentData.fullName}</p>
            </li>
            <li>
              <p className="student-details-header">Level:</p>
              <p>{studentData.level}</p>
            </li>
            <li>
              <p className="student-details-header">PrimaryProgram:</p>
              <p>{studentData.primaryProgram}</p>
            </li>
            <li>
              <p className="student-details-header">PrimaryCollege:</p>
              <p>{studentData.primaryCollege}</p>
            </li>
            <li>
              <p className="student-details-header">PrimaryDepartment:</p>
              <p>{studentData.primaryDepartment}</p>
            </li>
            <li>
              <p className="student-details-header">StreetAddress1:</p>
              <p>{studentData.streetAddress1}</p>
            </li>
            <li>
              <p className="student-details-header">StreetAddress2:</p>
              <p>{studentData.streetAddress2}</p>
            </li>
            <li>
              <p className="student-details-header">StreetAddress3:</p>
              <p>{studentData.streetAddress3}</p>
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
              <p className="student-details-header">ZipCode:</p>
              <p>{studentData.zipCode}</p>
            </li>
            <li>
              <p className="student-details-header">PhoneAreaCode:</p>
              <p>{studentData.phoneAreaCode}</p>
            </li>
            <li>
              <p className="student-details-header">PhoneNumber:</p>
              <p>{studentData.phoneNumber}</p>
            </li>
            <li>
              <p className="student-details-header">PhoneExtension:</p>
              <p>{studentData.phoneExtension}</p>
            </li>
            <li>
              <p className="student-details-header">Email:</p>
              <p>{studentData.email}</p>
            </li>
            <li>
              <p className="student-details-header">UALREmail:</p>
              <p>{studentData.ualrEmail}</p>
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
              <p className="student-details-header">AdmissionType:</p>
              <p>{studentData.admissionType}</p>
            </li>
            <li>
              <p className="student-details-header">StudentType:</p>
              <p>{studentData.studentType}</p>
            </li>
          </ul>
        </div>
        <div className="button-container">
        </div>
      </div>
    );
  }
};

export default StudentDetails;
