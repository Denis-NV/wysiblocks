// #######################################
// News Preview Block
// #######################################
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { navigateTo, updateBlock } from "../../redux/actions/LocalActions";

// GraphQL
import { useLazyQuery } from "@apollo/client";
import { NEWS_FEED } from "../../queries";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";
import EditableImage from "../../.common/EditableImage";

//

const NEWS_PREVIEW_Block = (props) => {
  const {
    block_data_set,
    navigateTo,
    updateBlock,
    setEditorContent,
    page_id,
  } = props;

  // Hooks
  const theme = useTheme();
  const abortController = useRef(new window.AbortController());

  useEffect(() => {
    abortController.current =
      abortController.current || new window.AbortController();

    return () => {
      // cleanup
      abortController.current.abort();
      abortController.current = null;
    };
  }, []);

  const [getNewsData, { called, loading, error, data }] = useLazyQuery(
    NEWS_FEED,
    {
      variables: { fromIndex: 0, first: 3 },
      fetchPolicy: "network-only",
      context: {
        fetchOptions: { signal: abortController.current.signal },
      },
    }
  );

  // Handlers
  const onContentUpdate = (field, value) => {
    const data = { [field]: value };

    updateBlock(page_id, block_id, data);
  };

  // Render
  const block_id = block_data_set.id;
  const options = block_data_set.options_data;

  const news_payload = block_data_set.payload_data;
  const news_data = news_payload || data;

  if (!called && !news_data) getNewsData();

  const EditorContent = ({
    block_data_set: {
      options_data: { news_page_url },
    },
  }) => (
    <>
      <Typography variant="body1" gutterBottom>
        News page URL:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={news_page_url}
        onBlur={(e) => onContentUpdate("news_page_url", e.currentTarget.value)}
      />
    </>
  );

  setEditorContent(EditorContent);

  return (
    <>
      <MainContainer {...props}>
        <EditableTextfield
          content={options.title}
          updateCallback={(value) => onContentUpdate("title", value)}
          variant="h4"
        />
        {options.body && options.body !== "" && (
          <EditableTextfield
            content={options.body}
            updateCallback={(value) => onContentUpdate("body", value)}
            variant="body1"
          />
        )}
        <Columns theme={theme}>
          <Col theme={theme} flex={1}>
            <Image
              theme={theme}
              updateCallback={(data) => updateBlock(page_id, block_id, data)}
              image_data={{
                url: ["image_url", options.image_url],
                alt: ["image_alt", options.image_alt],
              }}
            />
          </Col>
          <Col theme={theme} flex={2}>
            <List>
              {loading ? (
                <li>"Loading news..."</li>
              ) : error ? (
                <li>`Error! ${error.message}`</li>
              ) : news_data ? (
                news_data.newsFeed.nodes.map((news_item) => {
                  return (
                    <ListItem key={news_item.id} theme={theme}>
                      <Typography variant="subtitle1">
                        <Link
                          onClick={(e) => {
                            e.preventDefault();

                            navigateTo(
                              `${options.news_page_url}/${news_item.uri}`
                            );
                          }}
                        >
                          {news_item.title}
                        </Link>
                      </Typography>
                    </ListItem>
                  );
                })
              ) : null}
            </List>
          </Col>
        </Columns>
      </MainContainer>
    </>
  );
};

NEWS_PREVIEW_Block.propTypes = {
  block_data_set: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateBlock: PropTypes.func.isRequired,
  setEditorContent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

const mapActionsToProps = { navigateTo, updateBlock };

export default connect(mapStateToProps, mapActionsToProps)(NEWS_PREVIEW_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)`
  display: block;
`;

const Columns = styled.div`
  display: flex;
  padding: ${(p) => p.theme.spacing(2)}px 0;

  flex-direction: row;

  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    flex-direction: column;
  }
`;

const List = styled.ol`
  margin: 0px;
`;

const ListItem = styled.li`
  color: ${(p) => p.theme.palette.primary.main};
`;

const Col = styled.div`
  flex: ${(p) => p.flex};
  display: block;
`;

const Image = styled(EditableImage)`
  width: 100%;
`;
