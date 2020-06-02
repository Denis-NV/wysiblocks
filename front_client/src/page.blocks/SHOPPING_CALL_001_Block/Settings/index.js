import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// Utils
import { withPageBlockEditorkUtils } from "../../../.common/BlockUtils";

const Settings = (props) => {
  const { onContentUpdate, hideEditorDraw, options } = props;

  const call_id = options.call_id || 0;
  const basket_id = options.basket_id || 0;
  const files_upload_url = options.files_upload_url || "";
  const application_submit_url = options.application_submit_url || "";

  // Hooks
  const theme = useTheme();
  const [state, setState] = React.useState({
    call_id,
    basket_id,
    files_upload_url,
    application_submit_url,
  });

  // Handlers
  const onSave = (e) => {
    onContentUpdate("call_id", state.call_id);
    onContentUpdate("basket_id", state.basket_id);
    onContentUpdate("files_upload_url", state.files_upload_url);
    onContentUpdate("application_submit_url", state.application_submit_url);

    hideEditorDraw();
  };

  // Render
  return (
    <MainContainer theme={theme}>
      <Typography variant="h5" gutterBottom>
        Specify call ID
      </Typography>
      <TextField
        className="paragraph"
        variant="outlined"
        color="secondary"
        fullWidth
        margin="dense"
        value={state.call_id}
        onChange={(e) => {
          setState({ ...state, call_id: e.target.value });
        }}
      />
      <Typography variant="h5" gutterBottom>
        Specify shopping basket field ID
      </Typography>
      <TextField
        className="paragraph"
        variant="outlined"
        color="secondary"
        fullWidth
        margin="dense"
        value={state.basket_id}
        onChange={(e) => {
          setState({ ...state, basket_id: e.target.value });
        }}
      />
      <Typography variant="h5" gutterBottom>
        Files upload URL
      </Typography>
      <TextField
        className="paragraph"
        variant="outlined"
        color="secondary"
        fullWidth
        margin="dense"
        value={state.files_upload_url}
        onChange={(e) => {
          setState({ ...state, files_upload_url: e.target.value });
        }}
      />
      <Typography variant="h5" gutterBottom>
        Application submit URL
      </Typography>
      <TextField
        className="paragraph"
        variant="outlined"
        color="secondary"
        fullWidth
        margin="dense"
        value={state.application_submit_url}
        onChange={(e) => {
          setState({ ...state, application_submit_url: e.target.value });
        }}
      />
      <Button variant="contained" color="secondary" onMouseDown={onSave}>
        Save changes
      </Button>
    </MainContainer>
  );
};

Settings.propTypes = {
  onContentUpdate: PropTypes.func.isRequired,
};

export default withPageBlockEditorkUtils()(Settings);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  min-width: 300px;

  .MuiTypography-h5 {
    font-size: 1.25rem;
    font-weight: 500;
  }
`;
