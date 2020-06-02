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
import CircularProgress from "@material-ui/core/CircularProgress";

// Utils
import { FORM_STEP, TERMS_STEP } from "../const";

// Components
import ApplicationStepper from "../.common/ApplicationStepper";

const ReviewStep = (props) => {
  const { stepRequestCb, getFieldsDataCb, call_data, cur_data } = props;
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
  const is_small = useMediaQuery(theme.breakpoints.down("xs"));

  React.useLayoutEffect(() => {
    if (!data_requested.current) {
      data_requested.current = true;

      if (fields.length === 0) getFieldsDataCb();
    }
  }, [getFieldsDataCb, fields.length]);

  // Render
  const getFilledDetails = () => {
    const filled_fields = [];

    const renderData = (id, type) => {
      // console.log(form[id]);
      switch (type) {
        case 4:
          return form[id] === "true" ? "Yes" : "No";
        case 8:
          return form[id].map((file) => file.orig).join(", ");
        case 13:
          const reg_items = form[id].selection.filter((opt) => opt !== "Other");

          return (
            reg_items.join(", ") +
            (form[id].other !== undefined
              ? reg_items.length > 0
                ? `, ${form[id].other}`
                : form[id].other
              : "")
          );
        case 16:
          return new Date(form[id].date).toDateString();
        default:
          return form[id];
      }
    };

    fields.forEach((field_data, index) => {
      const id = ((field_data.call_fieldsList || [])[0] || {}).id;

      if (form[id] && form[id] !== "") {
        const call_fields = field_data.call_fieldsList || [];
        const call_field = call_fields[0] || {};
        const type = call_field.type;

        filled_fields.push(
          <div key={index}>
            <Typography variant="body2">{field_data.title}</Typography>
            <Typography variant="body1" paragraph>
              {renderData(id, type)}
            </Typography>
          </div>
        );
      }
    });

    return filled_fields;
  };

  return (
    <MainContainer theme={theme}>
      <ApplicationStepper active_index={1} />
      <div className="review-header">
        <Typography variant="h1" paragraph className="step-title limited-width">
          Review application details
        </Typography>
        <Typography variant="body1" paragraph className="limited-width">
          Please review your application carefully, as you will not be able to
          edit your responses after submission.
        </Typography>
      </div>
      <Grid
        container
        spacing={3}
        className="gutterBottom"
        direction={is_small ? "column-reverse" : "row"}
      >
        <Grid item xs={12} sm={6} md={8}>
          <Typography variant="body2">Title of research project</Typography>
          <Typography variant="body1" paragraph>
            {form_title}
          </Typography>
          {getFilledDetails()}
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
              onMouseDown={() => stepRequestCb(FORM_STEP)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="primary"
              onMouseDown={() => stepRequestCb(TERMS_STEP)}
            >
              Continue
            </Button>
          </div>
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
          </Paper>
        </Grid>
      </Grid>
    </MainContainer>
  );
};

ReviewStep.propTypes = {
  call_data: PropTypes.object.isRequired,

  cur_data: PropTypes.object.isRequired,
  stepRequestCb: PropTypes.func.isRequired,
  getFieldsDataCb: PropTypes.func.isRequired,
};

export default ReviewStep;

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .review-header {
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: ${(p) => p.theme.spacing(3)}px;
    margin-bottom: ${(p) => p.theme.spacing(5)}px;
  }

  .small-basket-item {
    &:last-of-type {
      border-bottom: none;
    }
  }
`;
