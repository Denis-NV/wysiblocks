import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

// Utils
import { BASKET_STEP, REVIEW_STEP } from "../const";
import { useKeycloak } from "@react-keycloak/web";

// Components
import CustomField from "../../../.common/CustomField";
import ApplicationStepper from "../.common/ApplicationStepper";

// Default
const ApplicationFormStep = (props) => {
  const {
    stepRequestCb,
    getFieldsDataCb,
    editFormCb,
    call_data,
    block_data,
    cur_data,
  } = props;
  const basket = cur_data.basket || [];
  const form_title = cur_data.form_title || "";
  const form = cur_data.form || {};
  const call = call_data.callItem || {};
  const fields = call.call_fields_assocList || [];
  const ui_state = cur_data.ui_state || {};
  const is_loading = ui_state.form || false;

  // Hooks
  const theme = useTheme();
  const data_requested = React.useRef();
  const [keycloak] = useKeycloak();
  const is_small = useMediaQuery(theme.breakpoints.down("xs"));

  React.useLayoutEffect(() => {
    if (!data_requested.current) {
      data_requested.current = true;

      if (fields.length === 0) getFieldsDataCb();
    }
  }, [getFieldsDataCb, fields.length]);

  // Render
  return (
    <MainContainer theme={theme}>
      <ApplicationStepper active_index={0} />
      <Typography variant="h1" paragraph className="step-title limited-width">
        Research Proposal
      </Typography>
      <Grid
        container
        spacing={3}
        className="gutterBottom"
        direction={is_small ? "column-reverse" : "row"}
      >
        <Grid item xs={12} sm={6} md={8} className="fields-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              stepRequestCb(REVIEW_STEP);
            }}
          >
            <Typography variant="body2">Title of research project *</Typography>
            <TextField
              className="paragraph"
              required
              variant="outlined"
              color="secondary"
              fullWidth
              margin="dense"
              value={form_title}
              onChange={(e) => editFormCb(-1, e.target.value)}
            />
            {fields.map((field_data, index) => {
              const id = ((field_data.call_fieldsList || [])[0] || {}).id;

              return (
                <CustomField
                  className="paragraph"
                  key={index}
                  value_data={{ val: form[id] }}
                  field_data={field_data}
                  block_data={block_data}
                  id_token={keycloak.idToken}
                  onValueChangeCb={(value) => editFormCb(id, value)}
                />
              );
            })}
            {is_loading && (
              <div className="progress-container">
                <CircularProgress />
              </div>
            )}
            <br />
            <br />
            <div className="nav-btns">
              <Button
                variant="outlined"
                onMouseDown={() => stepRequestCb(BASKET_STEP)}
              >
                Back
              </Button>
              {fields.length > 0 && (
                <Button variant="contained" color="primary" type="submit">
                  Continue
                </Button>
              )}
            </div>
          </form>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} className="small-basket">
            <Typography variant="h6" paragraph>
              Selected reagents
            </Typography>
            {basket.map((item, index) => {
              return (
                <div key={index} className="paragraph small-basket-item">
                  <Typography variant="h6" paragraph>
                    {item.name}
                  </Typography>
                </div>
              );
            })}
            <Button
              variant="outlined"
              fullWidth
              onMouseDown={() => stepRequestCb(BASKET_STEP)}
            >
              Edit Selection
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MainContainer>
  );
};

ApplicationFormStep.propTypes = {
  call_data: PropTypes.object.isRequired,
  cur_data: PropTypes.object.isRequired,
  block_data: PropTypes.object.isRequired,
  stepRequestCb: PropTypes.func.isRequired,
  getFieldsDataCb: PropTypes.func.isRequired,
  editFormCb: PropTypes.func.isRequired,
};

export default ApplicationFormStep;

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .MuiButton-label {
    text-transform: none;
  }

  h6.MuiTypography-h6 {
    font-size: 26px;
    color: #303030;
  }
`;
