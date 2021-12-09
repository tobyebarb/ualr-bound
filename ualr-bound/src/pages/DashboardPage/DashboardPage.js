import React, { useContext, useEffect, useRef } from "react";
import "./DashboardPage.css";
import { Redirect, useHistory } from "react-router-dom";
import * as constants from "../../utils/Constants";
import { Context } from "../../store/appContext";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { FileUploader } from "../../App";

const DashboardPage = () => {
  const { store, actions } = useContext(Context);
  const history = useHistory();

  const focusColor = "#4c212c";

  const fileRef = useRef(null);

  useEffect(() => {
    if (store.ui.importIsVisible) {
      fileRef.current.openUploader();
    }
  }, [store.ui.importIsVisible]);

  useEffect(() => {
    if (store.token && store.token !== "" && store.token !== undefined)
      actions.getMessage();
  }, [store.token]);

  if (
    store.token &&
    store.token !== "" &&
    store.token !== undefined &&
    store.user.access_level !== "Caller"
  ) {
    return (
      <div className="dashboard-container">
        <h1>UALR Bound Dashboard :)</h1>
        <h2>{store.message === null ? "Loading..." : store.message}</h2>
        <button onClick={actions.logout}>Logout</button>
        <NavigationBar />

        <FileUploader ref={fileRef} />
      </div>
    );
  } else if (
    store.token &&
    store.token !== "" &&
    store.token !== undefined &&
    store.user.access_level === "Caller"
  ) {
    return <Redirect to="/prospects" />;
  } else {
    return <Redirect to="/login" />;
  }
};

export default DashboardPage;
