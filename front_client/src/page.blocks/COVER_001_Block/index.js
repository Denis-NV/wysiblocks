import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { updateBlock } from "../../redux/actions/LocalActions";

// CSS & MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";

// Utils
import NumberFormat from "react-number-format";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";
import EditableBgImage from "../../.common/EditableBgImage";

const COVER_001_Block = (props) => {
  const {
    block_data,
    page_id,
    updateBlock,
    setEditorContent,
    cur_data_key,
  } = props;
  const options = block_data[cur_data_key].custom_map;
  const block_id = block_data.id;

  // Hooks
  const theme = useTheme();

  // handlers

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
      options_data: { is_secondary, bg_opacity },
    },
  }) => (
    <>
      <Typography variant="body1" component="span" gutterBottom>
        Dark:
      </Typography>
      <Switch
        checked={is_secondary}
        color="secondary"
        value="Edit"
        inputProps={{ "aria-label": "secondary checkbox" }}
        onClick={(e) => {
          updateBlock(page_id, block_id, {
            is_secondary: !is_secondary,
          });
        }}
      />
      <br />
      <br />
      <Typography variant="body1" gutterBottom>
        Background screen opacity (0 - 100):
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={bg_opacity}
        onBlur={(e) => onContentUpdate("bg_opacity", e.currentTarget.value)}
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
      />
    </>
  );

  setEditorContent(EditorContent);

  return (
    <MainContainer theme={theme} bg_opacity={options.bg_opacity / 100}>
      <Background
        image_data={{
          url: ["bg_image_url", options.bg_image_url],
        }}
        updateCallback={(data) => updateBlock(page_id, block_id, data)}
      />
      <div className="content-container">
        <Content theme={theme} settings={{ ...options }} {...props}>
          <Title
            theme={theme}
            content={options.title}
            updateCallback={(value) => onContentUpdate("title", value)}
            variant="h1"
            color="inherit"
            className="paragraph"
            is_secondary={options.is_secondary}
          />
          <Body
            theme={theme}
            content={options.body}
            updateCallback={(value) => onContentUpdate("body", value)}
            variant="body1"
            color="inherit"
            className="paragraph"
            showBlockCtrls
            is_secondary={options.is_secondary}
          />
        </Content>
      </div>
    </MainContainer>
  );
};

COVER_001_Block.propTypes = {
  block_data: PropTypes.object.isRequired,
};

export default connect(null, { updateBlock })(COVER_001_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  position: relative;

  .content-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: ${(p) =>
      p.bg_opacity && p.bg_opacity > 0
        ? `rgba(0, 0, 0, ${p.bg_opacity})`
        : p.is_secondary
        ? p.theme.palette.background.dark
        : p.theme.palette.background.default};
  }
`;

const Background = styled(EditableBgImage)`
  min-height: 280px;
`;

const Content = styled(BlockBaseLayout)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled(EditableTextfield)`
  text-transform: uppercase;
  text-align: center;
  color: ${(p) => (p.is_secondary ? "white" : p.theme.palette.text.primary)};
`;

const Body = styled(EditableTextfield)`
  text-align: center;
  color: ${(p) => (p.is_secondary ? "white" : p.theme.palette.text.primary)};
`;
