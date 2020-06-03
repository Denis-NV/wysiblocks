import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { reorderBlocks, deleteBlock } from "../redux/actions/LocalActions";

// CSS
import styled from "styled-components";

// MUI
import { useTheme } from "@material-ui/core/styles";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";

const BTN_CLOSE = "CLOSE";
const BTN_UP = "UP";
const BTN_DOWN = "DOWN";
const BTN_EDIT = "EDIT";

// Components
const IconButton = ({ onClick, className, children }) => {
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
};

const ContentBlockInstruments = ({
  className,
  reorderBlocks,
  deleteBlock,
  showEditorDraw,
  page_id,
  blockId,
}) => {
  // Hooks
  const theme = useTheme();

  const btnHandler = (id) => (e) => {
    e.stopPropagation();

    switch (id) {
      case BTN_EDIT:
        showEditorDraw();
        break;
      case BTN_CLOSE:
        deleteBlock(page_id, blockId);
        break;
      case BTN_UP:
        reorderBlocks(page_id, blockId, -1);
        break;
      case BTN_DOWN:
        reorderBlocks(page_id, blockId, 1);
        break;
      default:
        console.log(`A button with ID ${id} has no handler`);
    }
  };

  return (
    <MainContainer className={className} theme={theme}>
      <StyledButton onClick={btnHandler(BTN_EDIT)}>
        <EditIcon fontSize="small" />
      </StyledButton>
      <StyledButton onClick={btnHandler(BTN_CLOSE)}>
        <CloseIcon />
      </StyledButton>
      <StyledButton onClick={btnHandler(BTN_UP)}>
        <ExpandLessIcon />
      </StyledButton>
      <StyledButton onClick={btnHandler(BTN_DOWN)}>
        <ExpandMoreIcon />
      </StyledButton>
    </MainContainer>
  );
};

ContentBlockInstruments.propTypes = {
  site: PropTypes.object.isRequired,
  page_id: PropTypes.string.isRequired,
  showEditorDraw: PropTypes.func.isRequired,
  reorderBlocks: PropTypes.func.isRequired,
  deleteBlock: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
  };
};

const mapActionsToProps = { reorderBlocks, deleteBlock };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ContentBlockInstruments);

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
