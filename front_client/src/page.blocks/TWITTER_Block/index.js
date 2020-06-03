// #######################################
// Twitter Block
// #######################################

import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { updateBlock } from "../../redux/actions/LocalActions";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// Utils
import { TwitterTimelineEmbed } from "react-twitter-embed";
import NumberFormat from "react-number-format";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableImage from "../../.common/EditableImage";

const TWITTER_Block = (props) => {
  const {
    block_data,
    page_id,
    updateBlock,
    setEditorContent,
    cur_data_key,
  } = props;
  const block_id = block_data.id;
  const options = block_data.settings[cur_data_key].custom_map;

  // Hooks
  const theme = useTheme();

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
    block_data: {
      options_data: { screenName, height },
    },
  }) => (
    <>
      <Typography variant="body1" gutterBottom>
        Screen name:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={screenName}
        onBlur={(e) => onContentUpdate("screenName", e.currentTarget.value)}
      />
      <br />
      <br />
      <Typography variant="body1" gutterBottom>
        Height:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={height}
        onBlur={(e) => onContentUpdate("height", e.currentTarget.value)}
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
      />
    </>
  );

  setEditorContent(EditorContent);

  return (
    <>
      <MainContainer {...props} theme={theme} settings={{ ...options }}>
        <Image
          theme={theme}
          updateCallback={(data) => updateBlock(page_id, block_id, data)}
          h={options.height}
          image_data={{
            url: ["image", options.image],
          }}
        />
        <TwitterContainer theme={theme}>
          <TwitterTimelineEmbed
            sourceType="profile"
            screenName={options.screenName}
            options={{ height: options.height }}
          />
        </TwitterContainer>
      </MainContainer>
    </>
  );
};

TWITTER_Block.propTypes = {
  page_id: PropTypes.string.isRequired,
  block_data: PropTypes.object.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

export default connect(null, { updateBlock })(TWITTER_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)`
  display: flex;
`;

const TwitterContainer = styled.div`
  width: 50%;

  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    width: 100%;
  }
`;

const Image = styled(EditableImage)`
  width: 50%;
  height: ${(p) => p.h}px;
  object-fit: cover;

  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    display: none;
  }
`;
