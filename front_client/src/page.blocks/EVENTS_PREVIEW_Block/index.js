// #######################################
// Events Preview Block
// #######################################
import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { navigateTo, updateBlock } from "../../redux/actions/LocalActions";

// GraphQL
import { useLazyQuery } from "@apollo/react-hooks";
import { EVENT_FEED } from "../../queries";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";

// Utils
import moment from "moment";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";
import EditableImage from "../../.common/EditableImage";

//

const EVENTS_PREVIEW_Block = (props) => {
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
      variables: { fromIndex: 0, first: 3 },
      fetchPolicy: "network-only",
      context: {
        fetchOptions: { signal: abortController.current.signal },
      },
    }
  );

  const events_payload = block_data_set.payload_data;
  const events_data = events_payload || data;

  if (!called && !events_data) getEventsData();

  // Handlers
  const onContentUpdate = (field, value) => {
    const data = { [field]: value };

    updateBlock(page_id, block_id, data);
  };

  // Render
  const EditorContent = ({
    block_data_set: {
      options_data: { events_page_url },
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
                <li>"Loading events..."</li>
              ) : error ? (
                <li>`Error! ${error.message}`</li>
              ) : events_data ? (
                events_data.eventFeed.nodes.map((event_item) => {
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
                      <Typography variant="body2" color="textPrimary">
                        {`From ${moment(new Date(event_item.date)).format(
                          "MMM Do, HH:mm"
                        )} to ${moment(new Date(event_item.closes)).format(
                          "MMM Do, HH:mm"
                        )}`}
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

EVENTS_PREVIEW_Block.propTypes = {
  block_data_set: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

const mapActionsToProps = { navigateTo, updateBlock };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(EVENTS_PREVIEW_Block);

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
