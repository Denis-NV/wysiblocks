import React from "react";
import PropTypes from "prop-types";

import { withPageBlockUtils } from "../../.common/BlockUtils";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Components
import Settings from "./Settings";
import EditableTextfield from "../../.common/EditableTextfield";
import { MainContainer, FileBtns, DetailsModal } from "./styles";

// Default
const DOCS_PREVIEW_001_Block = (props) => {
  const {
    editor,
    theme,
    options,
    onContentUpdate,
    showEditorDraw,
    setEditorContent,
  } = props;

  // Hooks
  const [details_state, setDetailsState] = React.useState({
    is_open: false,
    file: {},
  });

  setEditorContent(Settings);

  // Handlers
  const onDownload = (file) => (e) => {
    window.open(file.download);
  };

  // Render
  const parsedDescription = (desc) => desc && desc.replace(/(<([^>]+)>)/gi, "");

  return (
    <MainContainer {...props}>
      <DetailsModal
        theme={theme}
        closeCallback={() => {
          setDetailsState({ ...details_state, is_open: false });
        }}
        is_open={details_state.is_open}
      >
        <>
          <div>
            <Typography variant="h5" paragraph>
              {details_state.file.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {parsedDescription(details_state.file.description)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {details_state.file.added}
            </Typography>
            <Typography variant="body2" paragraph>
              {details_state.file.filename}
            </Typography>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onMouseDown={onDownload(details_state.file)}
            >
              Download
            </Button>
          </div>
        </>
      </DetailsModal>
      <EditableTextfield
        content={options.title}
        updateCallback={(value) => onContentUpdate("title", value)}
        variant="h4"
        color="inherit"
      />
      <EditableTextfield
        content={options.desc}
        updateCallback={(value) => onContentUpdate("desc", value)}
        variant="body1"
        showBlockCtrls
        className="paragraph"
      />
      {options.files.length > 0 && (
        <Grid container spacing={3}>
          {options.files.map((file, index) => {
            return (
              <Grid key={index} item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  {file.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {parsedDescription(file.description)}
                </Typography>
                <FileBtns theme={theme}>
                  <Button
                    variant="contained"
                    color="primary"
                    onMouseDown={onDownload(file)}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onMouseDown={() => {
                      setDetailsState({
                        ...details_state,
                        file: { ...file },
                        is_open: true,
                      });
                    }}
                  >
                    Details
                  </Button>
                </FileBtns>
              </Grid>
            );
          })}
        </Grid>
      )}
      {editor.is_edit_mode && (
        <Grid container spacing={3} justify="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={(e) => showEditorDraw()}
          >
            {options.files.length > 0 ? "Edit files" : "Add files"}
          </Button>
        </Grid>
      )}
    </MainContainer>
  );
};

// Props, expected by the component
DOCS_PREVIEW_001_Block.propTypes = {
  editor: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  page_id: PropTypes.string.isRequired,
  block_id: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onContentUpdate: PropTypes.func.isRequired,
};

export default withPageBlockUtils(
  (state) => ({
    editor: state.Editor,
  }),
  {}
)(DOCS_PREVIEW_001_Block);
