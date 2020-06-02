// #######################################
// Editable Image Component
// #######################################

import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

// Utils
import Img from "react-image";

// Components
import ContentEditImage from "../.common/GlobalModal/ContentEditImage";
import GlobalModal from "../.common/GlobalModal";

const EditableImage = (props) => {
  const { className, editor, image_data, updateCallback } = props;

  // Hooks
  const theme = useTheme();
  const [state, setState] = useState({
    modal_open: false,
  });

  // Handlers
  const handleImageClick = (event) => {
    if (editor.is_edit_mode) {
      event.preventDefault();
      event.stopPropagation();
      event.persist();

      setState({ ...state, modal_open: true });
    } else {
      props.onClick && props.onClick(event);
    }
  };

  const onModalClose = () => {
    setState({ ...state, modal_open: false });
  };

  // Render
  return (
    <>
      <GlobalModal is_open={state.modal_open} closeCallback={onModalClose}>
        <ContentEditImage
          image_data={image_data}
          updateCallback={updateCallback}
          closeCallback={onModalClose}
        />
      </GlobalModal>
      {image_data.link ? (
        <Link
          href={image_data.link[1]}
          target={image_data.target[1]}
          rel="noopener noreferrer"
          is_edit_mode={editor.is_edit_mode}
          onClick={handleImageClick}
        >
          <Image
            className={className}
            loader={<Skeleton variant="rect" height="100%" />}
            src={image_data.url[1]}
            alt={image_data.alt[1]}
            theme={theme}
          />
        </Link>
      ) : (
        <Image
          className={className}
          loader={<Skeleton variant="rect" height="100%" />}
          src={image_data.url[1]}
          alt={image_data.alt ? image_data.alt[1] : ""}
          theme={theme}
          no_link="true"
          is_edit_mode={editor.is_edit_mode.toString()}
          onClick={handleImageClick}
        />
      )}
    </>
  );
};

EditableImage.propTypes = {
  editor: PropTypes.object.isRequired,
  updateCallback: PropTypes.func.isRequired,
  image_data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps)(EditableImage);

// #######################################
// CSS
// #######################################

const Link = styled.a`
  outline: ${(p) => p.is_edit_mode && "1px dashed rgba(0,0,0,0.5)"};
`;

const Image = styled(Img)`
  outline: ${(p) => p.is_edit_mode === "true" && "1px dashed rgba(0,0,0,0.5)"};

  :hover {
    ${(p) =>
      p.no_link === "true" && p.is_edit_mode === "true" && "cursor:pointer"};
  }
`;
