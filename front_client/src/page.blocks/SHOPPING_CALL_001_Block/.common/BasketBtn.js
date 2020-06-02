import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";

import Button from "@material-ui/core/Button";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask } from "@fortawesome/free-solid-svg-icons";

// Utils
import { BASKET_STEP } from "../const";

const BasketBtn = (props) => {
  const { className, stepRequestCb, basket } = props;

  // Hooks
  const theme = useTheme();

  return (
    <StyledBtn
      theme={theme}
      variant="outlined"
      className={className}
      fullWidth
      color="inherit"
      onMouseDown={(e) => stepRequestCb(BASKET_STEP)}
    >
      <FontAwesomeIcon icon={faFlask} size="lg" />
      <span>Your Selection</span>
      <span>
        {basket ? basket.length : 0}
        {` items`}
      </span>
    </StyledBtn>
  );
};

BasketBtn.propTypes = {
  stepRequestCb: PropTypes.func.isRequired,
  basket: PropTypes.array,
};

export default BasketBtn;

// #######################################
// CSS
// #######################################

const StyledBtn = styled(Button)`
  text-transform: none;
  border-color: #76797b;

  .MuiButton-label {
    display: flex;
    justify-content: space-between;
    font-size: 1.15rem;
    color: #76797b;

    span:last-child {
      font-weight: 400;
    }
  }
`;
