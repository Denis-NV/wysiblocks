import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// Utils
import axios from "axios";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// Components
import FilesLoader from "../FilesLoader";

const ContentEditImage = ({
  updateCallback,
  closeCallback,
  image_data,
  user,
}) => {
  // Hooks
  const [state, setState] = useState(null);
  const theme = useTheme();

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  useEffect(() => {
    if (!state) {
      const image_data_copy = {};

      for (const key in image_data) image_data_copy[key] = [...image_data[key]];

      setState(image_data_copy);
    }

    //

    return () => {
      // cleanup logic

      source.cancel("Image upload canceled due to dialogue closure");
    };
  }, [image_data, state, setState, source]);

  // Handlers
  const onFormSubmit = (event) => {
    event.preventDefault();

    let block_data = {};

    if (state.url) block_data[state.url[0]] = state.url[1];
    if (state.alt) block_data[state.alt[0]] = state.alt[1];
    if (state.link) block_data[state.link[0]] = state.link[1];
    if (state.target) block_data[state.target[0]] = state.target[1];

    updateCallback(block_data);

    closeCallback();
  };

  const onInputChange = (event) => {
    setState({ ...state, [event.target.id]: event.target.value });
  };

  const onFileUploaded = (new_url) => {
    const new_state = { ...state };

    new_state.url[1] = new_url;

    setState(new_state);
  };

  // Render
  if (state) {
    return (
      <Form onSubmit={onFormSubmit}>
        <FilesLoader
          required={false}
          accept={null}
          token={source.token}
          upload_url={window._env_.REACT_APP_FILE_UPLOAD_URL}
          id_token={user.id_token}
          current_files={[]}
          bg_img={state.url[1]}
          uploadedCallback={(filenames, err) =>
            onFileUploaded(filenames[0].url)
          }
        />
        <TextField
          id={state.url[0]}
          label="URL: "
          variant="outlined"
          fullWidth
          disabled
          margin="dense"
          color="secondary"
          value={state.url[1]}
        />
        {state.alt && (
          <TextField
            id={state.alt[0]}
            label="Alt text:"
            variant="outlined"
            fullWidth
            margin="dense"
            color="secondary"
            value={state.alt[1]}
            onChange={onInputChange}
          />
        )}
        {state.link && (
          <TextField
            id={state.link[0]}
            label="Link: "
            variant="outlined"
            fullWidth
            margin="dense"
            color="secondary"
            value={state.link[1]}
            onChange={onInputChange}
          />
        )}
        {state.target && (
          <TextField
            id={state.target[0]}
            label="Target: "
            variant="outlined"
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
            margin="dense"
            color="secondary"
            value={state.target[1]}
            onChange={onInputChange}
          >
            {["_blank", "_self"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        )}
        <Buttons theme={theme}>
          <Button variant="contained" color="secondary" type="submit">
            Update
          </Button>
        </Buttons>
      </Form>
    );
  } else return null;
};

ContentEditImage.propTypes = {
  updateCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired,
  image_data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    user: state.User,
  };
};

export default connect(mapStateToProps, {})(ContentEditImage);

// #######################################
// CSS
// #######################################

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(p) => p.theme.spacing(1)}px;
`;
