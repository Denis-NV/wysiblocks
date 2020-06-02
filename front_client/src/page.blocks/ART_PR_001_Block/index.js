// #######################################
// Article Preview Block 001
// #######################################

import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { navigateTo, updateBlock } from "../../redux/actions/LocalActions";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";

// Components
import BlockBaseLayout from "../../.common/BlockBaseLayout";
import EditableTextfield from "../../.common/EditableTextfield";
import EditableImage from "../../.common/EditableImage";

// Utils
import { route_id_var } from "../../const";

const ART_PR_001_Block = (props) => {
  const {
    site,
    block_data_set,
    page_id,
    navigateTo,
    updateBlock,
    setEditorContent,
  } = props;
  const options = block_data_set.options_data;
  const block_id = block_data_set.id.toString();

  let url_option = [""];
  Object.entries(site.pages).forEach(([key, value]) => {
    if (!value.uri.includes(`/:${route_id_var}`)) url_option.push(value.uri);
  });
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
      options_data: { is_secondary, ltr, art_btn_url },
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
      <br />
      <Typography variant="body1" component="span" gutterBottom>
        Left to right:
      </Typography>
      <Switch
        checked={ltr}
        color="secondary"
        onClick={(e) => {
          updateBlock(page_id, block_id, {
            ltr: !ltr,
          });
        }}
      />
      <br />
      <br />
      <Typography variant="body1" gutterBottom>
        Full Article Page:
      </Typography>
      <TextField
        fullWidth
        margin="dense"
        variant="outlined"
        color="secondary"
        defaultValue={art_btn_url}
        onBlur={(e) => onContentUpdate("art_btn_url", e.currentTarget.value)}
        select
        SelectProps={{
          native: true,
        }}
      >
        {url_option.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </TextField>
    </>
  );

  setEditorContent(EditorContent);

  return (
    <MainContainer {...props} theme={theme} settings={{ ...options }}>
      <Col theme={theme}>
        <EditableTextfield
          content={options.title}
          updateCallback={(value) => onContentUpdate("title", value)}
          variant="h4"
          color="inherit"
          className="paragraph"
        />
        <EditableTextfield
          content={options.body}
          updateCallback={(value) => onContentUpdate("body", value)}
          variant="body1"
          showBlockCtrls
          className="paragraph"
        />
        <Typography variant="button">
          <Link color="inherit" onClick={() => navigateTo(options.art_btn_url)}>
            Read More
          </Link>
        </Typography>
      </Col>
      <Col theme={theme}>
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
      </Col>
    </MainContainer>
  );
};

ART_PR_001_Block.propTypes = {
  page_id: PropTypes.string.isRequired,
  block_data_set: PropTypes.object.isRequired,
  updateBlock: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    site: state.Site,
  };
};

export default connect(mapStateToProps, { navigateTo, updateBlock })(
  ART_PR_001_Block
);

// #######################################
// CSS
// #######################################

const MainContainer = styled(BlockBaseLayout)`
  display: flex;
  flex-direction: ${(p) => (p.settings.ltr ? "row-reverse" : "row")};
  margin: 0 -${(p) => p.theme.spacing(4)}px;

  @media (max-width: ${(p) => p.theme.breakpoints.values.md}px) {
    flex-direction: column;
  }
`;

const Col = styled.div`
  flex: 1;
  display: block;
  margin: 0 ${(p) => p.theme.spacing(2)}px;
`;

const Image = styled(EditableImage)`
  width: 100%;
`;

const Caption = styled(EditableTextfield)`
  text-align: ${(p) => (p.ltr ? "right" : "left")};
`;
