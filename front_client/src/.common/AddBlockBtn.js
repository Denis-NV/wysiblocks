import React, { useRef, useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { createNewBlock } from "../redux/actions/LocalActions";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

// Components
import LeftDrawer from "./LeftDrawer";
import ContentBlockTypes from "./LeftDrawer/ContentBlockTypes";

const AddBlockBtn = ({ index, page_id, is_top, createNewBlock }) => {
  // Hooks
  const btnRef = useRef();
  const [height, setHeight] = useState(0);
  const [drawer_open, setDrawerOpen] = useState(false);
  const theme = useTheme();

  useLayoutEffect(() => setHeight(btnRef.current.offsetHeight), [height]);

  // Handlers
  const onBtnClicked = (e) => {
    setDrawerOpen(true);
  };

  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  const onCreateBlock = (data) => {
    createNewBlock(data, page_id, index);
  };

  return (
    <>
      <LeftDrawer is_open={drawer_open} closeCallback={onDrawerClose}>
        <ContentBlockTypes
          closeCallback={onDrawerClose}
          actionCallback={onCreateBlock}
        />
      </LeftDrawer>
      <StyledFab
        theme={theme}
        color="secondary"
        aria-label="add"
        size="small"
        height={height}
        is_top={is_top}
        onClick={onBtnClicked}
        ref={btnRef}
      >
        <AddIcon />
      </StyledFab>
    </>
  );
};

AddBlockBtn.propTypes = {
  createNewBlock: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  page_id: PropTypes.string.isRequired,
  is_top: PropTypes.string,
};

export default connect(null, { createNewBlock })(AddBlockBtn);

const StyledFab = styled(Fab)`
  margin-top: -${(p) => (p.is_top ? 0 : p.height / 2)}px;
  margin-bottom: -${(p) => p.height / 2}px;
  display: flex;
  left: calc(50% - 20px);
  justify-content: center;
  position: absolute;
  z-index: ${(p) => p.theme.zIndex.add_block_btns};
`;
