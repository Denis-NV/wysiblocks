import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

// Utils
import { REVIEW_STEP } from "../const";

// Components
import ApplicationStepper from "../.common/ApplicationStepper";
import Termstext from "./TermsText";

const TermsStep = (props) => {
  const { stepRequestCb, onSetValueCb, onSubmitCb, cur_data } = props;
  const submitted = cur_data.submitted;
  const errors = cur_data.submit_errors;
  const app_id = cur_data.app_id;
  const terms_agreed = cur_data.terms_agreed || false;
  const ui_state = cur_data.ui_state || {};
  const is_loading = ui_state.submit || false;

  // Hooks
  const theme = useTheme();

  return (
    <MainContainer theme={theme}>
      <ApplicationStepper active_index={terms_agreed ? 3 : 2} />
      {is_loading ? (
        <div className="progress-container">
          <CircularProgress />
        </div>
      ) : (
        <>
          {!submitted && !errors ? (
            <>
              <Typography
                variant="h1"
                paragraph
                className="step-title limited-width"
              >
                Terms of use
              </Typography>
              <br />
              <Grid container spacing={3} className="gutterBottom">
                <Grid item xs={12} md={8}>
                  <Termstext className="t_of_u" />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="terms"
                        checked={terms_agreed}
                        onChange={(e) =>
                          onSetValueCb("terms_agreed", e.target.checked)
                        }
                      />
                    }
                    label="I agree to the terms"
                  />
                  <br />
                  <br />
                  <div className="nav-btns">
                    <Button
                      variant="outlined"
                      onMouseDown={() => stepRequestCb(REVIEW_STEP)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!terms_agreed}
                      //disabled
                      onMouseDown={onSubmitCb}
                    >
                      Finish
                    </Button>
                  </div>
                </Grid>
                <Grid item xs={12} md={4}></Grid>
              </Grid>
            </>
          ) : (
            <>
              {submitted ? (
                <div className="feedback-container success-feedback">
                  <Typography variant="h4" paragraph align="center">
                    Submitted successfully
                  </Typography>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    size="6x"
                    color="#78b62d"
                    className="paragraph"
                  />
                  <Typography
                    variant="button"
                    paragraph
                  >{`APPID ${app_id}`}</Typography>
                  <Typography variant="body1" paragraph align="center">
                    Your request has been sent to the COVID-19 Protein
                    Production Consortium for review, and we will keep you
                    informed of its progress.
                    <br />
                    <br />
                    Please keep a note of your application ID (AAPID) for any
                    future correspondence.
                  </Typography>
                  <br />
                  <br />
                  <Button
                    variant="outlined"
                    onMouseDown={(e) => onSetValueCb()}
                    className="paragraph"
                  >
                    Start a New Search
                  </Button>
                  <br />
                  <Typography variant="body1" paragraph align="center">
                    <Link href="https://covid19proteinportal.org/">
                      Go back to the main site
                    </Link>
                  </Typography>
                </div>
              ) : (
                <div>
                  <div className="feedback-container failure-feedback">
                    <Typography variant="h4" paragraph align="center">
                      Oops, something went wrong.
                    </Typography>
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      size="6x"
                      color="#f44336"
                      className="paragraph"
                    />
                    <Typography variant="body1" paragraph align="center">
                      Don't worry. Your applcation had been saved on your
                      computer, though hasn't been submitted yet. We are sorry
                      for that.
                      <br />
                      <br />
                      Please, try coming back and re-submitting it later, or
                      contact{" "}
                      <Link
                        target="_blank"
                        href="mailto:contact@covid19proteinportal.org"
                      >
                        help
                      </Link>
                      .
                    </Typography>
                    <br />
                    <br />
                    <Button
                      variant="outlined"
                      onMouseDown={() => {
                        onSetValueCb("submit_errors", null);
                        stepRequestCb(REVIEW_STEP);
                      }}
                      className="paragraph"
                    >
                      Review Your Application
                    </Button>
                    <br />
                    <Typography variant="body1" paragraph align="center">
                      <Link href="https://covid19proteinportal.org/">
                        Go back to the main site
                      </Link>
                    </Typography>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </MainContainer>
  );
};

TermsStep.propTypes = {
  cur_data: PropTypes.object.isRequired,
  stepRequestCb: PropTypes.func.isRequired,
  onSetValueCb: PropTypes.func.isRequired,
  onSubmitCb: PropTypes.func.isRequired,
};

export default TermsStep;

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .feedback-container {
    padding-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 780px;
    margin: 0 auto;

    .MuiTypography-h4 {
      font-size: 37px;
    }

    .MuiTypography-button {
      font-size: 26px;
    }

    .MuiButton-label {
      font-size: 21px;
      text-transform: none;
      color: #76797b;
    }
  }

  .success-feedback {
    .MuiTypography-h4 {
      color: #78b62d;
    }
  }

  .failure-feedback {
    .MuiTypography-h4 {
      color: #f44336;
    }
  }

  .progress-container {
    height: 50vh;
  }

  .MuiTypography-body1.MuiFormControlLabel-label {
    font-size: 1rem;
  }

  .t_of_u {
  }
`;
