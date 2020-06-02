import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";

import "react-calendar/dist/Calendar.css";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";
import NumberFormat from "react-number-format";
import Calendar from "react-calendar";

const DateTime = (props) => {
  const { required, type, value_data, onValueChangeCb } = props;
  const value = value_data.val || {};
  const value_date = value.date ? new Date(value.date) : null;
  const value_txt = value_date
    ? value_date.getDate().toString().padStart(2, 0) +
      (value_date.getMonth() + 1).toString().padStart(2, 0) +
      value_date.getFullYear().toString()
    : "";

  value.type = type;

  // Hooks
  const theme = useTheme();
  const [show_cal, setShowCal] = React.useState(false);

  // Handlers
  const handleFieldInput = (values) => {
    if (values.value.length === 8) {
      const date = parseInt(values.value.slice(0, 2));
      const month = parseInt(values.value.slice(2, 4)) - 1;
      const year = parseInt(values.value.slice(4, 8));

      onValueChangeCb({ ...value, date: new Date(year, month, date) });
    }
  };

  const onCalendarChange = (date) => {
    onValueChangeCb({ ...value, date });
    setShowCal(false);
  };

  // Render
  return (
    <MainContainer theme={theme}>
      <ClickAwayListener onClickAway={(e) => setShowCal(false)}>
        <div>
          <div className="date-input">
            <NumberFormat
              required={required}
              variant="outlined"
              color="secondary"
              required={required}
              margin="dense"
              customInput={TextField}
              value={value_txt}
              onValueChange={handleFieldInput}
              format="##/##/####"
              placeholder="DD/MM/YYYY"
              mask={["D", "D", "M", "M", "Y", "Y", "Y", "Y"]}
            />
            <div
              className="calendar-btn MuiFormControl-marginDense"
              onMouseDown={(e) => setShowCal(!show_cal)}
            >
              <FontAwesomeIcon icon={faCalendarAlt} size="lg" color="#FFFFFF" />
            </div>
          </div>
          <div
            className="calendar-container"
            style={{ display: show_cal ? "block" : "none" }}
          >
            <Calendar
              onChange={onCalendarChange}
              value={value_date}
              key={Math.random()}
            />
          </div>
        </div>
      </ClickAwayListener>
    </MainContainer>
  );
};

DateTime.propTypes = {};

export default CustomFieldHOC(DateTime);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  position: relative;
  display: inline-block;

  .MuiOutlinedInput-root {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  .date-input {
    display: inline-flex;
  }

  .calendar-btn {
    background-color: ${(p) => p.theme.palette.primary.main};
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-top-right-radius: ${(p) => p.theme.shape.borderRadius}px;
    border-bottom-right-radius: ${(p) => p.theme.shape.borderRadius}px;
  }

  .calendar-container {
    position: absolute;
    right: 0;
    z-index: 1;
    /* min-width: 235px; */
    max-width: 300px;
    /* width: min-content; */
    width: 235px;
  }

  .react-calendar {
    width: 100%;
    border-radius: ${(p) => p.theme.shape.borderRadius}px;

    .react-calendar__tile--now {
      background-color: ${(p) => p.theme.palette.grey[100]};
      color: ${(p) => p.theme.palette.grey[600]};
    }

    .react-calendar__tile--now:hover {
      background-color: ${(p) => p.theme.palette.grey[300]};
    }
  }
`;
