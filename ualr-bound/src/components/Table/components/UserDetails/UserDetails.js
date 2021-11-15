import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { Context } from "../../../../store/appContext";
import "./UserDetails.css";

const UserDetails = (props) => {
  const { store, actions } = useContext(Context);
  const [userData, setUserData] = useState(null);
  const [selectedUID, setSelectedUID] = useState(null);

  const dataRef = useRef();

  const fetchData = async () => {
    try {
      const data = await actions.getUserInfo(props.selectedUID);
      setUserData(data);
    } catch (err) {
      console.log("Error", err);
      setUserData(null);
    }
    props.updateData();
  };

  useEffect(() => {
    if (props.selectedUID !== null) {
      // Add inner async function
      const fetchData = async () => {
        try {
          const data = await actions.getUserInfo(props.selectedUID);
          setUserData(data);
        } catch (err) {
          console.log("Error", err);
          setUserData(null);
        }
      };

      // Call function immediately
      fetchData();
    }
  }, [props.selectedUID]);

  // useEffect(() => {
  //   console.log("data: ", userData);
  // }, [userData]);

  const handleDeactivate = async () => {
    if (userData !== null) {
      var data = {
        activationStatus: userData.status === "ACTIVE" ? false : true,
      };
      const res = await actions.modifyUser(parseInt(userData.id), data);
      fetchData();
      return res;
    }
  };

  const handleModify = async () => {
    if (userData !== null) {
      //console.log("Modifying ", userData);
      actions.setModalVisibility(true);
    }
  };

  if (userData === null) {
    return (
      <div className="user-details-container">
        <div
          className="user-details"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <p>No User Selected.</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="user-details-container">
        <div className="user-details">
          <ul>
            <li>
              <p className="user-details-header">UID:</p>
              <p>{userData.id}</p>
            </li>
            <li>
              <p className="user-details-header">Username:</p>
              <p>{userData.username}</p>
            </li>
            <li>
              <p className="user-details-header">Name:</p>
              <p>{userData.name}</p>
            </li>
            <li>
              <p className="user-details-header">Email:</p>
              <p>{userData.email}</p>
            </li>
            <li>
              <p className="user-details-header">Access Level:</p>
              <p>{userData.accessLevel}</p>
            </li>
            <li>
              <p className="user-details-header">Created:</p>
              <p>{userData.time_created}</p>
            </li>
            <li>
              <p className="user-details-header">Activation Status:</p>
              <p>{userData.status}</p>
            </li>
          </ul>
        </div>
        <div className="button-container">
          {userData.status === "ACTIVE" ? (
            <button onClick={handleDeactivate}>Deactivate User</button>
          ) : (
            <button onClick={handleDeactivate}>Activate User</button>
          )}
          <button onClick={handleModify}>Modify User</button>
        </div>
      </div>
    );
  }
};

export default UserDetails;
