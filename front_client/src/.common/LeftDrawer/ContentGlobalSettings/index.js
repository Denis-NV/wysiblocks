import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";

// Components
import PagesSettings from "./PagesSettings";
import ThemeSettings from "./ThemeSettings";

//
const ContentGlobalSettings = ({ closeCallback }) => {
  // Hooks
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Handlers
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  let savePages = () => {};
  let saveTheme = () => {};

  const handleSaveClick = close => event => {
    if (close) closeCallback();

    savePages();
    saveTheme();
  };

  return (
    <Container theme={theme}>
      <Buttons>
        <Button
          variant="outlined"
          size="large"
          color="secondary"
          fullWidth
          onClick={handleSaveClick(false)}
        >
          Save
        </Button>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          fullWidth
          onClick={handleSaveClick(true)}
        >
          Save and Close
        </Button>
      </Buttons>
      <ExpansionPanel
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Heading variant="button" theme={theme}>
            Pages and Nav
          </Heading>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <PagesSettings setSave={save => (savePages = save)} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Heading variant="button" theme={theme}>
            Theming
          </Heading>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ThemeSettings setSave={save => (saveTheme = save)} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container>
  );
};

ContentGlobalSettings.propTypes = {
  closeCallback: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {};
};

const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ContentGlobalSettings);

// #######################################
// CSS
// #######################################

const Container = styled.div`
  background-color: ${p => p.theme.palette.grey[100]};
  height: 100%;
  width: 500px;
  max-width: 75vw;
  padding: ${p => p.theme.spacing(2)}px;
`;

const Heading = styled(Typography)`
  flex-basis: 33.33%;
  flex-shrink: 0;
`;

const Buttons = styled.div`
  display: flex;
`;
