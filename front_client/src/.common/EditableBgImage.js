// #######################################
// Editable Background Image Component
// #######################################

import React, { useState } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";
import ImageIcon from "@material-ui/icons/Image";

// Components
import ContentEditImage from "./GlobalModal/ContentEditImage";
import GlobalModal from "./GlobalModal";

const ImageUpdateBtn = (props) => {
  const { onClick } = props;

  // Hooks
  const theme = useTheme();

  return (
    <UpdateBtnContainer onClick={onClick} theme={theme}>
      <ButtonBase>
        <ImageIcon fontSize="large" />
      </ButtonBase>
    </UpdateBtnContainer>
  );
};

const EditableBgImage = (props) => {
  const { className, children, editor, image_data, updateCallback } = props;

  // Hooks
  const [state, setState] = useState({
    modal_open: false,
    click_area_height: 0,
  });

  // Handlers
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
      {editor.is_edit_mode && (
        <ImageUpdateBtn
          onClick={(e) => setState({ ...state, modal_open: true })}
        />
      )}
      <Image
        className={className}
        image={image_data.url[1]}
        is_edit_mode={editor.is_edit_mode}
      >
        {children}
      </Image>
    </>
  );
};

EditableBgImage.propTypes = {
  editor: PropTypes.object.isRequired,
  updateCallback: PropTypes.func.isRequired,

  image_data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps)(EditableBgImage);

// #######################################
// CSS
// #######################################

const Image = styled.div`
  background-image: url(${(p) => p.image});
  background-position: center center;
  background-size: cover;

  outline: ${(p) => p.is_edit_mode && "1px dashed rgba(0,0,0,0.5)"};
  min-height: inherit;
`;

const UpdateBtnContainer = styled.div`
  position: absolute;
  z-index: ${(p) => p.theme.zIndex.bg_image_btn};

  & > button {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 3px;

    position: relative;
    top: 40px;
    left: 40px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
