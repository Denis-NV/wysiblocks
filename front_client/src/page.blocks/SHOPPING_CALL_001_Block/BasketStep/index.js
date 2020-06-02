import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

// Utils
import { SEARCH_STEP, FORM_STEP, DETAILS_STEP } from "../const";

const BasketStep = (props) => {
  const { stepRequestCb, editBasketCb, itemViewCb, cur_data } = props;
  const basket = cur_data.basket || [];

  // Hooks
  const theme = useTheme();

  return (
    <MainContainer theme={theme}>
      <Typography variant="h1" paragraph className="step-title limited-width">
        Your selection
      </Typography>
      <Typography variant="body1" paragraph className="limited-width">
        Please review your selection before proceeding.
      </Typography>
      <ItemsConainer theme={theme}>
        {basket.map((item, index) => {
          return (
            <Paper key={index} elevation={3}>
              <div className="item-content">
                <Typography variant="h6">{item.name}</Typography>
                <div>
                  <Button
                    variant="outlined"
                    onMouseDown={() => {
                      itemViewCb(item.id);
                      stepRequestCb(DETAILS_STEP);
                    }}
                  >
                    View Details
                  </Button>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size="lg"
                    className="delete-btn"
                    onMouseDown={(e) => editBasketCb(item)}
                  />
                </div>
              </div>
            </Paper>
          );
        })}
      </ItemsConainer>
      <div className="nav-btns basket-btns">
        <Button
          variant="outlined"
          onMouseDown={() => stepRequestCb(SEARCH_STEP)}
        >
          Find more reagents
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={basket.length === 0}
          onMouseDown={() => stepRequestCb(FORM_STEP)}
        >
          Proceed with Application
        </Button>
      </div>
    </MainContainer>
  );
};

BasketStep.propTypes = {
  cur_data: PropTypes.object.isRequired,
  stepRequestCb: PropTypes.func.isRequired,
  itemViewCb: PropTypes.func.isRequired,
  editBasketCb: PropTypes.func.isRequired,
};

export default BasketStep;

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .nav-btns.basket-btns {
    justify-content: flex-end;

    @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
      justify-content: space-between;
    }

    button {
      margin-left: 1rem;

      @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
        margin-left: 0;
      }
    }
  }
`;

const ItemsConainer = styled.div`
  margin-top: ${(p) => p.theme.spacing(4)}px;
  margin-bottom: ${(p) => p.theme.spacing(5)}px;

  .MuiPaper-root {
    padding: ${(p) => p.theme.spacing(2)}px;
    margin-bottom: ${(p) => p.theme.spacing(1)}px;

    h6 {
      text-transform: uppercase;
      font-weight: 600;
    }

    .item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        margin-right: ${(p) => p.theme.spacing(2)}px;
      }
    }

    .delete-btn {
      cursor: pointer;
    }
  }
`;
