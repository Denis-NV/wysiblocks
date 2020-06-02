import React, { forwardRef } from "react";
import PropTypes from "prop-types";

// CSS and MUI
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import ButtonBase from "@material-ui/core/ButtonBase";

import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import LinkIcon from "@material-ui/icons/Link";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";

// Components
const IconBtn = (props) => {
  const { onToggle, style, className, children } = props;

  const onBtnUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onToggle(style);
  };

  return (
    <ButtonBase
      className={className}
      onMouseUp={onBtnUp}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </ButtonBase>
  );
};

const BLOCK_TYPES = [
  { label: "UL", style: "unordered-list-item", Comp: FormatListBulletedIcon },
  { label: "OL", style: "ordered-list-item", Comp: FormatListNumberedIcon },
];

const BlockStyleControls = (props) => {
  const theme = useTheme();
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div>
      {BLOCK_TYPES.map((type) => (
        <CtrlBtn
          key={type.label}
          theme={theme}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        >
          <type.Comp fontSize="small" />
        </CtrlBtn>
      ))}
    </div>
  );
};

var INLINE_STYLES = [
  { label: "Bold", style: "BOLD", Comp: FormatBoldIcon },
  { label: "Italic", style: "ITALIC", Comp: FormatItalicIcon },
  { label: "Underline", style: "UNDERLINE", Comp: FormatUnderlinedIcon },
];

const InlineStyleControls = (props) => {
  const theme = useTheme();
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <CtrlBtn
          key={type.label}
          theme={theme}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        >
          <type.Comp fontSize="small" />
        </CtrlBtn>
      ))}
    </div>
  );
};

var ENTITY_NAMES = [{ label: "Link", style: "LINK", Comp: LinkIcon }];

const EntityControls = (props) => {
  const theme = useTheme();
  const { editorState } = props;
  const contentState = editorState.getCurrentContent();
  const startKey = editorState.getSelection().getStartKey();
  const startOffset = editorState.getSelection().getStartOffset();
  const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
  const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

  let url = "";
  if (linkKey) {
    const linkInstance = contentState.getEntity(linkKey);
    url = linkInstance.getData().url;
  }

  return (
    <div className="RichEditor-controls">
      {ENTITY_NAMES.map((type) => (
        <CtrlBtn
          key={type.label}
          theme={theme}
          label={type.label}
          active={url !== ""}
          onToggle={(entityName) => props.onToggle(entityName, url)}
          style={type.style}
        >
          <type.Comp fontSize="small" />
        </CtrlBtn>
      ))}
    </div>
  );
};

//
// Deafault
const EditableTexfieldControls = forwardRef((props, ref) => {
  const {
    editorState,
    toggleBlockTypeCallback,
    toggleInlineStyleCallback,
    toggleEntityCallback,
    showBlockCtrls,
    className,
  } = props;

  // Hooks
  const theme = useTheme();

  return (
    <Container theme={theme} className={className} ref={ref}>
      <>
        {showBlockCtrls && (
          <BlockStyleControls
            editorState={editorState}
            onToggle={toggleBlockTypeCallback}
          />
        )}
        <InlineStyleControls
          editorState={editorState}
          onToggle={toggleInlineStyleCallback}
        />
        <EntityControls
          editorState={editorState}
          onToggle={toggleEntityCallback}
        />
      </>
    </Container>
  );
});

EditableTexfieldControls.propTypes = {
  editorState: PropTypes.object.isRequired,
  toggleBlockTypeCallback: PropTypes.func.isRequired,
  toggleInlineStyleCallback: PropTypes.func.isRequired,
  toggleEntityCallback: PropTypes.func.isRequired,
  showBlockCtrls: PropTypes.bool,
};

export default EditableTexfieldControls;

// #######################################
// CSS
// #######################################

const Container = styled.div`
  background-color: ${(p) => p.theme.palette.grey[900]};
  border-radius: 3px;
  display: flex;
  padding: 4px 0px;

  & > * {
    display: flex;
    flex-direction: row;
    margin: 0 2px;
  }
`;

const CtrlBtn = styled(IconBtn)`
  background-color: ${(p) =>
    p.active ? p.theme.palette.grey[700] : p.theme.palette.grey[800]};
  color: ${(p) => p.theme.palette.grey[50]};
  border-radius: 3px;
  height: 30px;
  width: 40px;
  margin: 0 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
