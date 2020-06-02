// #######################################
// News List Block
// #######################################

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

import ReactHtmlParser from "react-html-parser";

// Redux
import { connect } from "react-redux";
import { navigateTo, updateBlock } from "../../redux/actions/LocalActions";

// GraphQL
import { NEWS } from "../../queries";
import { NEWS_FEED } from "../../queries";
import { Query } from "react-apollo";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

// Components
import ScrollableItems from "../../.common/ScrollableItems";
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";

import Link from "@material-ui/core/Link";

const NEWS_Block = ({
  block_data_set,
  navigateTo,
  updateBlock,
  page_id,
  page_item_id,
  site,
  nav,
}) => {
  // Hooks
  const theme = useTheme();
  const [blocks_data, setData] = useState([]);

  // Render
  const options = block_data_set.options_data;
  const block_id = block_data_set.id;

  return useMemo(() => {
    // Handlers
    const onContentUpdate = (field, value) => {
      const data = { [field]: value };

      updateBlock(page_id, block_id, data);
    };

    if (page_item_id) {
      return (
        <Query query={NEWS} variables={{ uri: page_item_id }}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            const newsItem = data.newsList[0];

            return (
              <MainContainer theme={theme} settings={{ ...options }}>
                <SingleNewsItem theme={theme}>
                  <Typography variant="h4" gutterBottom>
                    {newsItem.title}
                  </Typography>
                  {newsItem.image && newsItem.image !== "" && (
                    <Image src={newsItem.image} alt="" theme={theme} />
                  )}

                  <Typography variant="body1">
                    {ReactHtmlParser(newsItem.content)}
                  </Typography>
                </SingleNewsItem>
              </MainContainer>
            );
          }}
        </Query>
      );
    } else {
      const onBlocksDataUpdate = (data) => {
        setData([...blocks_data, ...data.newsFeed.nodes]);

        return [data.newsFeed.pageInfo.nextIndex, data.newsFeed.totalCount];
      };

      return (
        <MainContainer theme={theme} settings={{ ...options }}>
          <Header theme={theme}>
            <EditableTextfield
              variant="h4"
              content={options.title}
              updateCallback={(value) => onContentUpdate("title", value)}
            />
            <EditableTextfield
              content={options.body}
              updateCallback={(value) => onContentUpdate("body", value)}
              variant="body1"
              showBlockCtrls
              className="paragraph"
            />
          </Header>

          <ScrollableItems feed={NEWS_FEED} updateCallback={onBlocksDataUpdate}>
            {blocks_data.map((block, index) => {
              return (
                <NewsItem
                  is_even={index % 2 !== 0}
                  key={block.id}
                  theme={theme}
                >
                  <Typography variant="h5" gutterBottom>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();

                        navigateTo(`${nav.current_path}/${block.uri}`);
                      }}
                    >
                      {block.title}
                    </Link>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {block.abstract}
                  </Typography>
                </NewsItem>
              );
            })}
          </ScrollableItems>
        </MainContainer>
      );
    }
  }, [
    blocks_data,
    page_item_id,
    navigateTo,
    options,
    theme,
    nav.current_path,
    page_id,
    block_id,
    updateBlock,
  ]);
};

NEWS_Block.propTypes = {
  block_data_set: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateBlock: PropTypes.func.isRequired,
  page_item_id: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
    nav: state.Nav,
  };
};

const mapActionsToProps = { navigateTo, updateBlock };

export default connect(mapStateToProps, mapActionsToProps)(NEWS_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)`
  color: ${(p) => p.theme.palette.text.primary};
  display: block;
`;

const Header = styled.div`
  /* padding: 0 ${(p) => p.theme.spacing(2)}px; */
`;

const NewsItem = styled.div`
  /* min-height: 100px; */
  padding: ${(p) => p.theme.spacing(2)}px;
  background-color: ${(p) =>
    p.is_even ? p.theme.palette.grey[200] : "inherit"};
`;

const SingleNewsItem = styled(NewsItem)`
  /* background-color: grey; */
  padding: 0;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  max-height: 500px;
  margin: ${(p) => p.theme.spacing(2)}px 0;
`;
