import React, { useState, useContext, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Table from "../../components/Table/Table";
import { Context } from "../../store/appContext";
import "./RegisterRequestPage.css";

const RegisterRequestPage = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="register-request-container">
      <Table />
      <NavigationBar />
    </div>
  );
};

export default RegisterRequestPage;
