import React from "react";
import PropTypes from "prop-types";

import { withPageBlockUtils } from "../../.common/BlockUtils";

// CSS and MUI
import { MainContainer } from "./styles";

// Default
const index = (props) => {
  const { site, theme } = props;

  console.log(site.site_id, theme);

  return <MainContainer {...props}>Base Layout - Compliant Bock</MainContainer>;
};

// Props, expected by the component
index.propTypes = {
  site: PropTypes.object.isRequired,
  block_id: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onContentUpdate: PropTypes.func.isRequired,
};

export default withPageBlockUtils(
  (state) => ({
    site: state.Site,
  }),
  {}
)(index);
