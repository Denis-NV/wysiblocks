import React from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import Button from "@material-ui/core/Button";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

// Utils
import CustomFieldHOC from "../CustomFieldHOC";
import axios from "axios";

// Components
import FilesLoader from "../../FilesLoader";

// Default
const FilesUpload = (props) => {
  const {
    required,
    options,
    value_data,
    onValueChangeCb,
    upload_url,
    id_token,
  } = props;
  const value = value_data.val || [];

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  // Hooks
  React.useEffect(() => {
    return () => {
      // cleanup logic

      source.cancel("File upload canceled due to the file field unmounting");
    };
  }, [source]);

  // Handlers
  const onDeleteFile = (file) => {
    const new_files = value.filter((cur_file) => cur_file.url !== file.url);

    onValueChangeCb([...new_files]);

    axios
      .delete(file.deleteUrl, {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      })
      .then((res) => {
        console.log("Deleted successfully");
      })
      .catch((err) => console.log(err));
  };

  //
  const getAcceptedType = (filetype) => {
    switch (filetype) {
      case "all":
        return null;
      default:
        null;
    }
  };

  // render
  return (
    <MainContainer>
      <FilesLoader
        required={required}
        accept={getAcceptedType(options.filetype)}
        token={source.token}
        upload_url={upload_url}
        id_token={id_token}
        current_files={value}
        uploadedCallback={(filenames, err) =>
          onValueChangeCb(err ? [err.message] : filenames)
        }
      />
      {value.length > 0 && (
        <div className="uploaded-files">
          {value.map((item, index) => (
            <Button
              key={index}
              variant="contained"
              disableElevation
              size="small"
              startIcon={<FontAwesomeIcon icon={faFile} size="1x" />}
              endIcon={<FontAwesomeIcon icon={faTimesCircle} size="1x" />}
              onMouseDown={(e) => onDeleteFile(item)}
            >
              {item.orig}
            </Button>
          ))}
        </div>
      )}
    </MainContainer>
  );
};

FilesUpload.propTypes = {
  upload_url: PropTypes.string.isRequired,
  id_token: PropTypes.string,
};

export default CustomFieldHOC(FilesUpload);

// #######################################
// CSS
// #######################################

const MainContainer = styled.div`
  .drop-zone {
    margin-top: 8px;
  }

  .uploaded-files {
    margin-top: 1rem;

    button {
      margin-right: 0.5rem;
      color: grey;
      margin-bottom: 0.5rem;
    }
  }
`;
