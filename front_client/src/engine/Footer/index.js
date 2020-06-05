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

// Components
import SiteBlockInstruments from "../../.common/SiteBlockInstruments";
import LeftDrawer from "../../.common/LeftDrawer";
import SiteBlockTypes from "../../.common/LeftDrawer/SiteBlockTypes";

// Deafault
const Footer = (props) => {
  const { site_block, className, editor } = props;

  // Hooks
  const theme = useTheme();
  const SpecializedFooter = React.useRef({});
  const EditorContent = React.useRef();
  const [instr_visible, setInstrVisible] = React.useState(false);
  const [show_editor_draw, setShowEditorDraw] = React.useState(false);

  const [replaceBlock] = useMutation(REPLACE_SITE_BLOCK);

  // Handlers
  const replaceHeader = (item) => {
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
          <LeftDrawer
            is_open={show_editor_draw}
            closeCallback={() => setShowEditorDraw(false)}
          >
            {EditorContent.current}
          </LeftDrawer>
          <SiteBlockInstruments
            showEditorCb={(show) => setShowEditorDraw(show)}
            setEditorContent={(type) => {
              EditorContent.current =
                type === "replace" ? (
                  <SiteBlockTypes
                    type="footer"
                    closeCallback={() => setShowEditorDraw(false)}
                    actionCallback={replaceHeader}
                  />
                ) : (
                  <div>Simple Footer Settings</div>
                );
            }}
          />
        </>
      )}
      {React.useMemo(() => {
        const component = site_block.component;

        if (component) {
          SpecializedFooter.current[component] =
            SpecializedFooter.current[component] ||
            React.lazy(() => import(`../../footer.blocks/${component}`));

          const CurSpecializedFooter = SpecializedFooter.current[component];

          return (
            <React.Suspense fallback={null}>
              <CurSpecializedFooter
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

Footer.propTypes = {
  site_block: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    editor: state.Editor,
  };
};

export default connect(mapStateToProps, {})(Footer);

// #######################################
// CSS
// #######################################

const MainContainer = styled.footer`
  width: 100%;
`;
