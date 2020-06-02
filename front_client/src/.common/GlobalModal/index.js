import React from "react";
import PropTypes from "prop-types";

// CSS & MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";

const GlobalModal = ({ children, is_open, closeCallback, className }) => {
  // Hooks
  const theme = useTheme();

  return (
    <StyledModal
      open={is_open}
      onClose={e => closeCallback()}
      closeAfterTransition
      disableRestoreFocus
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={is_open}>
        <ContentContainer theme={theme} className={className}>
          {children}
        </ContentContainer>
      </Fade>
    </StyledModal>
  );
};

GlobalModal.propTypes = {
  is_open: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired
};

export default GlobalModal;

// #######################################
// CSS
// #######################################

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  background-color: ${p => p.theme.palette.background.default};
  max-height: 500px;
  max-width: 700px;
  height: 80%;
  width: 90%;
  outline: 0px;
  border-radius: ${p => p.theme.shape.borderRadius}px;
  padding: ${p => p.theme.spacing(2)}px;
`;
