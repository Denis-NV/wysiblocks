// #######################################
// YouTube Block
// #######################################

import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { updateBlock } from "../../redux/actions/LocalActions";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

// Utils
import ReactResizeDetector from "react-resize-detector";
import YouTube from "react-youtube";
import NumberFormat from "react-number-format";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import TextField from "@material-ui/core/TextField";

const YOUTUBE_Block = (props) => {
  const { block_data_set, page_id, updateBlock, setEditorContent } = props;
  const block_id = block_data_set.id;
  const options = block_data_set.options_data;
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      origin: window.location.origin,
    },
  };

  // Hooks
  const theme = useTheme();
  const [state, setState] = useState({ height: 0 });

  // Handlers
  const onVideoReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const onResize = (w) => {
    setState({ ...state, height: w * (options.ver / options.hor) });
  };

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
      options_data: { video_id, hor, ver },
    },
  }) => (
    <>
      <Typography variant="body1" gutterBottom>
        Video ID:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={video_id}
        onBlur={(e) => onContentUpdate("video_id", e.currentTarget.value)}
      />
      <br />
      <br />
      <Typography variant="body1" gutterBottom>
        Aspect Ratio:
      </Typography>
      <AspectRow>
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          color="secondary"
          defaultValue={hor}
          onBlur={(e) => onContentUpdate("hor", e.currentTarget.value)}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
        <Typography variant="body1" gutterBottom>
          X
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          color="secondary"
          defaultValue={ver}
          onBlur={(e) => onContentUpdate("ver", e.currentTarget.value)}
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
      </AspectRow>
    </>
  );

  setEditorContent(EditorContent);

  return (
    <>
      <MainContainer {...props} theme={theme} settings={{ ...options }}>
        <ReactResizeDetector handleWidth onResize={onResize} />

        <VideoContainer
          h={state.height}
          videoId={options.video_id}
          opts={opts}
          onReady={onVideoReady}
        />
      </MainContainer>
    </>
  );
};

YOUTUBE_Block.propTypes = {
  page_id: PropTypes.string.isRequired,
  block_data_set: PropTypes.object.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

export default connect(null, { updateBlock })(YOUTUBE_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)``;

const VideoContainer = styled(YouTube)`
  height: ${(p) => p.h}px;
`;

const AspectRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 214px;

  & > div {
    flex: 10;
  }

  & > p {
    flex: 1;
    margin: 0 10px;
  }
`;
