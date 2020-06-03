import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// CSS
import styled from "styled-components";

// MUI
import { useTheme } from "@material-ui/core/styles";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import EditIcon from "@material-ui/icons/Edit";

const BTN_REPLACE = "REPLACE";
const BTN_EDIT = "EDIT";

// Components
const IconButton = ({ onClick, className, children }) => {
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
};

const SiteBlockInstruments = ({
  className,
  showEditorCb,
  setEditorContent,
}) => {
  // Hooks
  const theme = useTheme();

  const btnHandler = (id) => (e) => {
    e.stopPropagation();

    switch (id) {
      case BTN_EDIT:
        setEditorContent("settings");
        showEditorCb(true);
        break;
      case BTN_REPLACE:
        setEditorContent("replace");
        showEditorCb(true);
        break;
      default:
        console.log(`A button with ID ${id} has no handler`);
    }
  };

  // Render
  return (
    <MainContainer className={className} theme={theme}>
      <StyledButton onClick={btnHandler(BTN_EDIT)}>
        <EditIcon fontSize="small" />
      </StyledButton>
      <StyledButton onClick={btnHandler(BTN_REPLACE)}>
        <AutorenewIcon />
      </StyledButton>
    </MainContainer>
  );
};

SiteBlockInstruments.propTypes = {
  site: PropTypes.object.isRequired,
  showEditorCb: PropTypes.func.isRequired,
  setEditorContent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
  };
};

const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(SiteBlockInstruments);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  position: absolute;
  z-index: ${(p) => p.theme.zIndex.block_instruments};
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 40px;
  padding: 5px;
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(IconButton)`
  color: rgba(255, 255, 255, 0.8);
  width: 30px;
  height: 30px;
  margin-left: 5px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
