import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";

// Apollo GraphQl
import { useMutation } from "@apollo/client";
import { REPLACE_SITE_BLOCK } from "../../queries";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

// Components
import SiteBlockInstruments from "../../.common/SiteBlockInstruments";
import SiteBlockTypes from "../../.common/LeftDrawer/SiteBlockTypes";

// Deafault
const Header = (props) => {
  const { site_block, className, editor } = props;

  // Hooks
  const theme = useTheme();
  const [replaceBlock, { data }] = useMutation(REPLACE_SITE_BLOCK);
  const SpecializedHeader = React.useRef();
  const EditorContent = React.useRef();
  const [instr_visible, setInstrVisible] = React.useState(false);
  const [show_editor_draw, setShowEditorDraw] = React.useState(false);

  // Handlers
  const replaceHeader = (item) => {
    // console.log(item);

    replaceBlock({
      variables: {
        id: site_block.id,
        comp: item.component,
        order: site_block.draft.order,
        settings: item.init_data,
      },
    });
  };

  // Render
  return (
    <MainContainer
      theme={theme}
      className={className}
      onMouseEnter={() => {
        editor.is_edit_mode && setInstrVisible(true);
      }}
      onMouseLeave={() => {
        editor.is_edit_mode && setInstrVisible(false);
      }}
    >
      {editor.is_edit_mode && (instr_visible || show_editor_draw) && (
        <>
          <Drawer
            open={show_editor_draw}
            onClose={(e) => setShowEditorDraw(false)}
          >
            {EditorContent.current}
          </Drawer>
          <SiteBlockInstruments
            showEditorCb={(show) => setShowEditorDraw(show)}
            setEditorContent={(type) => {
              EditorContent.current =
                type === "replace" ? (
                  <SiteBlockTypes
                    type="header"
                    closeCallback={() => setShowEditorDraw(false)}
                    actionCallback={replaceHeader}
                  />
                ) : (
                  <div>Simple Header Settings</div>
                );
            }}
          />
        </>
      )}
      {React.useMemo(() => {
        const component = site_block.component;

        if (component) {
          SpecializedHeader.current =
            SpecializedHeader.current ||
            React.lazy(() => import(`../../header.blocks/${component}`));

          return (
            <React.Suspense fallback={null}>
              <SpecializedHeader.current
                site_block={site_block}
                cur_data_key={editor.cur_key}
                showEditorCb={() => setShowEditorDraw(true)}
                hideEditorCb={() => setShowEditorDraw(false)}
                setEditorContent={(cont) => {
                  EditorContent.current = cont;
                }}
              />
            </React.Suspense>
          );
        } else {
          console.log(
            "NO SITE BLOCK COMPONENT HAD BEEN PROVIDED!!!",
            site_block.id,
            site_block.type
          );
          return null;
        }
      }, [site_block, editor.cur_key])}
    </MainContainer>
  );
};

Header.propTypes = {
  site_block: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps, {})(Header);

// #######################################
// CSS
// #######################################

const MainContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: ${(p) => p.theme.zIndex.header};
`;
