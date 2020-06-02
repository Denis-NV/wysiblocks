import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// Router
import { Router } from "@reach/router";

// CSS & MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

// Components
import Header from "../Header";
import Footer from "../Footer";
import Route from "../Route";

// Default
const Page = (props) => {
  const { site_blocks_data, content_pages_data, site, nav, layout } = props;

  const site_blocks = Object.entries(site_blocks_data)
    .map(([, value]) => value)
    .sort((a, b) => a.block_data.order - b.block_data.order);

  const cur_page_dupple = Object.entries(site.pages).find(
    ([, value]) => value.uri === nav.current_path
  );
  const cur_page = cur_page_dupple ? cur_page_dupple[1] : null;

  const header_hidden = cur_page ? cur_page.header_hidden : true;
  const footer_hidden = cur_page ? cur_page.footer_hidden : true;

  const header_height = header_hidden ? 0 : layout.header_height;

  // Hooks
  const theme = useTheme();

  // Render
  return (
    <MainContainer>
      {site_blocks.map((block_data_set, index) => {
        let BlockComponent = null;

        switch (block_data_set.block_data.type) {
          case "header":
            BlockComponent = (
              <React.Fragment key={index}>
                {!header_hidden && <Header block_data_set={block_data_set} />}
              </React.Fragment>
            );
            break;
          case "content":
            BlockComponent = (
              <React.Fragment key={index}>
                {content_pages_data &&
                Object.entries(content_pages_data).length > 0 ? (
                  <Router>
                    {Object.entries(content_pages_data).map(([key, value]) => (
                      <PageRoute
                        header_height={header_height}
                        key={key}
                        path={value.uri}
                        page_data={value}
                      />
                    ))}
                  </Router>
                ) : (
                  <Message theme={theme} header_height={header_height}>
                    <Typography variant="subtitle1" color="textPrimary">
                      Please create the first page to start building you site
                    </Typography>
                  </Message>
                )}
              </React.Fragment>
            );
            break;
          case "footer":
            BlockComponent = (
              <React.Fragment key={index}>
                {!footer_hidden && <Footer block_data_set={block_data_set} />}
              </React.Fragment>
            );
            break;
          default:
            BlockComponent = null;
        }

        return BlockComponent;
      })}
    </MainContainer>
  );
};

Page.propTypes = {
  content_pages_data: PropTypes.object.isRequired,
  site_blocks_data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
    nav: state.Nav,
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, {})(Page);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

const Message = styled.div`
  padding-top: ${(p) => p.header_height * 2}px;
  display: flex;
  justify-content: center;

  & > * {
    max-width: 800px;
    text-align: center;
    opacity: 0.5;
  }
`;

const PageRoute = styled(Route)`
  padding-top: ${(p) => p.header_height}px;
`;
