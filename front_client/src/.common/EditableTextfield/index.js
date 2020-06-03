// #######################################
// Editable Textfield
// #######################################

import React, { useState, useRef, createRef, useLayoutEffect } from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Utils
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  CompositeDecorator,
  convertFromRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import ReactResizeDetector from "react-resize-detector";

// Components
import EditableTexfieldControls from "./EditableTexfieldControls";
import GlobalModal from "../GlobalModal";

const LinkUI = (props) => {
  const { commitEntityCallback, link_show, onModalClose } = props;

  // Hooks
  const theme = useTheme();
  const [link_value, setLinkValue] = useState("");
  const [target_value, setTargetValue] = useState("_blank");

  return (
    <GlobalModal is_open={link_show} closeCallback={onModalClose}>
      <LinkUIForm>
        <LinkUIFields theme={theme}>
          <Typography variant="body1">URL:</Typography>
          <TextField
            variant="outlined"
            margin="dense"
            color="secondary"
            fullWidth
            value={link_value}
            onChange={(e) => setLinkValue(e.target.value)}
          />
          <br />
          <Typography variant="body1">Target:</Typography>
          <TextField
            variant="outlined"
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
            margin="dense"
            color="secondary"
            value={target_value}
            onChange={(e) => {
              setTargetValue(e.target.value);
            }}
          >
            {["_blank", "_self"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        </LinkUIFields>
        <LinkUIButtons theme={theme}>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              commitEntityCallback("LINK", {
                url: link_value,
                target: target_value,
              });
            }}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onModalClose();
            }}
          >
            Cancel
          </Button>
        </LinkUIButtons>
      </LinkUIForm>
    </GlobalModal>
  );
};

// Default
const EditableTextfield = (props) => {
  const {
    editor,
    className,
    content,
    updateCallback,
    onClick,
    showBlockCtrls,
    variant,
    color,
  } = props;

  // Helpers
  const getDecoratedDraftState = (content, html = false) => {
    const findLinkEntities = (contentBlock, callback, contentState) => {
      contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === "LINK"
        );
      }, callback);
    };

    const Link = (props) => {
      const { url, target } = props.contentState
        .getEntity(props.entityKey)
        .getData();
      return (
        <a href={url} target={target}>
          {props.children}
        </a>
      );
    };

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    if (content) {
      if (html) {
        const blocksFromHTML = convertFromHTML(content);

        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );

        return EditorState.createWithContent(state, decorator);
      } else
        return EditorState.createWithContent(
          convertFromRaw(content),
          decorator
        );
    } else return EditorState.createEmpty(decorator);
  };

  // Hooks
  const theme = useTheme();
  const container_ref = useRef();
  const ctrl_ref = createRef();
  const [editorState, setEditorState] = useState(
    getDecoratedDraftState(content)
  );
  const [ctrls_pos, setCtrlsPos] = useState({ x: 0, y: 0 });
  const [ctrls_show, setCtrlsShow] = useState(false);
  const [link_show, setLinkShow] = useState(false);
  const [ctrl_fit_left, setCtrlFitLeft] = useState(0);

  useLayoutEffect(() => {
    if (ctrl_ref.current) {
      const cont_box = container_ref.current.getBoundingClientRect();

      setCtrlFitLeft(
        cont_box.width - ctrl_ref.current.getBoundingClientRect().width
      );
    }
  }, [ctrl_ref]);

  const updateCtrlPos = () => {
    const sel = window.getSelection();

    if (sel.rangeCount !== 0) {
      const { x, y, height } = sel.getRangeAt(0).getBoundingClientRect();

      const cont_box = container_ref.current.getBoundingClientRect();

      setCtrlsPos({
        x: x - cont_box.x,
        y: y - cont_box.y + height,
      });
    }
  };

  // Handlers
  const onLinksClicked = (event) => {
    if (editor.is_edit_mode) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      onClick && onClick(event);
    }
  };

  const onContainerBlur = (event) => {
    if (editor.is_edit_mode) {
      updateCallback(convertToRaw(editorState.getCurrentContent()));
    }
  };

  const onContainerResize = (w, h) => {
    updateCtrlPos();
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const toggleEntity = (entityName, data) => {
    switch (entityName) {
      case "LINK":
        if (data !== "")
          setEditorState(
            RichUtils.toggleLink(editorState, editorState.getSelection(), null)
          );
        else {
          setLinkShow(true);
        }
        break;
      default:
        console.log("Unsupported toggle request for entity:", entityName);
        break;
    }
  };

  const commitEntity = (entityName, data) => {
    switch (entityName) {
      case "LINK":
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          "LINK",
          "MUTABLE",
          { url: data.url, target: data.target }
        );

        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });

        const new_state = RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey
        );

        setEditorState(new_state);
        setLinkShow(false);

        updateCallback(convertToRaw(new_state.getCurrentContent()));
        break;
      default:
        console.log("Unsupported commit request for entity:", entityName);
        break;
    }
  };

  const onEditorChange = (state) => {
    const sel = state.getSelection();
    const show = !sel.isCollapsed() && sel.getHasFocus();

    if (show) updateCtrlPos();
    setCtrlsShow(show);
    setEditorState(state);
  };

  // Main Render
  return (
    <>
      <Container
        ref={container_ref}
        className={className}
        theme={theme}
        variant={variant}
        onClick={onLinksClicked}
        onBlur={onContainerBlur}
        is_edit_mode={editor.is_edit_mode}
        color={color || "inherit"}
      >
        <>
          {editor.is_edit_mode && ctrls_show && (
            <Controls
              theme={theme}
              ref={ctrl_ref}
              editorState={editorState}
              toggleBlockTypeCallback={toggleBlockType}
              toggleInlineStyleCallback={toggleInlineStyle}
              toggleEntityCallback={toggleEntity}
              showBlockCtrls={showBlockCtrls}
              y={ctrls_pos.y}
              x={Math.min(ctrls_pos.x, ctrl_fit_left)}
            />
          )}
        </>
        <LinkUI
          commitEntityCallback={commitEntity}
          link_show={link_show}
          onModalClose={() => setLinkShow(false)}
        />
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={onContainerResize}
        />
        <Editor
          editorState={editorState}
          onChange={onEditorChange}
          readOnly={!editor.is_edit_mode}
        />
      </Container>
    </>
  );
};

