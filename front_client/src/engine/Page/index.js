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
  const { site_blocks_data, content_pages_data, nav, layout, editor } = props;

  const site_blocks = site_blocks_data
    .map((site_block) => ({ ...site_block }))
    .sort(
      (a, b) =>
        a.settings[editor.cur_key].order - b.settings[editor.cur_key].order
    );

  const cur_page = content_pages_data.find(
    (page) => page.uri === nav.current_address
  );

  const header_hidden = cur_page
    ? cur_page.settings[editor.cur_key].header_hidden
    : true;
  const footer_hidden = cur_page
    ? cur_page.settings[editor.cur_key].footer_hidden
    : true;

  const header_height = header_hidden ? 0 : layout.header_height;

  // Hooks
  const theme = useTheme();

  // Render
  return (
    <MainContainer>
      {site_blocks.map((site_block, index) => {
        let BlockComponent = null;
        // TODO: add conditions for is_deleted"
        switch (site_block.type) {
          case "header":
            BlockComponent = (
              <React.Fragment key={index}>
                {!header_hidden && <Header site_block={site_block} />}
              </React.Fragment>
            );
            break;
          case "content":
            BlockComponent = (
              <React.Fragment key={index}>
                {content_pages_data && content_pages_data.length > 0 ? (
                  <Router>
                    {content_pages_data.map((content_page_data, ind) => {
                      // TODO: add conditions for "is_live", "is_deleted", "unpublished", "protected"
                      return (
                        <PageRoute
                          header_height={header_height}
                          cur_data_key={editor.cur_key}
                          key={ind}
                          path={content_page_data.uri}
                          page_data={content_page_data}
                        />
                      );
                    })}
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
                {!footer_hidden && <Footer site_block={site_block} />}
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
  content_pages_data: PropTypes.array.isRequired,
  site_blocks_data: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    nav: state.Nav,
    layout: state.Layout,
    editor: state.Editor,
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
