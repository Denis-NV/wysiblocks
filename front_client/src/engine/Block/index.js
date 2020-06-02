import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";

// Components
import ContentBlockInstruments from "../../.common/ContentBlockInstruments";
import BlockSkeleton from "../../.common/BlockSkeleton";
import LeftDrawer from "../../.common/LeftDrawer";

//
const Block = (props) => {
  const { editor, block_data_set, page_id, page_item_id, className } = props;

  // Hooks
  const theme = useTheme();
  const SpecializedBlock = React.useRef();
  const EditorContent = React.useRef();
  const [instr_visible, setInstrVisible] = React.useState(false);
  const [show_editor_draw, setShowEditorDraw] = React.useState(false);

  return (
    <MainContainer
      className={className}
      onMouseEnter={() => {
        editor.is_edit_mode && setInstrVisible(true);
      }}
      onMouseLeave={() => {
        editor.is_edit_mode && setInstrVisible(false);
      }}
    >
      {editor.is_edit_mode && (instr_visible || show_editor_draw) ? (
        <>
          <LeftDrawer
            is_open={show_editor_draw}
            closeCallback={() => setShowEditorDraw(false)}
          >
            <EditContainer theme={theme}>
              {EditorContent.current && (
                <EditorContent.current
                  block_data_set={block_data_set}
                  page_id={page_id}
                  hideEditorDraw={() => setShowEditorDraw(false)}
                />
              )}
            </EditContainer>
          </LeftDrawer>
          <ContentBlockInstruments
            page_id={page_id}
            blockId={block_data_set.id}
            showEditorDraw={() => setShowEditorDraw(true)}
          />
        </>
      ) : null}

      {React.useMemo(() => {
        const component = block_data_set.block_data.component;

        if (component) {
          SpecializedBlock.current =
            SpecializedBlock.current ||
            React.lazy(() => import(`../../page.blocks/${component}`));

          return (
            <React.Suspense fallback={<BlockSkeleton />}>
              <SpecializedBlock.current
                page_id={page_id}
                block_data_set={block_data_set}
                page_item_id={page_item_id}
                showEditorDraw={() => setShowEditorDraw(true)}
                hideEditorDraw={() => setShowEditorDraw(false)}
                setEditorContent={(cont) => {
                  EditorContent.current = cont;
                }}
              />
            </React.Suspense>
          );
        } else {
          console.log(
            "NO PAGE BLOCK COMPONENT HAD BEEN PROVIDED!!!",
            block_data_set.id,
            block_data_set.type
          );
          return null;
        }
      }, [block_data_set, page_item_id, page_id])}
    </MainContainer>
  );
};

Block.propTypes = {
  editor: PropTypes.object.isRequired,
  block_data_set: PropTypes.object.isRequired,
  page_id: PropTypes.string.isRequired,
  page_item_id: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps)(Block);

// #######################################
// CSS
// #######################################

const MainContainer = styled.section`
  position: relative;
`;

const EditContainer = styled.div`
  min-width: 200px;
  margin: ${(p) => p.theme.spacing(2)}px;
`;
