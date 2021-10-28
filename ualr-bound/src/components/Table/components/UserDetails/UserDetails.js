import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { Context } from "../../../../store/appContext";
import "./UserDetails.css";

const UserDetails = (props) => {
  const { store, actions } = useContext(Context);
  const [userData, setUserData] = useState([]);
  const [selectedUID, setSelectedUID] = useState(null);
  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const previousWidthAndHeight = usePrevious(selectedUID);
  var data = [];

  let getUserData = async () => {
    var selectedUserData = await actions.getUserInfo(selectedUID);
    return selectedUserData;
  };

  useEffect(() => {
    setSelectedUID(props.selectedUID);
  }, [props.selectedUID]);

  // useEffect(() => {
  //   if (selectedUID !== null) data = getUserData();
  //   setUserData(data);
  //   console.log(userData);
  // }, [selectedUID]);

  return (
    <div className="user-details-container">
      <div className="user-details">
        <ul>
          <li>{}</li>
        </ul>
      </div>
      <div className="button-container">
        <button>Deactivate User</button>
        <button>Modify User</button>
      </div>
    </div>
  );
};

export default UserDetails;
