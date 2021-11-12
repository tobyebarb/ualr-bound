import "./App.css";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import injectContext from "./store/appContext";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RegisterRequestPage from "./pages/RegisterRequestPage/RegisterRequestPage";
import EditCallersPage from "./pages/EditCallersPage/EditCallersPage";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Route exact path="/" component={DashboardPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/requests" component={RegisterRequestPage} />
        <Route exact path="/callers" component={EditCallersPage} />
      </div>
    </Router>
  );
};

export default injectContext(App);
