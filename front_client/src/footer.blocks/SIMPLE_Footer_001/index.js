import React from "react";
import PropTypes from "prop-types";

import { navigateTo } from "../../redux/actions/LocalActions";

// Utils
import { withFooterBlockUtils } from "../../.common/BlockUtils";

// CSS and MUI
import { MainContainer, ContentContainer } from "./styles";

const SIMPLE_Footer001 = (props) => {
  const { theme } = props;

  return (
    <MainContainer theme={theme}>
      <ContentContainer {...props}></ContentContainer>
    </MainContainer>
  );
};

SIMPLE_Footer001.propTypes = {
  site: PropTypes.object.isRequired,
  block_id: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
};

export default withFooterBlockUtils(
  (state) => ({
    site: state.Site,
  }),
  { navigateTo }
)(SIMPLE_Footer001);
