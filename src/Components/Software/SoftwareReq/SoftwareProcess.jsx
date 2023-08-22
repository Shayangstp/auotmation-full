import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {  useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { selectSoftwareProcess } from "../../Slices/softwareSlice";

const SoftwareProcess = () => {
  const softwareProcess = useSelector(selectSoftwareProcess);
  return (
    <Container
      fluid
      className="d-flex flex-column flex-md-row justify-content-center align-items-center"
    >
      {softwareProcess &&
        softwareProcess.map((item, index) => {
          const lastItem = index === softwareProcess.length - 1;
          return (
            <div key={index} className="d-flex flex-column flex-md-row me-md-5 justify-Content-center align-items-center">
              <div className="d-flex flex-column justify-Content-center mb-1 mb-md-3 me-md-2">
                <div className="mb-2 font10">{item.status}</div>
                <div className="font10">{item.toPersonName}</div>
              </div>
              {!lastItem && softwareProcess.length > 1 && (
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="my-2 my-md-0 arrow-icon"
                />
              )}
            </div>
          );
        })}
    </Container>
  );
};

export default SoftwareProcess;
