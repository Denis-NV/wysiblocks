import React from "react";
import PropTypes from "prop-types";

import { navigateTo } from "../../redux/actions/LocalActions";

// Utils
import { withHeaderBlockUtils } from "../../.common/BlockUtils";
import EditableImage from "../../.common/EditableImage";

// CSS and MUI
import { MainContainer, ContentContainer, NavItem } from "./styles";

import Link from "@material-ui/core/Link";

// Utils
import { route_id_var } from "../../const";

const SIMPLE_NAV_Header_002 = (props) => {
  const {
    site,
    nav,
    theme,
    navigateTo,
    settings,
    block_id,
    updateSiteBlock,
  } = props;

  const page_pathname = nav.current_address.replace(`/:${route_id_var}`, "");
  const nav_data = site.nav || [];

  return (
    <MainContainer theme={theme}>
      <ContentContainer {...props}>
        <figure onClick={(e) => navigateTo("/")}>
          <EditableImage
            theme={theme}
            updateCallback={(data) => updateSiteBlock(block_id, data)}
            image_data={{
              //url: [
              //  "logo_img_url",
              //  "https://res.cloudinary.com/dij62dqc8/image/upload/v1580480310/ach3hs5lirvn4hswqnfr.png",
              //],
              url: ["logo_img_url", settings.logo_img_url],
              alt: ["logo_img_alt", settings.logo_img_alt],
            }}
          />
        </figure>
        <nav>
          <ul>
            {nav_data.map((nav_item) => {
              return (
                <NavItem
                  key={nav_item.id}
                  theme={theme}
                  active={page_pathname === nav_item.to}
                  color={theme.palette.grey[700]}
                  ease={theme.transitions.easing.easeIn}
                  duration={theme.transitions.duration.shortest}
                >
                  <Link
                    variant="button"
                    underline="none"
                    onClick={(e) => {
                      e.preventDefault();

                      navigateTo(nav_item.to);
                    }}
                  >
                    {nav_item.name}
                  </Link>
                </NavItem>
              );
            })}
          </ul>
        </nav>
      </ContentContainer>
    </MainContainer>
  );
};

SIMPLE_NAV_Header_002.propTypes = {
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
)(SIMPLE_NAV_Header_002);
