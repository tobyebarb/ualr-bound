import React, { useContext, useState, useEffect, useRef } from "react";
import "./MyNextProspectPage.css";
import { Redirect } from "react-router-dom";
import { Context } from "../../store/appContext";
import StudentDetails from "../../components/Table/components/StudentDetails/StudentDetails";
import MyNextProspectTable from "../../components/MyNextProspectTable/MyNextProspectTable";
import { ReactComponent as NextButton } from "../../icons/NextButton.svg";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { FileUploader } from "../../App";
import styled from "styled-components";

const MyNextProspectPage = () => {
  const { store, actions } = useContext(Context);
  const [selectedTNumber, setSelectedTNumber] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const NextButtonWrapper = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;

    &:hover {
      svg path#arrow {
        animation: moveArrow 0.5s;
      }

      svg {
        animation: moveButton 1s;
      }
    }

    @keyframes moveButton {
      from {
        transform: translateX(0);
      }
      25% {
        transform: translateY(-10px);
      }
      50% {
        transform: translateY(10px);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes moveArrow {
      from {
        transform: translateX(0);
      }
      50% {
        transform: translateX(5px);
      }
      to {
        transform: translateX(0);
      }
    }
  `;

  const getNextProspect = async () => {
    if (isInitialized) {
      if (store.isProspectUpdated) {
        const res = await actions.getNextProspect(); // res is tNumber of next prospect

        if (res.msg === "No prospects avaliable") {
          alert("No prospects avaliable");
          return;
        }

        setSelectedTNumber(res.tNumber);
      } else {
        alert("Update student call data before getting next prospect.");
      }
      //Logic to get next prospect (get new selectedTNumber based on who hasn't been called/other factors)
    } else {
      const res = await actions.getNextProspect(); // res is JSON with next prospect's tnum

      if (res.msg === "No prospects avaliable") {
        alert("No prospects avaliable");
        return;
      }

      setIsInitialized(true);
      setSelectedTNumber(res.tNumber);
    }
  };

  const fileRef = useRef(null);
  useEffect(() => {
    if (store.ui.importIsVisible) {
      fileRef.current.openUploader();
    }
  }, [store.ui.importIsVisible]);

  //if (store.token && store.token !== "" && store.token !== null) {
  return (
    <div className="prospect-container">
      <div className="table-components">
        <MyNextProspectTable
          initialized={isInitialized}
          selectedTNumber={selectedTNumber}
        />
        <StudentDetails
          selectedTNumber={selectedTNumber}
          buttonOption={false}
        />
      </div>
      <NextButtonWrapper>
        <NextButton onClick={getNextProspect} />
      </NextButtonWrapper>
      <NavigationBar />
      <FileUploader ref={fileRef} />
    </div>
  );
  //   } else {
  //     console.log("Redirecting to login.");
  //     return <Redirect to="/login" />;
  //   }
};

export default MyNextProspectPage;
