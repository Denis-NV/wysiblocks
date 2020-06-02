// #######################################
// Title Block 001
// #######################################

import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { updateBlock } from "../../redux/actions/LocalActions";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";

const TL_001_Block = (props) => {
  const { block_data_set, page_id, updateBlock, setEditorContent } = props;
  const options = block_data_set.options_data;
  const block_id = block_data_set.id.toString();

  // Hooks
  const theme = useTheme();

  // Handlers
  const onContentUpdate = (field, value) => {
    const data = { [field]: value };

    updateBlock(page_id, block_id, data);
  };

  // Render
  const EditorContent = ({
    block_data_set: {
      options_data: { is_secondary },
    },
  }) => (
    <>
      <Typography variant="body1" component="span" gutterBottom>
        Dark:
      </Typography>
      <Switch
        checked={is_secondary}
        color="secondary"
        onClick={(e) => {
          updateBlock(page_id, block_id, {
            is_secondary: !is_secondary,
          });
        }}
      />
    </>
  );

  setEditorContent(EditorContent);

  return (
    <MainContainer {...props} theme={theme} settings={{ ...options }}>
      <Title
        content={options.title}
        updateCallback={(value) => onContentUpdate("title", value)}
        variant="h2"
        color="inherit"
        className="paragraph"
      />
      {options.body && (
        <Body
          content={options.body}
          updateCallback={(value) => onContentUpdate("body", value)}
          variant="body1"
          color="inherit"
          className="paragraph"
        />
      )}
    </MainContainer>
  );
};

TL_001_Block.propTypes = {
  page_id: PropTypes.string.isRequired,
  block_data_set: PropTypes.object.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

export default connect(null, { updateBlock })(TL_001_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled(EditableTextfield)`
  text-align: center;
`;

const Body = styled(EditableTextfield)`
  text-align: center;
`;
