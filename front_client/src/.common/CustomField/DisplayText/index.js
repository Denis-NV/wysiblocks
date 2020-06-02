import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import Typography from "@material-ui/core/Typography";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";

const DisplayText = (props) => {
  const { options } = props;
  const text = options.text || "";

  return (
    <MainContainer>
      <Typography variant="body1" paragraph>
        {text}
      </Typography>
    </MainContainer>
  );
};

DisplayText.propTypes = {};

export default CustomFieldHOC(DisplayText);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  margin-top: 2rem;
`;
