// #######################################
// Tagged Events Preview Block
// #######################################
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { navigateTo, updateBlock } from "../../redux/actions/LocalActions";

// GraphQL
import { useLazyQuery } from "@apollo/client";
import { EVENT_FEED } from "../../queries";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";

// Utils
import moment from "moment";
import NumberFormat from "react-number-format";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";

//

const EVENTS_TAG_PREVIEW_Block = (props) => {
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

  const [getEventsData, { called, loading, error, data }] = useLazyQuery(
    EVENT_FEED,
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

  // Handlers
  const onContentUpdate = (field, value) => {
    const data = { [field]: value };

    updateBlock(page_id, block_id, data);
  };

  if (!called && !data) getEventsData();

  // Render
  const NumberFormatCustom = (props) => {
    const { inputRef, onChange, ...other } = props;

    return <NumberFormat {...other} getInputRef={inputRef} isNumericString />;
  };

  const EditorContent = ({
    block_data_set: {
      options_data: { events_page_url, first, tags },
    },
  }) => (
    <>
      <Typography variant="body1" gutterBottom>
        Events page URL:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={events_page_url}
        onBlur={(e) =>
          onContentUpdate("events_page_url", e.currentTarget.value)
        }
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
    </>
  );

  setEditorContent(EditorContent);

  return (
    <>
      <MainContainer theme={theme} settings={{ ...options }} {...props}>
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
        <br />
        <List>
          {loading ? (
            <li>"Loading events..."</li>
          ) : error ? (
            <li>`Error! ${error.message}`</li>
          ) : data && data.eventFeed ? (
            data.eventFeed.nodes.map((event_item) => {
              return (
                <ListItem key={event_item.id} theme={theme}>
                  <Typography variant="subtitle1">
                    <Link
                      onClick={(e) => {
                        e.preventDefault();

                        navigateTo(
                          `${options.events_page_url}/${event_item.uri}`
                        );
                      }}
                    >
                      {event_item.title}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="textPrimary" gutterBottom>
                    <strong>
                      {`From ${moment(new Date(event_item.date)).format(
                        "MMM Do, HH:mm"
                      )} to ${moment(new Date(event_item.closes)).format(
                        "MMM Do, HH:mm"
                      )}`}
                    </strong>
                  </Typography>
                  <Typography variant="body1" color="textPrimary" paragraph>
                    {event_item.location}
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

EVENTS_TAG_PREVIEW_Block.propTypes = {
  block_data_set: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

export default connect(null, { navigateTo, updateBlock })(
  EVENTS_TAG_PREVIEW_Block
);

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
