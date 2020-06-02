import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { useDropzone } from "react-dropzone";

// CSS & MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core";

import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

// Default
const FilesDropZone = (props) => {
  const {
    className,
    onFilesSelected,
    required,
    img,
    msg,
    is_loading,
    accept,
    primary,
  } = props;

  // Hooks
  const theme = useTheme();
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const dropzone_props = accept ? { accept, onDrop } : { onDrop };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone(dropzone_props);

  const getBorderColor = (props) => {
    if (props.isDragAccept) {
      return theme.palette.success.main;
    }
    if (props.isDragReject) {
      return theme.palette.error.main;
    }
    if (props.isDragActive) {
      return theme.palette.action.active;
    }
    return theme.palette.grey[300];
  };

  return (
    <Background className={className} bg_img={img}>
      <Container
        getBorderColor={getBorderColor}
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <input
          {...getInputProps()}
          required={required}
          style={{ display: "block", opacity: 0, height: "1px", width: "1px" }}
        />
        {is_loading ? (
          <Spinner color="secondary" className="paragraph" />
        ) : (
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            size="3x"
            color={theme.palette.secondary.main}
            className="paragraph"
          />
        )}

        <Typography variant="body1" paragraph align="center">
          <strong>{msg || ""}</strong>
        </Typography>
        <Button variant="contained" color={primary ? "primary" : "secondary"}>
          Browse to Upload
        </Button>
      </Container>
    </Background>
  );
};

FilesDropZone.propTypes = {
  onFilesSelected: PropTypes.func.isRequired,
  primary: PropTypes.bool,
  required: PropTypes.bool,
  msg: PropTypes.string,
  img: PropTypes.string,
  accept: PropTypes.string,
  is_loading: PropTypes.bool,
};

export default FilesDropZone;

// #######################################
// CSS
// #######################################

const Background = styled.div`
  background-image: url(${(p) => p.bg_img || "none"});
  background-position: center;
  background-clip: padding-box;
  background-size: contain;
  background-repeat: no-repeat;
  height: 100%;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(p) => p.getBorderColor(p)};
  border-style: dashed;
  background-color: rgba(250, 250, 250, 0.8);
  color: #a5a2a2;
  height: 100%;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const Spinner = styled(CircularProgress)`
  margin-bottom: 18px;
`;
