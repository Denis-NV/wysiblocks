import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";

const YesNoBool = (props) => {
  const { required, value_data, onValueChangeCb } = props;
  const value = value_data.val || "";

  return (
    <MainContainer>
      <RadioGroup
        name="yes_no"
        value={value}
        onChange={(e) => onValueChangeCb(e.target.value)}
      >
        <FormControlLabel
          value="true"
          control={<Radio required={required} />}
          label={<Typography variant="body2">Yes</Typography>}
        />

        <FormControlLabel
          value="false"
          control={<Radio />}
          label={<Typography variant="body2">No</Typography>}
        />
      </RadioGroup>
    </MainContainer>
  );
};

YesNoBool.propTypes = {};

export default CustomFieldHOC(YesNoBool);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .MuiFormControlLabel-root {
    margin-bottom: -9px;
  }
`;
