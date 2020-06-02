import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";

const BlockBaseLayout = (props) => {
  const { site, editor, children, className, block_data_set } = props;

  const settings = block_data_set ? block_data_set.options_data : {};

  // Hooks
  const theme = useTheme();

  // Render
  return (
    <MainContainer
      theme={theme}
      is_secondary={settings.is_secondary}
      is_edit_mode={editor.is_edit_mode}
    >
      <ContentColumn theme={theme} className={className}>
        {children}
      </ContentColumn>
    </MainContainer>
  );
};

BlockBaseLayout.propTypes = {
  site: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  bg_opacity: PropTypes.number,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
    editor: state.Editor,
  };
};

export default connect(mapStateToProps)(BlockBaseLayout);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  padding-left: ${(p) => p.theme.spacing(4)}px;
  padding-right: ${(p) => p.theme.spacing(4)}px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 100%;
    border-bottom: 1px dashed
      rgba(0, 0, 0, ${(p) => (p.is_edit_mode ? "0.5" : "0")});
  }

  ${(p) => p.theme.breakpoints.down("xs")} {
    padding-left: ${(p) => p.theme.spacing(2)}px;
    padding-right: ${(p) => p.theme.spacing(2)}px;
  }
`;

const ContentColumn = styled.div`
  max-width: ${(p) => p.theme.breakpoints.values.md}px;
  width: 100%;

  padding-top: ${(p) => p.theme.spacing(5)}px;
  padding-bottom: ${(p) => p.theme.spacing(5)}px;
`;
