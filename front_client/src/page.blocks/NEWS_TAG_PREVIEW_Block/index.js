// #######################################
// Tagged News Preview Block
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

// Utils
import NumberFormat from "react-number-format";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";

//

const NEWS_TAG_PREVIEW_Block = (props) => {
  const {
    block_data_set,
    navigateTo,
    updateBlock,
    setEditorContent,
    page_id,
  } = props;
  const block_id = block_data_set.id;
  const options = block_data_set.options_data;

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
      variables: {
        fromIndex: 0,
        first: parseInt(options.first),
        tags:
          options.tags && options.tags !== ""
            ? options.tags.trim().split(",")
            : [],
      },
      fetchPolicy: "network-only",
      context: {
        fetchOptions: { signal: abortController.current.signal },
      },
    }
  );

  if (!called && !data) getNewsData();

  // Handlers
  const onContentUpdate = (field, value) => {
    const data = { [field]: value };

    updateBlock(page_id, block_id, data);
  };

  // Render
  const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;

    return <NumberFormat {...other} getInputRef={inputRef} isNumericString />;
  };

  const EditorContent = ({
    block_data_set: {
      options_data: { news_page_url, first, tags },
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
      <br />
      <br />
      <Typography variant="body1" gutterBottom>
        Max Items:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={first}
        onBlur={(e) => onContentUpdate("first", e.currentTarget.value)}
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
      />
      <br />
      <br />
      <Typography variant="body1" gutterBottom>
        Tags:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={tags}
        onBlur={(e) => onContentUpdate("tags", e.currentTarget.value)}
      />
      <br />
      <br />
    </>
  );

  setEditorContent(EditorContent);

  return (
    <>
      <MainContainer theme={theme} settings={{ ...options }} {...props}>
        <EditableTextfield
          variant="h4"
          content={options.title}
          updateCallback={(value) => onContentUpdate("title", value)}
        />
        {options.body && options.body !== "" && (
          <EditableTextfield
            variant="body1"
            content={options.body}
            updateCallback={(value) => onContentUpdate("body", value)}
          />
        )}
        <br />
        <List>
          {loading ? (
            <li>"Loading news..."</li>
          ) : error ? (
            <li>`Error! ${error.message}`</li>
          ) : data ? (
            data.newsFeed.nodes.map((news_item) => {
              return (
                <ListItem key={news_item.id} theme={theme}>
                  <Typography variant="subtitle1">
                    <Link
                      onClick={(e) => {
                        e.preventDefault();

                        navigateTo(`${options.news_page_url}/${news_item.uri}`);
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
      </MainContainer>
    </>
  );
};

NEWS_TAG_PREVIEW_Block.propTypes = {
  block_data_set: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

const mapActionsToProps = { navigateTo, updateBlock };

export default connect(null, mapActionsToProps)(NEWS_TAG_PREVIEW_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)`
  display: block;
`;

const List = styled.ol`
  margin: 0px;
`;

const ListItem = styled.li`
  color: ${(p) => p.theme.palette.primary.main};
`;
