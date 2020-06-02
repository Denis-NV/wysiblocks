import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import Typography from "@material-ui/core/Typography";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";

const Header = (props) => {
  const { options } = props;
  const text = options.text || "";
  const size = options.size || "h1";

  const mapSizes = (opt_size) => {
    switch (opt_size) {
      case "h1":
        return "h1";
      case "h2":
        return "h2";
      case "h3":
        return "h3";
      case "h4":
        return "h4";
      case "h5":
        return "h5";
      default:
        return "h6";
    }
  };

  return (
    <MainContainer>
      <Typography variant={mapSizes(size)} component={mapSizes(size)} paragraph>
        {text}
      </Typography>
    </MainContainer>
  );
};

Header.propTypes = {};

export default CustomFieldHOC(Header);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  margin-top: 2rem;
`;
