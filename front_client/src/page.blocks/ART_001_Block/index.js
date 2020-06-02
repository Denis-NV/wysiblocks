// #######################################
// Article Block 001
// #######################################

import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { updateBlock } from "../../redux/actions/LocalActions";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";
import EditableImage from "../../.common/EditableImage";

const ART_001_Block = (props) => {
  const { block_data_set, page_id, updateBlock } = props;
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
  return (
    <MainContainer {...props}>
      <EditableTextfield
        content={options.title}
        updateCallback={(value) => onContentUpdate("title", value)}
        variant="h4"
        color="inherit"
        className="paragraph"
      />
      <Image
        theme={theme}
        updateCallback={(data) => updateBlock(page_id, block_id, data)}
        image_data={{
          url: ["image_url", options.image_url],
          alt: ["image_alt", options.image_alt],
          link: ["image_link", options.image_link],
          target: ["image_target", options.image_target],
        }}
      />
      <Caption
        content={options.images_caption}
        updateCallback={(value) => onContentUpdate("images_caption", value)}
        variant="caption"
        ltr={options.ltr}
      />
      <br />
      <EditableTextfield
        content={options.body}
        updateCallback={(value) => onContentUpdate("body", value)}
        variant="body1"
        showBlockCtrls
        className="paragraph"
      />
    </MainContainer>
  );
};

ART_001_Block.propTypes = {
  page_id: PropTypes.string.isRequired,
  block_data_set: PropTypes.object.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

export default connect(null, { updateBlock })(ART_001_Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)``;

const Image = styled(EditableImage)`
  width: 100%;
`;

const Caption = styled(EditableTextfield)`
  text-align: ${(p) => (p.ltr ? "right" : "left")};
`;
