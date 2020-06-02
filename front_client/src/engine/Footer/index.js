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
  const { block_data_set, className, editor, replaceSiteBlock } = props;

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
                      replaceSiteBlock(item, block_data_set.id);
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
        const component = block_data_set.block_data.component;

        if (component) {
          SpecializedFooter.current =
            SpecializedFooter.current ||
            React.lazy(() => import(`../../footer.blocks/${component}`));

          return (
            <React.Suspense fallback={null}>
              <SpecializedFooter.current
                block_data_set={block_data_set}
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
            block_data_set.id,
            block_data_set.type
          );
          return null;
        }
      }, [block_data_set])}
    </MainContainer>
  );
};

Footer.propTypes = {
  block_data_set: PropTypes.object.isRequired,
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
