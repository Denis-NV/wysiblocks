import React from "react";
import PropTypes from "prop-types";

// Redux
import { connect } from "react-redux";
import { replaceSiteBlock } from "../../redux/actions/LocalActions";

// CSS
import styled from "styled-components";

import { useTheme } from "@material-ui/core/styles";

// Components
import SiteBlockInstruments from "../../.common/SiteBlockInstruments";
import LeftDrawer from "../../.common/LeftDrawer";
import SiteBlockTypes from "../../.common/LeftDrawer/SiteBlockTypes";

// Deafault
const Footer = (props) => {
  const { site_block, className, editor, replaceSiteBlock } = props;

  // Hooks
  const theme = useTheme();
  const SpecializedFooter = React.useRef();
  const EditorContent = React.useRef();
  const [instr_visible, setInstrVisible] = React.useState(false);
  const [show_editor_draw, setShowEditorDraw] = React.useState(false);

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
                    actionCallback={(item) => {
                      replaceSiteBlock(item, site_block.id);
                    }}
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
          SpecializedFooter.current =
            SpecializedFooter.current ||
            React.lazy(() => import(`../../footer.blocks/${component}`));

          return (
            <React.Suspense fallback={null}>
              <SpecializedFooter.current
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

export default connect(mapStateToProps, { replaceSiteBlock })(Footer);

// #######################################
// CSS
// #######################################

const MainContainer = styled.footer`
  width: 100%;
`;
