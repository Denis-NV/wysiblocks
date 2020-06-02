import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";

const MultiLineText = (props) => {
  const { required, options, value_data, onValueChangeCb } = props;
  const value = value_data.val || "";

  return (
    <MainContainer>
      <TextField
        variant="outlined"
        color="secondary"
        required={required}
        fullWidth
        margin="dense"
        value={value}
        //placeholder="Multi-line. Press return for next line"
        multiline
        onChange={(e) => {
          let new_str = e.target.value;

          if (options.max) new_str = new_str.slice(0, options.max);

          onValueChangeCb(new_str);
        }}
      />
      {options.max && (
        <Typography variant="caption" component="p" align="right">{`${
          options.max - value.length
        }`}</Typography>
      )}
    </MainContainer>
  );
};

MultiLineText.propTypes = {};

export default CustomFieldHOC(MultiLineText);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  textarea {
    min-height: 38px;
  }
`;