EditableTextfield.propTypes = {
  editor: PropTypes.object.isRequired,
  variant: PropTypes.string.isRequired,
  updateCallback: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  content: PropTypes.object,
  showBlockCtrls: PropTypes.bool,
  color: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps)(EditableTextfield);

// #######################################
// CSS
// #######################################

const TypographyObj = styled.div((p) => ({ ...p.theme.typography[p.variant] }));

const Container = styled(TypographyObj)`
  color: ${(p) => p.color};
  cursor: default;

  position: relative;

  outline: ${(p) => p.is_edit_mode && "1px dashed rgba(0,0,0,0.5)"};

  :focus-within {
    outline: 1px solid
      ${(p) => (p.is_edit_mode ? p.theme.palette.secondary.main : "none")};
  }

  & a {
    color: inherit;
  }

  & .DraftEditor-root {
    ul,
    ol {
      margin-left: ${(p) => p.theme.spacing(4)}px;
      margin-bottom: ${(p) => p.theme.spacing(1)}px;
      margin-top: 0;
      margin-right: 0;
      padding: 0;
    }

    li {
      margin: 0;
      padding: 0;
    }
  }
`;

const Controls = styled(EditableTexfieldControls)`
  position: absolute;
  z-index: ${(p) => p.theme.zIndex.edit_text_filed_ctrls};
  top: ${(p) => p.y}px;
  left: ${(p) => p.x}px;
`;

const LinkUIForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`;

const LinkUIFields = styled.div`
  border: 1px solid ${(p) => p.theme.palette.grey[300]};
  border-radius: 3px;
  height: 100%;
  margin-bottom: ${(p) => p.theme.spacing(2)}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  align-items: center;

  & > * {
    width: 50%;
  }
`;

const LinkUIButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(p) => p.theme.spacing(1)}px;

  & > button {
    margin: 0 ${(p) => p.theme.spacing(1)}px;
  }
`;
