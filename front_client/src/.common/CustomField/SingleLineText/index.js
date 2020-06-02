import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";

const SingleLineText = (props) => {
  const { required, value_data, onValueChangeCb } = props;
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
        //placeholder="Single-line"
        onChange={(e) => onValueChangeCb(e.target.value)}
      />
    </MainContainer>
  );
};

SingleLineText.propTypes = {};

export default CustomFieldHOC(SingleLineText);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div``;
