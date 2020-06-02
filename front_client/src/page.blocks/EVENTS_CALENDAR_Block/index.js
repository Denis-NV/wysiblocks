// #######################################
// Events Calendar Block
// #######################################

import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { navigateTo, updateBlock } from "../../redux/actions/LocalActions";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Utils
import ReactResizeDetector from "react-resize-detector";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";

import "react-big-calendar/lib/css/react-big-calendar.css";

const EVENTS_CALENDAR_Block = (props) => {
  const {
    block_data_set,
    navigateTo,
    updateBlock,
    setEditorContent,
    page_id,
  } = props;

  const localizer = momentLocalizer(moment);

  const options = block_data_set.options_data;
  const block_id = block_data_set.id;

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  // Hooks
  const theme = useTheme();

  const [calendar_state, setCalendarState] = useState({
    height: 521,
    events: null,
    date: new Date(),
    //view: "month",
    key: Math.random(),
  });

  const [calendar_view, setCalendarView] = useState("month");

  const getEvents = useCallback(
    (date) => {
      //
      const from_date = new Date(
        date.getFullYear(),
        date.getMonth()
      ).toISOString();
      const to_date = new Date(
        date.getFullYear(),
        date.getMonth() + 1
      ).toISOString();

      axios
        .get(
          `${window._env_.REACT_APP_MAIN_API_URL}/event?closes_gte=${from_date}&date_lte=${to_date}`
        )
        .then((response) => {
          const new_events = response.data.map((item) => {
            return {
              start: moment.utc(item.date).toDate(),
              end: moment.utc(item.closes).toDate(),
              allDay: false,
              title: item.title,
              uri: item.uri,
            };
          });

          setCalendarState({
            ...calendar_state,
            events: new_events,
            key: Math.random(),
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          });
        })
        .catch((err) => console.log(err));
    },
    [calendar_state]
  );

  useEffect(() => {
    if (!calendar_state.events) getEvents(new Date());

    return () => {
      // cleanup logic
      source.cancel("Event fetching cancelled");
    };
  }, [source, calendar_state.events, getEvents]);

  //
  // Handlers
  const onResize = (w) => {
    const new_state = { ...calendar_state };
    new_state.height = Math.min(w * 0.8, 521);

    setCalendarState(new_state);
  };

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

  const onSelectEvent = (event, e) => {
    navigateTo(`${options.events_page_url}/${event.uri}`);
  };

  const onCalendarNavigate = (date, cur_view, btn) => {
    if (btn === "DATE") {
      setCalendarState({
        ...calendar_state,
        date: new Date(date),
      });
    } else getEvents(date);
  };

  const onCalendarView = (new_view) => {
    setCalendarView(new_view);
  };

  const onContentUpdate = (field, value) => {
    const data = { [field]: value };

    updateBlock(page_id, block_id, data);
  };

  //
  // Render
  return (
    <>
      <MainContainer {...props} theme={theme} settings={{ ...options }}>
        <ReactResizeDetector handleWidth onResize={onResize} />
        <Header theme={theme}>
          <EditableTextfield
            variant="h4"
            opt_field="title"
            content={options.title}
            updateCallback={(value) => onContentUpdate("title", value)}
          />
          <EditableTextfield
            variant="body1"
            showBlockCtrls
            className="paragraph"
            content={options.body}
            updateCallback={(value) => onContentUpdate("body", value)}
          />
        </Header>

        <CalendarContainer theme={theme} variant="caption">
          <Calendar
            key={calendar_state.key}
            date={calendar_state.date}
            toolbar={true}
            //defaultView="month"
            views={["month", "day"]}
            view={calendar_view}
            onView={onCalendarView}
            localizer={localizer}
            events={calendar_state.events || []}
            style={{ height: calendar_state.height }}
            onSelectEvent={onSelectEvent}
            onNavigate={onCalendarNavigate}
          />
        </CalendarContainer>
      </MainContainer>
    </>
  );
};

EVENTS_CALENDAR_Block.propTypes = {
  block_data_set: PropTypes.object.isRequired,
  navigateTo: PropTypes.func.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
  };
};

const mapActionsToProps = { navigateTo, updateBlock };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(EVENTS_CALENDAR_Block);

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

const CalendarContainer = styled(Typography)`
  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    .rbc-toolbar {
      flex-direction: column;
    }
  }
`;
