import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const ContentWarning = ({ warning_data, actionCallback, closeCallback }) => {
  // Hooks
  const theme = useTheme();

  // Handlers
  const onButtonPressed = save => event => {
    actionCallback(save);
    closeCallback();
  };

  return (
    <Container theme={theme}>
      <Message theme={theme}>
        <Typography variant="h4" align="center" gutterBottom>
          {warning_data.title}
        </Typography>
        {warning_data.paragraphs.map((item, index) => (
          <Typography key={index} variant="body1" align="center">
            {item}
          </Typography>
        ))}
      </Message>
      <Buttons theme={theme}>
        <Button
          style={{ margin: "0 4px" }}
          variant="outlined"
          color="secondary"
          onClick={onButtonPressed(false)}
        >
          DISCARD
        </Button>
        <Button
          style={{ margin: "0 4px" }}
          variant="contained"
          color="secondary"
          onClick={onButtonPressed(true)}
        >
          SAVE
        </Button>
      </Buttons>
    </Container>
  );
};

ContentWarning.propTypes = {
  warning_data: PropTypes.object.isRequired,
  actionCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired
};

export default ContentWarning;

// #######################################
// CSS
// #######################################

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`;

const Message = styled.div`
  border: 1px solid ${p => p.theme.palette.grey[300]};
  border-radius: 3px;
  height: 100%;
  margin-bottom: ${p => p.theme.spacing(2)}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  /* margin-top: ${p => p.theme.spacing(1)}px; */
`;
