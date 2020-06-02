import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

const steps = [1, 2, 3];

const ApplicationStepper = (props) => {
  const { active_index } = props;

  return (
    <MainContainer>
      <Stepper activeStep={active_index} className="application-progress">
        {steps.map((step) => {
          return (
            <Step key={step}>
              <StepLabel />
            </Step>
          );
        })}
      </Stepper>
    </MainContainer>
  );
};

ApplicationStepper.propTypes = {
  active_index: PropTypes.number.isRequired,
};

export default ApplicationStepper;

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .application-progress {
    background: none;
    max-width: 700px;
    margin: 0 auto 1.5rem auto;
  }

  .MuiStepLabel-iconContainer {
    padding-right: 0;
  }

  .MuiStepIcon-root {
    transform: scale(1.5);
  }

  .MuiStepIcon-text {
    fill: white;
  }

  .MuiStepConnector-alternativeLabel {
    top: 20px;
  }

  .MuiStepConnector-lineHorizontal {
    border-top-width: 5px;
  }

  .MuiStepIcon-root.MuiStepIcon-completed,
  .MuiStepIcon-root.MuiStepIcon-active {
    color: #78b62d;
  }
`;
