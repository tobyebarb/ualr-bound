import React, { useContext, useEffect } from "react";
import "./DashboardPage.css";
import { Redirect, useHistory } from "react-router-dom";
import * as constants from "../../utils/Constants";
import { Context } from "../../store/appContext";
import NavigationBar from "../../components/NavigationBar/NavigationBar";

const DashboardPage = () => {
  const { store, actions } = useContext(Context);
  const history = useHistory();

  const focusColor = "#4c212c";

  useEffect(() => {
    if (store.token && store.token !== "" && store.token !== undefined)
      actions.getMessage();
  }, [store.token]);

  if (store.token && store.token !== "" && store.token !== undefined) {
    return (
      <div className="dashboard-container">
        <h1>UALR Bound Dashboard :)</h1>
        <h2>{store.message === null ? "Loading..." : store.message}</h2>
        <button onClick={actions.logout}>Logout</button>
        <NavigationBar />
      </div>
    );
  } else {
    return <Redirect to="/login" />;
  }
};

export default DashboardPage;
