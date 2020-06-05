import React from "react";
import PropTypes from "prop-types";

// Utils
import { withHeaderBlockUtils } from "../../.common/BlockUtils";
import { route_id_var } from "../../const";

// CSS and MUI
import { MainContainer, ContentContainer } from "./styles";

const index = (props) => {
  const { site, nav, theme } = props;

  const page_pathname = nav.current_address.replace(`/:${route_id_var}`, "");
  const nav_data = site.nav || [];

  console.log(page_pathname, nav_data);

  return (
    <MainContainer theme={theme}>
      <ContentContainer {...props}>Custom Header</ContentContainer>
    </MainContainer>
  );
};

index.propTypes = {
  site: PropTypes.object.isRequired,
  nav: PropTypes.object.isRequired,
  block_id: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired,
};

export default withHeaderBlockUtils(
  (state) => ({
    site: state.Site,
    nav: state.Nav,
  }),
  { navigateTo }
)(index);
