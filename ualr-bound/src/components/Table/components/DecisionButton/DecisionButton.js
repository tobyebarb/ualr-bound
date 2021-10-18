import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import CheckmarkIcon from "../../../../icons/CheckmarkIcon";
import CrossmarkIcon from "../../../../icons/CrossmarkIcon";
import { ColDef, ColGroupDef } from "ag-grid-community";
import { Context } from "../../../../store/appContext";
import "./DecisionButton.css";

const DecisionButton = (props) => {
  const { store, actions } = useContext(Context);
  const [buttonHeight, setButtonHeight] = useState();

  const buttonRef = useRef(null);
  const index = props.params.rowIndex;
  const data = props.params.data;

  const onCheckClick = () => {
    console.log("yes", data);
    props.updateRows(data, true);
  };

  const onCrossClick = () => {
    console.log("no", data);
    props.updateRows(data, false);
  };

  useEffect(() => {
    setButtonHeight(buttonRef.current.offsetHeight);
    actions.setDecisionBtnHeight(buttonHeight);
  }, []);

  return (
    <div className="decision-button-container" ref={buttonRef}>
      <CheckmarkIcon onClick={onCheckClick} />
      <div className="decision-button-divider"></div>
      <CrossmarkIcon onClick={onCrossClick} />
    </div>
  );
};

export default DecisionButton;
